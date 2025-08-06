import { neon } from "@neondatabase/serverless"

export const sql = neon(process.env.DATABASE_URL!)

export interface User {
  id: number
  email: string
  name: string
  phone?: string
  role: string
  image?: string
  password_hash?: string
  google_id?: string
  email_verified: boolean
  created_at: Date
  updated_at: Date
}

export interface Transaction {
  id: number
  user_id: number
  amount: number
  type: "income" | "expense" | "transfer"
  category?: string
  description?: string
  status: "pending" | "completed" | "failed"
  transaction_date: Date
  created_at: Date
}

export interface UserSettings {
  id: number
  user_id: number
  theme: "light" | "dark"
  notifications: boolean
  two_factor_enabled: boolean
  created_at: Date
  updated_at: Date
}
