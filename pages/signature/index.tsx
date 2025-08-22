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
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Document Signature</h1>
            <Badge variant="outline">Service Agreement - Acme Corp</Badge>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button size="sm">
              <Send className="h-4 w-4 mr-2" />
              Complete Signing
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Document Preview */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Document Preview
                </CardTitle>
                <CardDescription>Review the document before signing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-white border rounded-lg p-6 min-h-[600px]">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold">SERVICE AGREEMENT</h2>
                    <p className="text-gray-600 mt-2">Between Your Company and Acme Corp</p>
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Signer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="signerName">Full Name</Label>
                  <Input id="signerName" placeholder="Enter your full name" />
                </div>
                <div>
                  <Label htmlFor="signerEmail">Email Address</Label>
                  <Input id="signerEmail" type="email" placeholder="your@email.com" />
                </div>
                <div>
                  <Label htmlFor="signerTitle">Title/Position</Label>
                  <Input id="signerTitle" placeholder="e.g., CEO, Manager" />
                </div>
                <div>
                  <Label htmlFor="signerDate">Signing Date</Label>
                  <Input id="signerDate" type="date" defaultValue={new Date().toISOString().split("T")[0]} />
                </div>
              </CardContent>
            </Card>

            {/* Signature Creation */}
            <Card>
              <CardHeader>
                <CardTitle>Create Your Signature</CardTitle>
                <CardDescription>Choose how you'd like to sign</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Signature Type Selector */}
                <div className="flex space-x-2">
                  <Button
                    variant={signatureType === "draw" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSignatureType("draw")}
                  >
                    <PenTool className="h-4 w-4 mr-2" />
                    Draw
                  </Button>
                  <Button
                    variant={signatureType === "type" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSignatureType("type")}
                  >
                    <Type className="h-4 w-4 mr-2" />
                    Type
                  </Button>
                </div>

                {/* Draw Signature */}
                {signatureType === "draw" && (
                  <div className="space-y-3">
                    <Label>Draw your signature below</Label>
                    <div className="border rounded-lg p-2 bg-white">
                      <canvas
                        ref={canvasRef}
                        width={300}
                        height={150}
                        className="border-2 border-dashed border-gray-300 rounded cursor-crosshair w-full"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                      />
                    </div>
                    <Button variant="outline" size="sm" onClick={clearCanvas}>
                      Clear
                    </Button>
                  </div>
                )}

                {/* Type Signature */}
                {signatureType === "type" && (
                  <div className="space-y-3">
                    <Label htmlFor="typedSig">Type your signature</Label>
                    <Input
                      id="typedSig"
                      placeholder="Enter your name"
                      value={typedSignature}
                      onChange={(e) => setTypedSignature(e.target.value)}
                      className="font-serif text-2xl"
                    />
                    <div className="border rounded-lg p-4 bg-gray-50 min-h-[100px] flex items-center justify-center">
                      <span className="font-serif text-3xl text-gray-700">
                        {typedSignature || "Your signature will appear here"}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Agreement Confirmation */}
            <Card>
              <CardHeader>
                <CardTitle>Agreement Confirmation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <input type="checkbox" id="terms" className="mt-1" />
                    <label htmlFor="terms" className="text-sm">
                      I have read and agree to the terms and conditions outlined in this document.
                    </label>
                  </div>
                  <div className="flex items-start space-x-2">
                    <input type="checkbox" id="authority" className="mt-1" />
                    <label htmlFor="authority" className="text-sm">
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
