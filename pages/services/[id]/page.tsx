"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Check, CreditCard, Shield, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

// Mock data - in real app, fetch based on params.id
const service = {
  id: 2,
  name: "Pro Plan",
  price: 29.99,
  description: "Advanced features for professionals and growing teams",
  features: [
    "Unlimited projects",
    "Priority support",
    "10GB storage",
    "Advanced analytics",
    "Team collaboration",
    "Custom integrations",
    "Export capabilities",
    "Advanced security",
  ],
  billingPeriod: "monthly",
}

export default function ServiceDetailsPage() {
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    company: "",
  })

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubscribing(true)
    // Handle subscription logic
    setTimeout(() => {
      setIsSubscribing(false)
      alert("Subscription successful! Welcome to " + service.name)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/services">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Plans
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2 max-w-6xl mx-auto">
          {/* Service Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-3xl">{service.name}</CardTitle>
                  <Badge variant="secondary">Popular</Badge>
                </div>
                <CardDescription className="text-lg">{service.description}</CardDescription>
                <div className="pt-4">
                  <span className="text-5xl font-bold">${service.price}</span>
                  <span className="text-xl text-muted-foreground">/{service.billingPeriod}</span>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What's Included</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="text-center p-4">
                <Shield className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p className="text-sm font-medium">Secure</p>
                <p className="text-xs text-muted-foreground">256-bit SSL</p>
              </Card>
              <Card className="text-center p-4">
                <Clock className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <p className="text-sm font-medium">24/7 Support</p>
                <p className="text-xs text-muted-foreground">Always here</p>
              </Card>
              <Card className="text-center p-4">
                <CreditCard className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                <p className="text-sm font-medium">Easy Billing</p>
                <p className="text-xs text-muted-foreground">Cancel anytime</p>
              </Card>
            </div>
          </div>

          {/* Subscription Form */}
          <div className="lg:sticky lg:top-8">
            <Card>
              <CardHeader>
                <CardTitle>Subscribe to {service.name}</CardTitle>
                <CardDescription>Start your subscription today and get instant access</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubscribe} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Company (Optional)</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Acme Inc."
                    />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${service.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>$0.00</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>
                        ${service.price}/{service.billingPeriod}
                      </span>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isSubscribing}>
                    {isSubscribing ? "Processing..." : `Subscribe for $${service.price}/${service.billingPeriod}`}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    By subscribing, you agree to our Terms of Service and Privacy Policy. You can cancel your
                    subscription at any time.
                  </p>
                </form>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Money-Back Guarantee</h3>
                <p className="text-sm text-muted-foreground">
                  Not satisfied? Get a full refund within 30 days, no questions asked.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
