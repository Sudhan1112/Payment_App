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
    const { searchParams } = new URL(request.url)
    const range = searchParams.get("range") || "6months"

    // Calculate date range
    const now = new Date()
    let startDate: Date

    switch (range) {
      case "3months":
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1)
        break
      case "12months":
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1)
        break
      default: // 6months
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1)
    }

    const db = await getDatabase()
    const transactionsCollection = db.collection<Transaction>("transactions")

    // Get transactions within date range
    const transactions = await transactionsCollection
      .find({
        userId,
        transactionDate: { $gte: startDate, $lte: now },
      })
      .toArray()

    // Calculate monthly data
    const monthlyData = []
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    for (let i = 0; i < (range === "3months" ? 3 : range === "12months" ? 12 : 6); i++) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const nextMonthDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)

      const monthTransactions = transactions.filter(
        (t) => t.transactionDate >= monthDate && t.transactionDate < nextMonthDate,
      )

      const income = monthTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

      const expenses = monthTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

      monthlyData.unshift({
        month: monthNames[monthDate.getMonth()],
        income: Math.round(income * 100) / 100,
        expenses: Math.round(expenses * 100) / 100,
        net: Math.round((income - expenses) * 100) / 100,
      })
    }

    // Calculate category data (expenses only)
    const categoryMap = new Map<string, number>()
    const expenseTransactions = transactions.filter((t) => t.type === "expense")

    expenseTransactions.forEach((transaction) => {
      const category = transaction.category || "Uncategorized"
      categoryMap.set(category, (categoryMap.get(category) || 0) + transaction.amount)
    })

    const totalExpenses = Array.from(categoryMap.values()).reduce((sum, amount) => sum + amount, 0)

    const categoryData = Array.from(categoryMap.entries())
      .map(([category, amount]) => ({
        category,
        amount: Math.round(amount * 100) / 100,
        percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount)

    // Calculate totals and trends
    const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

    const totalExpensesAmount = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

    const netIncome = totalIncome - totalExpensesAmount

    // Calculate trends (simplified - comparing first half vs second half of period)
    const midPoint = new Date(startDate.getTime() + (now.getTime() - startDate.getTime()) / 2)

    const firstHalfTransactions = transactions.filter((t) => t.transactionDate < midPoint)
    const secondHalfTransactions = transactions.filter((t) => t.transactionDate >= midPoint)

    const firstHalfIncome = firstHalfTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0)

    const secondHalfIncome = secondHalfTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0)

    const firstHalfExpenses = firstHalfTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0)

    const secondHalfExpenses = secondHalfTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0)

    const incomeChange = firstHalfIncome > 0 ? ((secondHalfIncome - firstHalfIncome) / firstHalfIncome) * 100 : 0
    const expenseChange =
      firstHalfExpenses > 0 ? ((secondHalfExpenses - firstHalfExpenses) / firstHalfExpenses) * 100 : 0
    const netChange = secondHalfIncome - secondHalfExpenses - (firstHalfIncome - firstHalfExpenses)

    return NextResponse.json({
      monthlyData,
      categoryData,
      trends: {
        incomeChange: Math.round(incomeChange * 100) / 100,
        expenseChange: Math.round(expenseChange * 100) / 100,
        netChange: Math.round(netChange * 100) / 100,
      },
      totals: {
        totalIncome: Math.round(totalIncome * 100) / 100,
        totalExpenses: Math.round(totalExpensesAmount * 100) / 100,
        netIncome: Math.round(netIncome * 100) / 100,
      },
    })
  } catch (error) {
    console.error("Analytics error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
