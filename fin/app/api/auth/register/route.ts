import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getDatabase } from "@/lib/mongodb"
import type { User } from "@/lib/models/User"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone, role } = await request.json()

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Name, email, and password are required" }, { status: 400 })
    }

    const db = await getDatabase()
    const usersCollection = db.collection<User>("users")
    const userSettingsCollection = db.collection("userSettings")

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email })

    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 400 })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Create user
    const newUser = await usersCollection.insertOne({
      name,
      email,
      passwordHash,
      phone: phone || undefined,
      role: role || "user",
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Create user settings
    await userSettingsCollection.insertOne({
      userId: newUser.insertedId,
      theme: "light",
      notifications: true,
      twoFactorEnabled: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: newUser.insertedId.toString(),
          name,
          email,
          role: role || "user",
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
