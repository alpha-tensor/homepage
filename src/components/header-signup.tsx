"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Loader2 } from "lucide-react"

export default function HeaderSignup() {
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
      <div className="bg-gray-100 border border-[#fb5028]/30 rounded-lg p-3 text-center">
        <div className="text-[#fb5028] text-sm mb-1">✓</div>
        <p className="text-sm">Thank you! We'll be in touch.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-md">
      <div className="flex-1">
        <Input
          type="email"
          placeholder="Enter your email"
          className="bg-white border-gray-300 h-10 focus:border-[#fb5028] focus:ring-[#fb5028]/20"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {error && <p className="text-red-500 text-xs mt-1 absolute">{error}</p>}
      </div>
      <Button
        type="submit"
        className="bg-[#fb5028] hover:bg-[#e04520] text-white font-medium h-10 whitespace-nowrap"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 size={16} className="mr-1 animate-spin" />
            <span className="sr-only">Processing...</span>
          </>
        ) : (
          <>
            Get Access <ArrowRight size={16} className="ml-1" />
          </>
        )}
      </Button>
    </form>
  )
}
