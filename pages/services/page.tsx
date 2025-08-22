"use client"

import { useState, useEffect } from "react"
import { Check, CreditCard, X, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [showCheckout, setShowCheckout] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [expandedServices, setExpandedServices] = useState<(string | number)[]>([])
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    company: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  })

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch("/subscription/rpc", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "GetServices",
            params: { active: true, page: 1, limit: 20 },
            id: 1,
          }),
        })
        const data = await res.json()
        if (data.result && data.result.services) {
          setServices(data.result.services)
          setExpandedServices(data.result.services.length > 0 ? [data.result.services[0].id] : [])
        }
      } catch (err) {
        console.error("Failed to fetch services", err)
      }
    }
    fetchServices()
  }, [])

  interface Service {
    id: string | number
    name: string
    description: string
    price: number
    currency?: string
    icon?: string
    durationInDays?: number
    features?: string[]
  }

  interface FormData {
    email: string
    fullName: string
    company: string
    cardNumber: string
    expiryDate: string
    cvv: string
  }

  const handleSubscribe = (service: Service) => {
    setSelectedService(service)
    setShowCheckout(true)
  }

  // Reusable notification sender
  async function sendNotification({
    to,
    subject,
    message,
    type = "info",
  }: { to: string; subject: string; message: string; type?: string }) {
    try {
      const res = await fetch("/notification/rpc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "SendNotification",
          params: {
            to,
            subject,
            message,
            type,
          },
          id: Date.now(),
        }),
      })
      const data = await res.json()
      if (data.error) {
        console.error("Notification error:", data.error)
      }
      return data.result
    } catch (err) {
      console.error("Failed to send notification", err)
    }
  }

  // Document event notification helpers
  async function notifyContractCreated({ to, contractTitle }: { to: string; contractTitle: string }) {
    await sendNotification({
      to,
      subject: `Contract Created: ${contractTitle}`,
      message: `A contract (${contractTitle}) was created.`,
      type: "contract",
    })
  }

  async function notifyContractSigned({ to, contractTitle }: { to: string; contractTitle: string }) {
    await sendNotification({
      to,
      subject: `Contract Signed: ${contractTitle}`,
      message: `A contract (${contractTitle}) was signed.`,
      type: "contract",
    })
  }

  async function notifyContractUpdated({ to, contractTitle }: { to: string; contractTitle: string }) {
    await sendNotification({
      to,
      subject: `Contract Updated: ${contractTitle}`,
      message: `A contract (${contractTitle}) was updated.`,
      type: "contract",
    })
  }

  async function notifyContractDeleted({ to, contractTitle }: { to: string; contractTitle: string }) {
    await sendNotification({
      to,
      subject: `Contract Deleted: ${contractTitle}`,
      message: `A contract (${contractTitle}) was deleted.`,
      type: "contract",
    })
  }

  async function notifyContractShared({ to, contractTitle, sharedWith }: { to: string; contractTitle: string; sharedWith: string }) {
    await sendNotification({
      to,
      subject: `Contract Shared: ${contractTitle}`,
      message: `A contract (${contractTitle}) was shared with ${sharedWith}.`,
      type: "contract",
    })
  }

  interface HandleCheckoutEvent extends React.FormEvent<HTMLFormElement> {}

  interface SubscriptionResponse {
    result?: { id?: string | number }
    error?: { message?: string }
  }

  const handleCheckout = async (e: HandleCheckoutEvent): Promise<void> => {
    e.preventDefault()
    setIsProcessing(true)
    try {
      if (!selectedService) {
        alert("No service selected for subscription.")
        setIsProcessing(false)
        return
      }
      const res: Response = await fetch("/subscription/rpc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "Subscribe",
          params: {
            email: formData.email,
            name: formData.fullName,
            serviceId: selectedService.id,
            metadata: {
              company: formData.company,
            },
          },
          id: Date.now(),
        }),
      })
      const data: SubscriptionResponse = await res.json()
      if (data.result && data.result.id) {
        alert(`Successfully subscribed to ${selectedService.name}!`)
        // Send notification after successful subscription
        await sendNotification({
          to: formData.email,
          subject: `Subscription Confirmed: ${selectedService.name}`,
          message: `You have successfully subscribed to ${selectedService.name}. Thank you!`,
          type: "success",
        })
        // Example: If a contract is created as part of subscription, notify here
        // await notifyDocumentEvent({ to: formData.email, contractTitle: selectedService.name, eventType: "created" })
        setShowCheckout(false)
        setSelectedService(null)
        setFormData({
          email: "",
          fullName: "",
          company: "",
          cardNumber: "",
          expiryDate: "",
          cvv: "",
        })
      } else {
        alert("Subscription failed: " + (data.error?.message || "Unknown error"))
      }
    } catch (err) {
      alert("Subscription failed: " + (err instanceof Error ? err.message : String(err)))
    }
    setIsProcessing(false)
  }

  const closeCheckout = () => {
    setShowCheckout(false)
    setSelectedService(null)
  }

  interface ToggleServiceFn {
    (serviceId: string | number): void
  }

  const toggleService: ToggleServiceFn = (serviceId) => {
    setExpandedServices((prev: (string | number)[]) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId],
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 border-b">
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Our Services</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose from our available business services and subscribe instantly.
          </p>
        </div>
      </div>

      {/* Services List */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-6">
          {services.map((service) => (
            <Card key={service.id} className="overflow-hidden">
              <Collapsible open={expandedServices.includes(service.id)} onOpenChange={() => toggleService(service.id)}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{service.icon || "🛠️"}</div>
                        <div className="text-left">
                          <CardTitle className="text-2xl">{service.name}</CardTitle>
                          <p className="text-muted-foreground mt-1">{service.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">${service.price} {service.currency || "USD"}</Badge>
                        {expandedServices.includes(service.id) ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      <Card className="relative">
                        <CardContent className="p-6">
                          <div className="text-center mb-4">
                            <h4 className="text-xl font-bold mb-2">{service.name}</h4>
                            <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                            <div className="mb-4">
                              <span className="text-3xl font-bold">${service.price}</span>
                              <span className="text-muted-foreground">/{service.durationInDays || 30} days</span>
                            </div>
                          </div>

                          <div className="space-y-2 mb-6">
                            {service.features && service.features.map((feature, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>

                          <Button
                            onClick={() => handleSubscribe(service)}
                            className="w-full"
                            variant="default"
                          >
                            Subscribe
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="max-w-5xl mx-auto mt-12 text-center">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">All subscriptions include:</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm text-muted-foreground">
                <div>✓ 14-day free trial</div>
                <div>✓ 30-day money-back guarantee</div>
                <div>✓ 24/7 customer support</div>
                <div>✓ Cancel anytime</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Checkout Modal */}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Complete Your Subscription</DialogTitle>
              <Button variant="ghost" size="sm" onClick={closeCheckout}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <DialogDescription>
              {selectedService && (
                <>
                  Subscribe to {selectedService.name} for ${selectedService.price} {selectedService.currency || "USD"}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedService && (
            <form onSubmit={handleCheckout} className="space-y-4">
              {/* Customer Information */}
              <div className="space-y-3">
                <h4 className="font-medium">Customer Information</h4>
                <div className="grid gap-3">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Company (Optional)</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Acme Inc."
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Payment Information */}
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Payment Information
                </h4>
                <div className="grid gap-3">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      value={formData.cardNumber}
                      onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                        placeholder="MM/YY"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        value={formData.cvv}
                        onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Order Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{selectedService.name}</span>
                  <span>${selectedService.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>$0.00</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>${selectedService.price} {selectedService.currency || "USD"}</span>
                </div>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
                {isProcessing ? "Processing..." : `Subscribe for $${selectedService.price} ${selectedService.currency || "USD"}`}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Secure payment • Cancel anytime • 14-day free trial
              </p>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
