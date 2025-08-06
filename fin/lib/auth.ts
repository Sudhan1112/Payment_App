import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { getDatabase } from "@/lib/mongodb"
import bcrypt from "bcryptjs"
import type { User } from "@/lib/models/User"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const db = await getDatabase()
          const usersCollection = db.collection<User>("users")

          const user = await usersCollection.findOne({ email: credentials.email })

          if (!user || !user.passwordHash) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash)
          if (!isPasswordValid) {
            return null
          }

          return {
            id: user._id!.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.image,
          }
        } catch (error) {
          console.error("Authorization error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const db = await getDatabase()
          const usersCollection = db.collection<User>("users")
          const userSettingsCollection = db.collection("userSettings")

          // Check if user already exists
          const existingUser = await usersCollection.findOne({ 
            $or: [
              { email: user.email! },
              { googleId: account.providerAccountId }
            ]
          })

          if (!existingUser) {
            // Create new user
            const newUser = await usersCollection.insertOne({
              email: user.email!,
              name: user.name || "",
              image: user.image,
              googleId: account.providerAccountId,
              emailVerified: true,
              role: "user",
              createdAt: new Date(),
              updatedAt: new Date(),
            })

            // Create default user settings
            await userSettingsCollection.insertOne({
              userId: newUser.insertedId,
              theme: "light",
              notifications: true,
              twoFactorEnabled: false,
              createdAt: new Date(),
              updatedAt: new Date(),
            })

            console.log("New Google user created:", user.email)
          } else {
            // Update existing user
            await usersCollection.updateOne(
              { _id: existingUser._id },
              {
                $set: {
                  googleId: account.providerAccountId,
                  image: user.image,
                  emailVerified: true,
                  updatedAt: new Date(),
                  ...(user.name && { name: user.name })
                },
              },
            )

            console.log("Existing user updated:", user.email)
          }
          return true
        } catch (error) {
          console.error("Error during Google sign in:", error)
          return false
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        try {
          const db = await getDatabase()
          const usersCollection = db.collection<User>("users")
          
          const dbUser = await usersCollection.findOne({ 
            $or: [
              { email: user.email! },
              { googleId: account?.providerAccountId }
            ]
          })
          
          if (dbUser) {
            token.role = dbUser.role || "user"
            token.id = dbUser._id!.toString()
          }
        } catch (error) {
          console.error("JWT callback error:", error)
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
}