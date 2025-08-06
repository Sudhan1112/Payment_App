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

    // Get current month start and end dates
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

    // Calculate total balance
    const allTransactions = await transactionsCollection.find({ userId }).toArray()
    const totalBalance = allTransactions.reduce((sum, transaction) => {
      return transaction.type === "income" ? sum + transaction.amount : sum - transaction.amount
    }, 0)

    // Calculate monthly income
    const monthlyIncomeTransactions = await transactionsCollection
      .find({
        userId,
        type: "income",
        transactionDate: { $gte: monthStart, $lte: monthEnd },
      })
      .toArray()
    const monthlyIncome = monthlyIncomeTransactions.reduce((sum, t) => sum + t.amount, 0)

    // Calculate monthly expenses
    const monthlyExpenseTransactions = await transactionsCollection
      .find({
        userId,
        type: "expense",
        transactionDate: { $gte: monthStart, $lte: monthEnd },
      })
      .toArray()
    const monthlyExpenses = monthlyExpenseTransactions.reduce((sum, t) => sum + t.amount, 0)

    // Get total transactions count for current month
    const totalTransactions = await transactionsCollection.countDocuments({
      userId,
      transactionDate: { $gte: monthStart, $lte: monthEnd },
    })

    // Get recent transactions
    const recentTransactions = await transactionsCollection
      .find({ userId })
      .sort({ transactionDate: -1 })
      .limit(5)
      .toArray()

    // Format recent transactions for response
    const formattedRecentTransactions = recentTransactions.map((transaction) => ({
      id: transaction._id!.toString(),
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category || "",
      description: transaction.description || "",
      transaction_date: transaction.transactionDate.toISOString(),
    }))

    return NextResponse.json({
      totalBalance: Math.round(totalBalance * 100) / 100,
      monthlyIncome: Math.round(monthlyIncome * 100) / 100,
      monthlyExpenses: Math.round(monthlyExpenses * 100) / 100,
      totalTransactions,
      recentTransactions: formattedRecentTransactions,
    })
  } catch (error) {
    console.error("Dashboard stats error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
