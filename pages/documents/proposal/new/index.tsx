"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Send, Eye, Plus, Trash2, FileSignature, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { useRouter } from "next/router"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import RoleBasedRoute from "@/components/auth/RoleBasedRoute"
import { useProposalCreation, useTemplates, useDocumentSigning } from "@/hooks/use-documents"

interface ProposalItem {
  id: string
  description: string
  quantity: number
  rate: number
  amount: number
}

function NewProposalContent() {
  const router = useRouter()
  const { createProposal, isCreating, error: createError, createdProposal } = useProposalCreation()
  const { templates, isLoading: templatesLoading } = useTemplates('proposal')
  const { sendForSignature, isSending, error: signError } = useDocumentSigning()

  const [proposalData, setProposalData] = useState({
    title: "",
    clientName: "",
    clientEmail: "",
    projectDescription: "",
    validUntil: "",
    notes: "",
    paymentTerms: "Net 30",
    deliveryTimeline: ""
  })

  const [items, setItems] = useState<ProposalItem[]>([
    { id: "1", description: "", quantity: 1, rate: 0, amount: 0 }
  ])

  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  const proposalTemplates = [
    { id: "creative", name: "Creative Services", description: "Design, video, and creative work proposals" },
    { id: "development", name: "Development Services", description: "Software and web development proposals" },
    { id: "consulting", name: "Consulting Services", description: "Professional consulting proposals" },
    { id: "marketing", name: "Marketing Services", description: "Marketing and advertising proposals" },
  ]

  const handleInputChange = (field: string, value: string) => {
    setProposalData(prev => ({ ...prev, [field]: value }))
  }

  const handleItemChange = (id: string, field: keyof ProposalItem, value: string | number) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value }
        if (field === 'quantity' || field === 'rate') {
          updatedItem.amount = updatedItem.quantity * updatedItem.rate
        }
        return updatedItem
      }
      return item
    }))
  }

  const addItem = () => {
    const newItem: ProposalItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0
    }
    setItems(prev => [...prev, newItem])
  }

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(prev => prev.filter(item => item.id !== id))
    }
  }

  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0)

  const handleSaveDraft = async () => {
    try {
      const proposalPayload = {
        ...proposalData,
        items: items.filter(item => item.description.trim() !== ""),
        total: totalAmount,
        status: 'draft' as const
      }
      const proposal = await createProposal(proposalPayload)
      if (proposal) {
        router.push('/documents')
      }
    } catch (error) {
      console.error('Failed to save proposal:', error)
    }
  }

  const handleSendForSignature = async () => {
    try {
      const proposalPayload = {
        ...proposalData,
        items: items.filter(item => item.description.trim() !== ""),
        total: totalAmount,
        status: 'sent' as const
      }
      
      if (!createdProposal) {
        const proposal = await createProposal(proposalPayload)
        if (proposal && proposalData.clientEmail) {
          await sendForSignature({
            documentId: proposal.id,
            signerEmail: proposalData.clientEmail,
            signerName: proposalData.clientName || 'Client',
            message: `Please review and approve the proposal: ${proposalData.title}`
          })
        }
      } else {
        await sendForSignature({
          documentId: createdProposal.id,
          signerEmail: proposalData.clientEmail,
          signerName: proposalData.clientName || 'Client',
          message: `Please review and approve the proposal: ${proposalData.title}`
        })
      }
    } catch (error) {
      console.error('Failed to send proposal for signature:', error)
    }
  }

  const loadTemplate = (templateId: string) => {
    const template = proposalTemplates.find(t => t.id === templateId)
    if (template) {
      setSelectedTemplate(templateId)
      
      // Load template-specific items and data
      const templateData = getTemplateData(templateId)
      setProposalData(prev => ({
        ...prev,
        ...templateData.proposal
      }))
      setItems(templateData.items)
    }
  }

  const getTemplateData = (templateId: string) => {
    const templates = {
      creative: {
        proposal: {
          paymentTerms: "50% upfront, 50% on completion",
          deliveryTimeline: "2-4 weeks",
        },
        items: [
          { id: "1", description: "Brand Identity Design", quantity: 1, rate: 2500, amount: 2500 },
          { id: "2", description: "Website Design & Development", quantity: 1, rate: 5000, amount: 5000 },
          { id: "3", description: "Marketing Materials", quantity: 1, rate: 1500, amount: 1500 }
        ]
      },
      development: {
        proposal: {
          paymentTerms: "30% upfront, 40% at milestone, 30% on completion",
          deliveryTimeline: "8-12 weeks",
        },
        items: [
          { id: "1", description: "Project Planning & Architecture", quantity: 40, rate: 150, amount: 6000 },
          { id: "2", description: "Frontend Development", quantity: 80, rate: 150, amount: 12000 },
          { id: "3", description: "Backend Development", quantity: 60, rate: 150, amount: 9000 },
          { id: "4", description: "Testing & Deployment", quantity: 20, rate: 150, amount: 3000 }
        ]
      },
      consulting: {
        proposal: {
          paymentTerms: "Net 15",
          deliveryTimeline: "4-6 weeks",
        },
        items: [
          { id: "1", description: "Business Analysis", quantity: 20, rate: 200, amount: 4000 },
          { id: "2", description: "Strategy Development", quantity: 15, rate: 200, amount: 3000 },
          { id: "3", description: "Implementation Support", quantity: 25, rate: 200, amount: 5000 }
        ]
      },
      marketing: {
        proposal: {
          paymentTerms: "Monthly retainer",
          deliveryTimeline: "Ongoing",
        },
        items: [
          { id: "1", description: "Social Media Management", quantity: 1, rate: 2000, amount: 2000 },
          { id: "2", description: "Content Creation", quantity: 1, rate: 1500, amount: 1500 },
          { id: "3", description: "Paid Advertising Management", quantity: 1, rate: 1000, amount: 1000 }
        ]
      }
    }
    return templates[templateId as keyof typeof templates] || { proposal: {}, items: [] }
  }

  const isFormValid = proposalData.title && proposalData.clientName && items.some(item => item.description.trim() !== "")

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/documents">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Documents
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Create New Proposal</h1>
          <p className="text-gray-600">Create professional proposals for your clients</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Proposal Details</CardTitle>
              <CardDescription>
                Enter the basic information for your proposal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
                <Label>Proposal Template (Optional)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {proposalTemplates.map((template) => (
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
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Proposal Title *</Label>
                  <Input
                    id="title"
                    placeholder="Website Development Proposal"
                    value={proposalData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientName">Client Name *</Label>
                  <Input
                    id="clientName"
                    placeholder="Client Company Name"
                    value={proposalData.clientName}
                    onChange={(e) => handleInputChange("clientName", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientEmail">Client Email</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    placeholder="client@company.com"
                    value={proposalData.clientEmail}
                    onChange={(e) => handleInputChange("clientEmail", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="validUntil">Valid Until</Label>
                  <Input
                    id="validUntil"
                    type="date"
                    value={proposalData.validUntil}
                    onChange={(e) => handleInputChange("validUntil", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectDescription">Project Description</Label>
                <Textarea
                  id="projectDescription"
                  placeholder="Describe the project scope and objectives..."
                  rows={4}
                  value={proposalData.projectDescription}
                  onChange={(e) => handleInputChange("projectDescription", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentTerms">Payment Terms</Label>
                  <Select 
                    value={proposalData.paymentTerms} 
                    onValueChange={(value) => handleInputChange("paymentTerms", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment terms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Net 15">Net 15</SelectItem>
                      <SelectItem value="Net 30">Net 30</SelectItem>
                      <SelectItem value="50% upfront, 50% on completion">50% upfront, 50% on completion</SelectItem>
                      <SelectItem value="30% upfront, 40% at milestone, 30% on completion">30% upfront, 40% at milestone, 30% on completion</SelectItem>
                      <SelectItem value="Monthly retainer">Monthly retainer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deliveryTimeline">Delivery Timeline</Label>
                  <Input
                    id="deliveryTimeline"
                    placeholder="2-4 weeks"
                    value={proposalData.deliveryTimeline}
                    onChange={(e) => handleInputChange("deliveryTimeline", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Line Items</CardTitle>
                  <CardDescription>
                    Add services and products to your proposal
                  </CardDescription>
                </div>
                <Button onClick={addItem} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-4 items-end p-4 border rounded-lg">
                  <div className="col-span-12 md:col-span-5">
                    <Label htmlFor={`description-${item.id}`}>Description</Label>
                    <Input
                      id={`description-${item.id}`}
                      placeholder="Service or product description"
                      value={item.description}
                      onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                    />
                  </div>
                  <div className="col-span-4 md:col-span-2">
                    <Label htmlFor={`quantity-${item.id}`}>Qty</Label>
                    <Input
                      id={`quantity-${item.id}`}
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(item.id, "quantity", parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div className="col-span-4 md:col-span-2">
                    <Label htmlFor={`rate-${item.id}`}>Rate</Label>
                    <Input
                      id={`rate-${item.id}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.rate}
                      onChange={(e) => handleItemChange(item.id, "rate", parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="col-span-3 md:col-span-2">
                    <Label>Amount</Label>
                    <div className="text-lg font-semibold py-2">
                      ${item.amount.toFixed(2)}
                    </div>
                  </div>
                  <div className="col-span-1">
                    {items.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              
              <div className="flex justify-end">
                <div className="text-right">
                  <div className="text-lg font-semibold">
                    Total: ${totalAmount.toFixed(2)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Notes</CardTitle>
              <CardDescription>
                Any additional information or terms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Additional terms, conditions, or notes..."
                rows={4}
                value={proposalData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
              />
            </CardContent>
          </Card>

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
              disabled={!proposalData.clientEmail || isCreating || isSending || !isFormValid}
              className="flex-1"
            >
              <FileSignature className="w-4 h-4 mr-2" />
              {isSending ? 'Sending...' : 'Save & Send for Approval'}
            </Button>
          </div>

          {!proposalData.clientEmail && (
            <p className="text-sm text-gray-600 mt-2">
              Add client email to enable approval workflow
            </p>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <div className="font-semibold">{proposalData.title || "Proposal Title"}</div>
                <div className="text-gray-600">{proposalData.clientName || "Client Name"}</div>
                <div className="mt-2">
                  <span className="font-medium">Total: ${totalAmount.toFixed(2)}</span>
                </div>
                <div className="text-gray-600">
                  {items.filter(item => item.description.trim() !== "").length} items
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Proposal Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Proposal Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <div className="flex justify-between items-center py-2">
                  <span>Require approval</span>
                  <Badge variant="outline">Yes</Badge>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span>Auto-expire</span>
                  <Badge variant="outline">30 days</Badge>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span>Allow comments</span>
                  <Badge variant="outline">Yes</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Eye className="w-4 h-4 mr-2" />
                Preview PDF
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Save className="w-4 h-4 mr-2" />
                Save as Template
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function NewProposal() {
  return (
    <RoleBasedRoute allowedRoles={['admin', 'client', 'videographer', 'designer']}>
      <DashboardLayout
        meta={{
          title: "New Proposal",
          description: "Create and manage proposals for your clients"
        }}
        allowedRoles={['admin', 'client', 'videographer', 'designer']}
      >
        <NewProposalContent />
      </DashboardLayout>
    </RoleBasedRoute>
  )
}
    setItems(items.filter((item) => item.id !== id))
  }

  const updateItem = (id: string, field: keyof ProposalItem, value: string | number) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value }
          if (field === "quantity" || field === "rate") {
            updated.amount = updated.quantity * updated.rate
          }
          return updated
        }
        return item
      }),
    )
  }

  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0)

  return (
    <div className="flex flex-col min-h-0 flex-1">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Drive
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">New Proposal</h1>
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
              Send Proposal
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Proposal Information</CardTitle>
              <CardDescription>Basic details about your proposal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Proposal Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Website Redesign Project - Acme Corp"
                  value={proposalData.title}
                  onChange={(e) => setProposalData({ ...proposalData, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input
                    id="clientName"
                    placeholder="Client or company name"
                    value={proposalData.clientName}
                    onChange={(e) => setProposalData({ ...proposalData, clientName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="clientEmail">Client Email</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    placeholder="client@example.com"
                    value={proposalData.clientEmail}
                    onChange={(e) => setProposalData({ ...proposalData, clientEmail: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="projectType">Project Type</Label>
                  <Select
                    value={proposalData.projectType}
                    onValueChange={(value) => setProposalData({ ...proposalData, projectType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="web-development">Web Development</SelectItem>
                      <SelectItem value="mobile-app">Mobile App</SelectItem>
                      <SelectItem value="design">Design Services</SelectItem>
                      <SelectItem value="consulting">Consulting</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="timeline">Timeline</Label>
                  <Input
                    id="timeline"
                    placeholder="e.g., 6-8 weeks"
                    value={proposalData.timeline}
                    onChange={(e) => setProposalData({ ...proposalData, timeline: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="budget">Budget Range</Label>
                  <Input
                    id="budget"
                    placeholder="e.g., $10,000 - $15,000"
                    value={proposalData.budget}
                    onChange={(e) => setProposalData({ ...proposalData, budget: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Details */}
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="overview">Project Overview</Label>
                <Textarea
                  id="overview"
                  placeholder="Provide a high-level overview of the project..."
                  rows={4}
                  value={proposalData.overview}
                  onChange={(e) => setProposalData({ ...proposalData, overview: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="objectives">Objectives & Goals</Label>
                <Textarea
                  id="objectives"
                  placeholder="List the main objectives and goals of this project..."
                  rows={4}
                  value={proposalData.objectives}
                  onChange={(e) => setProposalData({ ...proposalData, objectives: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="methodology">Methodology & Approach</Label>
                <Textarea
                  id="methodology"
                  placeholder="Describe your approach and methodology..."
                  rows={4}
                  value={proposalData.methodology}
                  onChange={(e) => setProposalData({ ...proposalData, methodology: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing Breakdown</CardTitle>
              <CardDescription>Add line items for your proposal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-12 gap-4 items-end">
                    <div className="col-span-5">
                      <Label htmlFor={`desc-${item.id}`}>Description</Label>
                      <Input
                        id={`desc-${item.id}`}
                        placeholder="Service or deliverable description"
                        value={item.description}
                        onChange={(e) => updateItem(item.id, "description", e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor={`qty-${item.id}`}>Quantity</Label>
                      <Input
                        id={`qty-${item.id}`}
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, "quantity", Number.parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor={`rate-${item.id}`}>Rate</Label>
                      <Input
                        id={`rate-${item.id}`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.rate}
                        onChange={(e) => updateItem(item.id, "rate", Number.parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Amount</Label>
                      <div className="h-10 px-3 py-2 border rounded-md bg-gray-50 flex items-center">
                        ${item.amount.toFixed(2)}
                      </div>
                    </div>
                    <div className="col-span-1">
                      {items.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="h-10 w-10 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                <Button variant="outline" onClick={addItem} className="w-full bg-transparent">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Line Item
                </Button>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total Amount:</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea placeholder="Outline the next steps if the proposal is accepted..." rows={4} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function NewProposal() {
  return (
    <RoleBasedRoute allowedRoles={['admin', 'manager']}>
      <DashboardLayout meta={{ title: 'Create New Proposal', description: 'Create a new business proposal' }}>
        <NewProposalContent />
      </DashboardLayout>
    </RoleBasedRoute>
  )
}
