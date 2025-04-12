import { useState } from "react";
import { BotIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ContentCreateFormProps {
  channelId: string;
  channelName: string;
  onComplete: () => void;
}

const ContentCreateForm = ({
  channelId,
  channelName,
  onComplete,
}: ContentCreateFormProps) => {
  const [step, setStep] = useState<"input" | "preview" | "generating">("input");
  const [formData, setFormData] = useState({
    title: "",
    topic: "",
    contentType: "",
    keywords: "",
    agent: "Content Creator Agent",
  });
  const [generatedContent, setGeneratedContent] = useState("");

  // Get content types based on channel
  const getContentTypes = () => {
    switch (channelId) {
      case "website":
        return ["Blog Post", "Case Study", "Tutorial", "Guide"];
      case "twitter":
        return ["Tweet", "Thread", "Poll", "Image"];
      case "instagram":
        return ["Post", "Reel", "Story", "Carousel"];
      case "linkedin":
        return ["Article", "Post", "Poll", "Document"];
      case "youtube":
        return ["Video", "Short", "Live Stream", "Playlist"];
      case "newsletter":
        return [
          "Newsletter",
          "Announcement",
          "Product Update",
          "Feature Spotlight",
        ];
      default:
        return ["Post", "Article", "Update"];
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerate = () => {
    setStep("generating");

    // Simulate API call to generate content
    setTimeout(() => {
      const dummyContent = `# ${formData.title}

## Introduction
This is a ${formData.contentType} about ${formData.topic}. It was created using the ${formData.agent} for the ${channelName} channel.

## Main Points
- Key insight about ${formData.topic}
- How this relates to your audience
- Actionable steps your readers can take

## Why This Matters
Understanding ${formData.topic} is crucial because it helps businesses improve their performance, reach more customers, and stay ahead of the competition.

## Conclusion
Implementing the strategies outlined in this ${formData.contentType} will help you achieve better results and grow your business.

*Keywords: ${formData.keywords}*`;

      setGeneratedContent(dummyContent);
      setStep("preview");
    }, 2000);
  };

  const handleSave = () => {
    // In a real implementation, this would save the content to your database
    // For now, we'll just simulate success
    setTimeout(() => {
      onComplete();
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {step === "input" && (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter content title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              placeholder="What is this content about?"
              value={formData.topic}
              onChange={(e) => handleChange("topic", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content-type">Content Type</Label>
            <Select
              value={formData.contentType}
              onValueChange={(value) => handleChange("contentType", value)}
            >
              <SelectTrigger id="content-type">
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent>
                {getContentTypes().map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords">Keywords (comma separated)</Label>
            <Input
              id="keywords"
              placeholder="Enter relevant keywords"
              value={formData.keywords}
              onChange={(e) => handleChange("keywords", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="agent">AI Agent</Label>
            <Select
              value={formData.agent}
              onValueChange={(value) => handleChange("agent", value)}
            >
              <SelectTrigger id="agent">
                <SelectValue placeholder="Select AI agent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Content Creator Agent">
                  Content Creator Agent
                </SelectItem>
                <SelectItem value="Content Optimizer Agent">
                  Content Optimizer Agent
                </SelectItem>
                <SelectItem value="Topic Selector Agent">
                  Topic Selector Agent
                </SelectItem>
                <SelectItem value="Trend Selector Agent">
                  Trend Selector Agent
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onComplete}>
              Cancel
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={
                !formData.title || !formData.topic || !formData.contentType
              }
            >
              Generate Content
            </Button>
          </div>
        </div>
      )}

      {step === "generating" && (
        <div className="flex flex-col items-center justify-center py-10 space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-medium">Generating content...</p>
          <p className="text-sm text-muted-foreground">
            Using {formData.agent} to create your {formData.contentType}
          </p>
        </div>
      )}

      {step === "preview" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BotIcon className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">
                Generated by {formData.agent}
              </h3>
            </div>
            <Badge variant="outline">{formData.contentType}</Badge>
          </div>

          <Card className="border bg-muted/20">
            <CardContent className="p-6">
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm">
                  {generatedContent}
                </pre>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Label htmlFor="edit-content">Edit Content (if needed)</Label>
            <Textarea
              id="edit-content"
              value={generatedContent}
              className="min-h-[300px] font-mono text-sm"
              onChange={(e) => setGeneratedContent(e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setStep("input")}>
              Back
            </Button>
            <Button onClick={handleSave}>Save & Publish</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentCreateForm;
