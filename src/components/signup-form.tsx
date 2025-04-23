"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Loader2 } from "lucide-react"

export default function SignupForm() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setError("Please enter your email address")
      return
    }

    setLoading(true)
    setError("")

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setSubmitted(true)
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-gray-100 border border-[#fb5028]/30 rounded-lg p-6 text-center">
        <div className="text-[#fb5028] text-xl mb-2">✓</div>
        <h3 className="text-xl font-medium mb-2">Thank you for your interest!</h3>
        <p className="text-gray-600">We'll notify you when early access becomes available.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Input
            type="email"
            placeholder="Enter your email address"
            className="bg-white border-gray-300 h-12 focus:border-[#fb5028] focus:ring-[#fb5028]/20"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
        <Button
          type="submit"
          className="bg-[#fb5028] hover:bg-[#e04520] text-white font-medium h-12"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 size={18} className="mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Request Access <ArrowRight size={18} className="ml-2" />
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
