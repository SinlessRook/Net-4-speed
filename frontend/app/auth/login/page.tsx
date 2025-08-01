"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Eye, EyeOff, Wifi, Mail, Lock } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

const LoginPage = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError("") // Clear error when user types
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock authentication logic
      if (formData.email === "demo@racing.com" && formData.password === "password") {
        // Store user session (in real app, use proper auth)
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: "1",
            email: formData.email,
            username: "SpeedRacer",
            avatar: "🏎️",
            points: 1850,
            wins: 12,
            losses: 8,
          }),
        )
        router.push("/")
      } else {
        setError("Invalid email or password. Try demo@racing.com / password")
      }
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setFormData({
      email: "demo@racing.com",
      password: "password",
    })
    setLoading(true)

    // Auto-submit after setting demo credentials
    setTimeout(() => {
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: "1",
          email: "demo@racing.com",
          username: "SpeedRacer",
          avatar: "🏎️",
          points: 1850,
          wins: 12,
          losses: 8,
        }),
      )
      router.push("/")
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-cyan-900 to-gray-900 p-4 flex items-center justify-center">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Wifi className="w-10 h-10 text-cyan-400" />
            <h1 className="text-4xl font-bold text-white">
              <span className="text-cyan-400">Network</span> Racing
            </h1>
          </div>
          <p className="text-gray-300">Sign in to start racing with your internet speed!</p>
        </div>

        {/* Login Form */}
        <Card className="p-8 bg-gray-800 border-cyan-400">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white text-center mb-2">Welcome Back!</h2>
            <p className="text-gray-400 text-center">Sign in to your racing account</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900 border border-red-600 rounded-lg">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400" />
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-cyan-400" />
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-cyan-600 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500"
                />
                <span className="ml-2 text-sm text-gray-300">Remember me</span>
              </label>
              <Link href="/auth/forgot-password" className="text-sm text-cyan-400 hover:text-cyan-300">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-3"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing In...
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Demo Login */}
          <div className="mt-6 pt-6 border-t border-gray-600">
            <Button
              onClick={handleDemoLogin}
              disabled={loading}
              variant="outline"
              className="w-full border-yellow-600 text-yellow-400 hover:bg-yellow-600 hover:text-black bg-transparent"
            >
              🎮 Try Demo Account
            </Button>
            <p className="text-xs text-gray-500 text-center mt-2">Email: demo@racing.com | Password: password</p>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <Link href="/auth/signup" className="text-cyan-400 hover:text-cyan-300 font-medium">
                Sign up here
              </Link>
            </p>
          </div>
        </Card>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Button onClick={() => router.push("/")} variant="outline" className="flex items-center gap-2 mx-auto">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
