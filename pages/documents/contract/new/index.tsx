"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Send, Eye, FileSignature, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { useRouter } from "next/router"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import RoleBasedRoute from "@/components/auth/RoleBasedRoute"
import { useContractCreation, useTemplates, useDocumentSigning } from "@/hooks/use-documents"

function NewContractContent() {
  const router = useRouter()
  const { createContract, isCreating, error: createError, createdContract } = useContractCreation()
  const { templates, isLoading: templatesLoading } = useTemplates('contract')
  const { sendForSignature, isSending, error: signError } = useDocumentSigning()

  const [contractData, setContractData] = useState({
    title: "",
    clientName: "",
    clientEmail: "",
    contractType: "",
    startDate: "",
    endDate: "",
    value: "",
    description: "",
    terms: "",
  })

  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  const contractTemplates = [
    { id: "service", name: "Service Agreement", description: "Standard service contract template" },
    { id: "nda", name: "Non-Disclosure Agreement", description: "Confidentiality agreement template" },
    { id: "employment", name: "Employment Contract", description: "Employee agreement template" },
    { id: "freelance", name: "Freelance Agreement", description: "Independent contractor template" },
  ]

  

  const isFormValid = contractData.title && contractData.clientName && contractData.terms

  return (
    <div className="flex flex-col min-h-0 flex-1">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/documents">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Drive
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">New Contract</h1>
            <Badge variant="secondary">Draft</Badge>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button variant="outline" size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button size="sm">
              <Send className="h-4 w-4 mr-2" />
              Send for Signature
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
              {/* Error Alerts */}
              {(createError || signError) && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {createError || signError}
                  </AlertDescription>
                </Alert>
              )}

              {/* Template Selection */}
              <div className="space-y-4">
                <Label>Contract Template (Optional)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {contractTemplates.map((template) => (
                    <Card 
                      key={template.id} 
                      className={`cursor-pointer transition-colors ${
                        selectedTemplate === template.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => loadTemplate(template.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{template.name}</h4>
                            <p className="text-sm text-gray-600">{template.description}</p>
                          </div>
                          {selectedTemplate === template.id && (
                            <Badge variant="secondary">Selected</Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Contract Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Service Agreement - Acme Corp"
                    value={contractData.title}
                    onChange={(e) => setContractData({ ...contractData, title: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="clientName">Client Name</Label>
                    <Input
                      id="clientName"
                      placeholder="Client or company name"
                      value={contractData.clientName}
                      onChange={(e) => setContractData({ ...contractData, clientName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="clientEmail">Client Email</Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      placeholder="client@example.com"
                      value={contractData.clientEmail}
                      onChange={(e) => setContractData({ ...contractData, clientEmail: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="contractType">Contract Type</Label>
                  <Select
                    value={contractData.contractType}
                    onValueChange={(value) => setContractData({ ...contractData, contractType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select contract type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="service">Service Agreement</SelectItem>
                      <SelectItem value="nda">Non-Disclosure Agreement</SelectItem>
                      <SelectItem value="employment">Employment Contract</SelectItem>
                      <SelectItem value="freelance">Freelance Agreement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={contractData.startDate}
                      onChange={(e) => setContractData({ ...contractData, startDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={contractData.endDate}
                      onChange={(e) => setContractData({ ...contractData, endDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="value">Contract Value</Label>
                    <Input
                      id="value"
                      placeholder="$0.00"
                      value={contractData.value}
                      onChange={(e) => setContractData({ ...contractData, value: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contract Details */}
            <Card>
              <CardHeader>
                <CardTitle>Contract Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="description">Description of Work</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the work or services to be provided..."
                    rows={4}
                    value={contractData.description}
                    onChange={(e) => setContractData({ ...contractData, description: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="terms">Terms and Conditions</Label>
                  <Textarea
                    id="terms"
                    placeholder="Enter specific terms, conditions, and clauses..."
                    rows={6}
                    value={contractData.terms}
                    onChange={(e) => setContractData({ ...contractData, terms: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" size="sm">
                  <FileSignature className="h-4 w-4 mr-2" />
                  Send for Signature
                </Button>
                <Button variant="outline" className="w-full bg-transparent" size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Save as Template
                </Button>
                <Button variant="outline" className="w-full bg-transparent" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Document
                </Button>
              </CardContent>
            </Card>

            {/* Signature Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Signature Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <div className="flex justify-between items-center py-2">
                    <span>Require all signatures</span>
                    <Badge variant="outline">Yes</Badge>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span>Signing order</span>
                    <Badge variant="outline">Sequential</Badge>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span>Expiration</span>
                    <Badge variant="outline">30 days</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Templates */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm p-2 hover:bg-gray-50 rounded cursor-pointer">Service Agreement Template</div>
                  <div className="text-sm p-2 hover:bg-gray-50 rounded cursor-pointer">NDA Template v2</div>
                  <div className="text-sm p-2 hover:bg-gray-50 rounded cursor-pointer">Freelance Contract</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              disabled={isCreating || !isFormValid}
              className="flex-1"
            >
              <Save className="w-4 h-4 mr-2" />
              {isCreating ? 'Saving...' : 'Save as Draft'}
            </Button>
            <Button
              onClick={handleSendForSignature}
              disabled={!contractData.clientEmail || isCreating || isSending || !isFormValid}
              className="flex-1"
            >
              <FileSignature className="w-4 h-4 mr-2" />
              {isSending ? 'Sending...' : 'Save & Send for Signature'}
            </Button>
          </div>

          {!contractData.clientEmail && (
            <p className="text-sm text-gray-600 mt-2">
              Add client email to enable signature workflow
            </p>
          )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function NewContract() {
  return (
    <RoleBasedRoute allowedRoles={['admin', 'client', 'videographer', 'designer']}>
      <DashboardLayout
        meta={{
          title: "New Contract",
          description: "Create and manage contracts for your clients"
        }}
        allowedRoles={['admin', 'client', 'videographer', 'designer']}
      >
        <NewContractContent />
      </DashboardLayout>
    </RoleBasedRoute>
  )
}
