import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, CreditCard, Shield, TrendingUp, ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Track, Manage, and Save Smarter
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Take Control of Your <span className="text-green-600">Finances</span> with Effortless Expense Tracking
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Track, manage, and save smarter with real-time insights. Your money to financial freedom starts here.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-black text-white hover:bg-gray-800">
                  Try for free
                </Button>
                <Button size="lg" variant="outline" className="border-gray-300 bg-transparent">
                  Preview <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-white"></div>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">10k+</p>
                  <p className="text-sm text-gray-600">Happy customers</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-6 space-y-6">
                {/* Balance Card */}
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                  <p className="text-green-100 text-sm">Your Balance</p>
                  <p className="text-3xl font-bold">$16,648</p>
                  <p className="text-green-100 text-sm">+8% from last month</p>
                </div>

                {/* Expense Chart */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Expense Chart</h3>
                    <Badge variant="outline">Weekly</Badge>
                  </div>
                  <div className="h-32 bg-gray-50 rounded-lg flex items-end justify-center space-x-2 p-4">
                    <div className="w-8 bg-green-500 rounded-t" style={{ height: "60%" }}></div>
                    <div className="w-8 bg-green-400 rounded-t" style={{ height: "80%" }}></div>
                    <div className="w-8 bg-green-300 rounded-t" style={{ height: "40%" }}></div>
                    <div className="w-8 bg-green-500 rounded-t" style={{ height: "90%" }}></div>
                    <div className="w-8 bg-green-400 rounded-t" style={{ height: "70%" }}></div>
                  </div>
                </div>

                {/* Recent Transactions */}
                <div className="space-y-3">
                  <h3 className="font-semibold">Recent Activity</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-orange-600 text-xs">☕</span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">Coffee & Drinks</p>
                          <p className="text-xs text-gray-500">Today</p>
                        </div>
                      </div>
                      <p className="font-semibold text-red-600">-$24.0</p>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-xs">🏢</span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">Online Subscription</p>
                          <p className="text-xs text-gray-500">Yesterday</p>
                        </div>
                      </div>
                      <p className="font-semibold text-red-600">-$54.0</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-3">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">8+ Features</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Company Logos */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex items-center justify-center space-x-12 opacity-60">
            <span className="text-2xl font-bold text-gray-400">ZOOM</span>
            <span className="text-2xl font-bold text-gray-400">LARK</span>
            <span className="text-2xl font-bold text-gray-400">DHAKA</span>
            <span className="text-2xl font-bold text-gray-400">BlueEnergy</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-gray-900">Control your financial future easily</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Create targeted savings goals with automated transfers, monitor progress, and receive personalized savings
              tips.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="space-y-4 p-0">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold">Custom and design your card</h3>
                <p className="text-gray-600">
                  Create targeted savings goals with automated transfers, monitor progress, and receive personalized
                  savings tips.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="space-y-4 p-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold">Full Analytics in Your App</h3>
                <p className="text-gray-600">
                  Create targeted savings goals with automated transfers, monitor progress, and receive personalized
                  savings tips.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="space-y-4 p-0">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold">Transaction History</h3>
                <p className="text-gray-600">
                  Create targeted savings goals with automated transfers, monitor progress, and receive personalized
                  savings tips.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">Ready to take control of your finances?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of users who are already managing their money smarter.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-green-600 hover:bg-green-700" asChild>
              <Link href="/register">Get Started Free</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800 bg-transparent">
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
