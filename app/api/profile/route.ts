import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { User, UserSettings } from "@/lib/models/User"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const userId = new ObjectId(session.user.id)
    const db = await getDatabase()
    const usersCollection = db.collection<User>("users")
    const userSettingsCollection = db.collection<UserSettings>("userSettings")

    const user = await usersCollection.findOne({ _id: userId })
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    const userSettings = await userSettingsCollection.findOne({ userId })

    return NextResponse.json({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      role: user.role,
      image: user.image || "",
      theme: userSettings?.theme || "light",
      notifications: userSettings?.notifications || false,
      two_factor_enabled: userSettings?.twoFactorEnabled || false,
    })
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const userId = new ObjectId(session.user.id)
    const { name, email, phone, theme, notifications, two_factor_enabled } = await request.json()

    const db = await getDatabase()
    const usersCollection = db.collection<User>("users")
    const userSettingsCollection = db.collection<UserSettings>("userSettings")

    // Update user information
    await usersCollection.updateOne(
      { _id: userId },
      {
        $set: {
          name,
          email,
          phone,
          updatedAt: new Date(),
        },
      },
    )

    // Update user settings
    await userSettingsCollection.updateOne(
      { userId },
      {
        $set: {
          theme,
          notifications,
          twoFactorEnabled: two_factor_enabled,
          updatedAt: new Date(),
        },
      },
      { upsert: true },
    )

    return NextResponse.json({ message: "Profile updated successfully" })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
