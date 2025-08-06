import type { ObjectId } from "mongodb"

export interface User {
  _id?: ObjectId
  email: string
  name: string
  phone?: string
  role: string
  image?: string
  passwordHash?: string
  googleId?: string
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Transaction {
  _id?: ObjectId
  userId: ObjectId
  amount: number
  type: "income" | "expense" | "transfer"
  category?: string
  description?: string
  status: "pending" | "completed" | "failed"
  transactionDate: Date
  createdAt: Date
}

export interface UserSettings {
  _id?: ObjectId
  userId: ObjectId
  theme: "light" | "dark"
  notifications: boolean
  twoFactorEnabled: boolean
  createdAt: Date
  updatedAt: Date
}