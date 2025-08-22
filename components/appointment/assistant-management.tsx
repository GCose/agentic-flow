"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Bot, Save, RotateCcw, Eye, MessageSquare, Settings, Zap } from "lucide-react"
import { promptTemplates, type AssistantSettings } from "@/lib/appointments"

export function AssistantManagement() {
  const [settings, setSettings] = useState<AssistantSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const response = await fetch("/api/assistant-settings")
      const data = await response.json()
      setSettings(data)
    } catch (error) {
      console.error("Failed to load assistant settings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveSettings = async () => {
    if (!settings) return

    setIsSaving(true)
    try {
      const response = await fetch("/api/assistant-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })
      const updatedSettings = await response.json()
      setSettings(updatedSettings)
      alert("Assistant settings saved successfully!")
    } catch (error) {
      console.error("Failed to save settings:", error)
      alert("Failed to save settings. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const resetSettings = async () => {
    if (!confirm("Are you sure you want to reset to default settings? This will overwrite all customizations.")) {
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch("/api/assistant-settings", { method: "DELETE" })
      const resetSettings = await response.json()
      setSettings(resetSettings)
      alert("Settings reset to default successfully!")
    } catch (error) {
      console.error("Failed to reset settings:", error)
      alert("Failed to reset settings. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const applyTemplate = (template: (typeof promptTemplates)[0]) => {
    if (!settings) return
    setSettings({
      ...settings,
      systemPrompt: template.prompt,
    })
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-48">
          <div className="text-center">
            <Bot className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p>Loading assistant settings...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!settings) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-48">
          <p className="text-red-500">Failed to load assistant settings</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Assistant Management
        </CardTitle>
        <div className="flex gap-2">
          <Button onClick={saveSettings} disabled={isSaving} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            onClick={resetSettings}
            variant="outline"
            disabled={isSaving}
            className="flex items-center gap-2 bg-transparent"
          >
            <RotateCcw className="h-4 w-4" />
            Reset to Default
          </Button>
          <Button onClick={() => setPreviewMode(!previewMode)} variant="outline" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            {previewMode ? "Edit Mode" : "Preview Mode"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Basic
            </TabsTrigger>
            <TabsTrigger value="prompt" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Prompt
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Advanced
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              Templates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Assistant Name</Label>
                <Input
                  id="name"
                  value={settings.name}
                  onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                  placeholder="Assistant Name"
                />
              </div>
              <div>
                <Label htmlFor="model">AI Model</Label>
                <Select value={settings.model} onValueChange={(value) => setSettings({ ...settings, model: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4o">GPT-4o (Recommended)</SelectItem>
                    <SelectItem value="gpt-4o-mini">GPT-4o Mini (Faster)</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (Budget)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="greeting">Welcome Greeting</Label>
              <Textarea
                id="greeting"
                value={settings.greeting}
                onChange={(e) => setSettings({ ...settings, greeting: e.target.value })}
                placeholder="The first message users see when they start chatting"
                rows={3}
              />
            </div>

            {previewMode && (
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-sm">Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3 flex-1">
                      <p className="text-sm">{settings.greeting}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="prompt" className="space-y-4">
            <div>
              <Label htmlFor="systemPrompt">System Prompt</Label>
              <Textarea
                id="systemPrompt"
                value={settings.systemPrompt}
                onChange={(e) => setSettings({ ...settings, systemPrompt: e.target.value })}
                placeholder="Define how the assistant should behave and respond"
                rows={15}
                className="font-mono text-sm"
              />
              <p className="text-sm text-gray-500 mt-2">
                This prompt defines the assistant's personality, capabilities, and behavior. Be specific about what the
                assistant should and shouldn't do.
              </p>
            </div>

            {previewMode && (
              <Card className="bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-sm">Prompt Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs whitespace-pre-wrap bg-white p-3 rounded border max-h-40 overflow-y-auto">
                    {settings.systemPrompt}
                  </pre>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="temperature">Temperature: {settings.temperature}</Label>
                <input
                  type="range"
                  id="temperature"
                  min="0"
                  max="2"
                  step="0.1"
                  value={settings.temperature}
                  onChange={(e) => setSettings({ ...settings, temperature: Number.parseFloat(e.target.value) })}
                  className="w-full"
                />
                <p className="text-xs text-gray-500">Lower = more focused, Higher = more creative (0.0 - 2.0)</p>
              </div>
              <div>
                <Label htmlFor="maxTokens">Max Tokens</Label>
                <Input
                  id="maxTokens"
                  type="number"
                  min="100"
                  max="4000"
                  value={settings.maxTokens}
                  onChange={(e) => setSettings({ ...settings, maxTokens: Number.parseInt(e.target.value) })}
                />
                <p className="text-xs text-gray-500">Maximum response length (100-4000)</p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2">Advanced Settings Info</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>
                  • <strong>Temperature:</strong> Controls randomness in responses
                </li>
                <li>
                  • <strong>Max Tokens:</strong> Limits response length (affects cost)
                </li>
                <li>• Changes take effect immediately for new conversations</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <div>
              <h4 className="font-medium mb-3">Prompt Templates</h4>
              <p className="text-sm text-gray-600 mb-4">
                Choose from pre-built templates to quickly configure your assistant for different use cases.
              </p>
            </div>

            <div className="grid gap-4">
              {promptTemplates.map((template, index) => (
                <Card key={index} className="border-2 hover:border-blue-200 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base">{template.name}</CardTitle>
                        <Badge variant="outline" className="mt-1">
                          Template
                        </Badge>
                      </div>
                      <Button size="sm" onClick={() => applyTemplate(template)} variant="outline">
                        Apply Template
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-600 mb-3">{template.prompt.split("\n")[0]}...</p>
                    <details className="text-xs">
                      <summary className="cursor-pointer text-blue-600 hover:text-blue-800">View full prompt</summary>
                      <pre className="mt-2 bg-gray-50 p-2 rounded whitespace-pre-wrap">{template.prompt}</pre>
                    </details>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Last updated: {new Date(settings.updatedAt).toLocaleString()}</span>
            <Badge variant="outline">Version 1.0</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
