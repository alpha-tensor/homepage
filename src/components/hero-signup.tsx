"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Loader2 } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export default function HeroSignup() {
  const [email, setEmail] = useState("")
  const [requestType, setRequestType] = useState("alpha-access")
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
      <div className="bg-white shadow-md border border-[#fb5028]/30 rounded-lg p-6 text-center max-w-md mx-auto">
        <div className="text-[#fb5028] text-xl mb-2">✓</div>
        <h3 className="text-xl font-medium mb-2">Thank you for your interest!</h3>
        <p className="text-gray-600">
          {requestType === "alpha-access"
            ? "We'll notify you when alpha access becomes available."
            : "Our team will contact you to schedule a demo."}
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6 max-w-md mx-auto">
      <h3 className="text-xl font-bold mb-4">Get Started</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="email"
            placeholder="Enter your email address"
            className="bg-white border-gray-300 h-12 focus:border-[#fb5028] focus:ring-[#fb5028]/20"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        <RadioGroup
          defaultValue="alpha-access"
          value={requestType}
          onValueChange={setRequestType}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="alpha-access" id="alpha-access" />
            <Label htmlFor="alpha-access">Alpha Access</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="demo-schedule" id="demo-schedule" />
            <Label htmlFor="demo-schedule">Schedule Demo</Label>
          </div>
        </RadioGroup>

        <Button
          type="submit"
          className="bg-[#fb5028] hover:bg-[#e04520] text-white font-medium h-12 w-full"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 size={18} className="mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              {requestType === "alpha-access" ? "Request Access" : "Schedule Demo"}{" "}
              <ArrowRight size={18} className="ml-2" />
            </>
          )}
        </Button>
      </form>
    </div>
  )
}
