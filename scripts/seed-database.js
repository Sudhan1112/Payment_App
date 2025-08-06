import { MongoClient } from "mongodb"
import bcrypt from "bcryptjs"

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"
const client = new MongoClient(uri)

async function seedDatabase() {
  try {
    await client.connect()
    const db = client.db("budgetti")

    // Create collections and indexes
    const usersCollection = db.collection("users")
    const transactionsCollection = db.collection("transactions")
    const userSettingsCollection = db.collection("userSettings")

    // Create indexes
    await usersCollection.createIndex({ email: 1 }, { unique: true })
    await usersCollection.createIndex({ googleId: 1 })
    await transactionsCollection.createIndex({ userId: 1 })
    await transactionsCollection.createIndex({ transactionDate: -1 })
    await userSettingsCollection.createIndex({ userId: 1 }, { unique: true })

    // Check if admin user exists
    const existingAdmin = await usersCollection.findOne({ email: "admin@budgetti.com" })

    if (!existingAdmin) {
      // Create admin user
      const adminPasswordHash = await bcrypt.hash("admin123", 12)
      const adminUser = await usersCollection.insertOne({
        email: "admin@budgetti.com",
        name: "Admin User",
        role: "admin",
        passwordHash: adminPasswordHash,
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      // Create admin settings
      await userSettingsCollection.insertOne({
        userId: adminUser.insertedId,
        theme: "light",
        notifications: true,
        twoFactorEnabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      // Create sample transactions for admin
      const sampleTransactions = [
        {
          userId: adminUser.insertedId,
          amount: 5000,
          type: "income",
          category: "Salary",
          description: "Monthly salary",
          status: "completed",
          transactionDate: new Date(),
          createdAt: new Date(),
        },
        {
          userId: adminUser.insertedId,
          amount: 1200,
          type: "expense",
          category: "Rent",
          description: "Monthly rent payment",
          status: "completed",
          transactionDate: new Date(Date.now() - 86400000), // Yesterday
          createdAt: new Date(),
        },
        {
          userId: adminUser.insertedId,
          amount: 300,
          type: "expense",
          category: "Food",
          description: "Grocery shopping",
          status: "completed",
          transactionDate: new Date(Date.now() - 172800000), // 2 days ago
          createdAt: new Date(),
        },
        {
          userId: adminUser.insertedId,
          amount: 150,
          type: "expense",
          category: "Transport",
          description: "Gas and maintenance",
          status: "completed",
          transactionDate: new Date(Date.now() - 259200000), // 3 days ago
          createdAt: new Date(),
        },
        {
          userId: adminUser.insertedId,
          amount: 2000,
          type: "income",
          category: "Freelance",
          description: "Web development project",
          status: "completed",
          transactionDate: new Date(Date.now() - 345600000), // 4 days ago
          createdAt: new Date(),
        },
      ]

      await transactionsCollection.insertMany(sampleTransactions)

      console.log("Database seeded successfully!")
      console.log("Admin user created: admin@budgetti.com / admin123")
    } else {
      console.log("Admin user already exists, skipping seed.")
    }
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    await client.close()
  }
}

seedDatabase()
