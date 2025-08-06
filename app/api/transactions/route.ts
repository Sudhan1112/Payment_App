import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { Transaction } from "@/lib/models/Transaction"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const userId = new ObjectId(session.user.id)
    const db = await getDatabase()
    const transactionsCollection = db.collection<Transaction>("transactions")

    const transactions = await transactionsCollection.find({ userId }).sort({ transactionDate: -1 }).toArray()

    // Format transactions for response
    const formattedTransactions = transactions.map((transaction) => ({
      _id: transaction._id!.toString(),
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category,
      description: transaction.description,
      status: transaction.status,
      transactionDate: transaction.transactionDate.toISOString(),
      createdAt: transaction.createdAt.toISOString(),
    }))

    return NextResponse.json(formattedTransactions)
  } catch (error) {
    console.error("Transactions fetch error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const userId = new ObjectId(session.user.id)
    const { amount, type, category, description } = await request.json()

    // Validate required fields
    if (!amount || !type) {
      return NextResponse.json({ message: "Amount and type are required" }, { status: 400 })
    }

    if (amount <= 0) {
      return NextResponse.json({ message: "Amount must be greater than 0" }, { status: 400 })
    }

    if (!["income", "expense", "transfer"].includes(type)) {
      return NextResponse.json({ message: "Invalid transaction type" }, { status: 400 })
    }

    const db = await getDatabase()
    const transactionsCollection = db.collection<Transaction>("transactions")

    const newTransaction = await transactionsCollection.insertOne({
      userId,
      amount: Number.parseFloat(amount),
      type,
      category: category || undefined,
      description: description || undefined,
      status: "completed",
      transactionDate: new Date(),
      createdAt: new Date(),
    })

    return NextResponse.json(
      {
        message: "Transaction created successfully",
        transaction: {
          _id: newTransaction.insertedId.toString(),
          amount: Number.parseFloat(amount),
          type,
          category,
          description,
          status: "completed",
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Transaction creation error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
