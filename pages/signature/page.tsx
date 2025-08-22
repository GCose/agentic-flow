"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { FileText, PenTool, Type, User, Check, Download, Send } from "lucide-react"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import RoleBasedRoute from "@/components/auth/RoleBasedRoute"

function SignaturePageContent() {
  const [signatureType, setSignatureType] = useState<"draw" | "type" | "upload">("draw")
  const [isDrawing, setIsDrawing] = useState(false)
  const [typedSignature, setTypedSignature] = useState("")
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (canvas) {
      const rect = canvas.getBoundingClientRect()
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.beginPath()
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
      }
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (canvas) {
      const rect = canvas.getBoundingClientRect()
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
        ctx.stroke()
      }
    }
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }
  }

  return (
    <div className="flex flex-col min-h-0 flex-1">
      {/* Header */}
      <header className="bg-card/90 backdrop-blur-sm border-b border-border px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-foreground">Document Signature</h1>
            <Badge variant="outline" className="border-border text-muted-foreground">Service Agreement - Acme Corp</Badge>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="border-border hover:bg-accent hover:text-accent-foreground">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-blue-900 via-blue-900 to-blue-500 hover:from-blue-800 hover:via-blue-700 hover:to-blue-400 text-white shadow-lg shadow-blue-500/20">
              <Send className="h-4 w-4 mr-2" />
              Complete Signing
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto bg-background/50">
        <div className="max-w-6xl mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Document Preview */}
          <div className="lg:col-span-2">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <FileText className="h-5 w-5 mr-2" />
                  Document Preview
                </CardTitle>
                <CardDescription className="text-muted-foreground">Review the document before signing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-background border border-border rounded-lg p-6 min-h-[600px]">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-foreground">SERVICE AGREEMENT</h2>
                    <p className="text-muted-foreground mt-2">Between Your Company and Acme Corp</p>
                  </div>

                  <div className="space-y-4 text-sm">
                    <p>
                      This Service Agreement ("Agreement") is entered into on [DATE] between Your Company ("Service
                      Provider") and Acme Corp ("Client").
                    </p>

                    <div>
                      <h3 className="font-semibold mb-2">1. SERVICES</h3>
                      <p>
                        The Service Provider agrees to provide web development services including but not limited to
                        website design, development, and maintenance as outlined in the attached project specification.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">2. COMPENSATION</h3>
                      <p>
                        Client agrees to pay Service Provider a total fee of $15,000 for the services outlined in this
                        agreement. Payment terms are Net 30 days.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">3. TIMELINE</h3>
                      <p>
                        The project is expected to be completed within 8-10 weeks from the start date, subject to timely
                        feedback and approval from the Client.
                      </p>
                    </div>

                    <div className="mt-8 pt-6 border-t">
                      <div className="grid grid-cols-2 gap-8">
                        <div>
                          <h4 className="font-semibold mb-2">Service Provider</h4>
                          <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg bg-blue-50">
                            <p className="text-center text-gray-600">Your signature will appear here</p>
                          </div>
                          <div className="mt-2 text-sm text-gray-600">
                            <p>Name: ________________________</p>
                            <p>Date: ________________________</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Client</h4>
                          <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg">
                            <p className="text-center text-gray-600">Awaiting client signature</p>
                          </div>
                          <div className="mt-2 text-sm text-gray-600">
                            <p>Name: ________________________</p>
                            <p>Date: ________________________</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Signature Panel */}
          <div className="space-y-6">
            {/* Signer Information */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <User className="h-5 w-5 mr-2" />
                  Signer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="signerName" className="text-foreground">Full Name</Label>
                  <Input id="signerName" placeholder="Enter your full name" className="bg-input border-border text-foreground" />
                </div>
                <div>
                  <Label htmlFor="signerEmail" className="text-foreground">Email Address</Label>
                  <Input id="signerEmail" type="email" placeholder="your@email.com" className="bg-input border-border text-foreground" />
                </div>
                <div>
                  <Label htmlFor="signerTitle" className="text-foreground">Title/Position</Label>
                  <Input id="signerTitle" placeholder="e.g., CEO, Manager" className="bg-input border-border text-foreground" />
                </div>
                <div>
                  <Label htmlFor="signerDate" className="text-foreground">Signing Date</Label>
                  <Input id="signerDate" type="date" defaultValue={new Date().toISOString().split("T")[0]} className="bg-input border-border text-foreground" />
                </div>
              </CardContent>
            </Card>

            {/* Signature Creation */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Create Your Signature</CardTitle>
                <CardDescription className="text-muted-foreground">Choose how you'd like to sign</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Signature Type Selector */}
                <div className="flex space-x-2">
                  <Button
                    variant={signatureType === "draw" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSignatureType("draw")}
                    className={signatureType === "draw" 
                      ? "bg-gradient-to-r from-blue-900 via-blue-900 to-blue-500 hover:from-blue-800 hover:via-blue-700 hover:to-blue-400 text-white shadow-lg shadow-blue-500/20" 
                      : "border-border hover:bg-accent hover:text-accent-foreground"
                    }
                  >
                    <PenTool className="h-4 w-4 mr-2" />
                    Draw
                  </Button>
                  <Button
                    variant={signatureType === "type" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSignatureType("type")}
                    className={signatureType === "type" 
                      ? "bg-gradient-to-r from-blue-900 via-blue-900 to-blue-500 hover:from-blue-800 hover:via-blue-700 hover:to-blue-400 text-white shadow-lg shadow-blue-500/20" 
                      : "border-border hover:bg-accent hover:text-accent-foreground"
                    }
                  >
                    <Type className="h-4 w-4 mr-2" />
                    Type
                  </Button>
                </div>

                {/* Draw Signature */}
                {signatureType === "draw" && (
                  <div className="space-y-3">
                    <Label className="text-foreground">Draw your signature below</Label>
                    <div className="border border-border rounded-lg p-2 bg-background">
                      <canvas
                        ref={canvasRef}
                        width={300}
                        height={150}
                        className="border-2 border-dashed border-border rounded cursor-crosshair w-full"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                      />
                    </div>
                    <Button variant="outline" size="sm" onClick={clearCanvas} className="border-border hover:bg-accent hover:text-accent-foreground">
                      Clear
                    </Button>
                  </div>
                )}

                {/* Type Signature */}
                {signatureType === "type" && (
                  <div className="space-y-3">
                    <Label htmlFor="typedSig" className="text-foreground">Type your signature</Label>
                    <Input
                      id="typedSig"
                      placeholder="Enter your name"
                      value={typedSignature}
                      onChange={(e) => setTypedSignature(e.target.value)}
                      className="font-serif text-2xl bg-input border-border text-foreground"
                    />
                    <div className="border border-border rounded-lg p-4 bg-card min-h-[100px] flex items-center justify-center">
                      <span className="font-serif text-3xl text-foreground">
                        {typedSignature || "Your signature will appear here"}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Agreement Confirmation */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Agreement Confirmation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <input type="checkbox" id="terms" className="mt-1" />
                    <label htmlFor="terms" className="text-sm text-foreground">
                      I have read and agree to the terms and conditions outlined in this document.
                    </label>
                  </div>
                  <div className="flex items-start space-x-2">
                    <input type="checkbox" id="authority" className="mt-1" />
                    <label htmlFor="authority" className="text-sm text-foreground">
                      I have the authority to sign this document on behalf of my organization.
                    </label>
                  </div>
                  <div className="flex items-start space-x-2">
                    <input type="checkbox" id="electronic" className="mt-1" />
                    <label htmlFor="electronic" className="text-sm">
                      I consent to the use of electronic signatures and agree that my electronic signature has the same
                      legal effect as a handwritten signature.
                    </label>
                  </div>
                </div>

                <Button className="w-full" size="lg">
                  <Check className="h-4 w-4 mr-2" />
                  Sign Document
                </Button>
              </CardContent>
            </Card>

            {/* Signing Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Signing Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm">Document sent</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm">Document opened</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">2</span>
                    </div>
                    <span className="text-sm font-medium">Your signature (in progress)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 text-xs">3</span>
                    </div>
                    <span className="text-sm text-gray-500">Client signature (pending)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 text-xs">4</span>
                    </div>
                    <span className="text-sm text-gray-500">Document completed</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SignaturePage() {
  return (
    <RoleBasedRoute allowedRoles={['admin', 'client', 'videographer', 'designer']}>
      <DashboardLayout
        meta={{
          title: "Document Signature",
          description: "Sign and manage document signatures"
        }}
        allowedRoles={['admin', 'client', 'videographer', 'designer']}
      >
        <SignaturePageContent />
      </DashboardLayout>
    </RoleBasedRoute>
  )
}
