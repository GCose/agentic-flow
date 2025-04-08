import { useState } from "react";
import { Lightbulb, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ContentGenerationForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [enableRecipients, setEnableRecipients] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [recipients, setRecipients] = useState("");
  const [platform, setPlatform] = useState("");
  const [contentType, setContentType] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Input validation
    if (!prompt.trim()) {
      setError("Please provide a prompt for content generation");
      return;
    }

    if (enableRecipients && !recipients.trim()) {
      setError("Please provide recipient email addresses");
      return;
    }

    // Clear any previous errors
    setError(null);
    setSuccess(false);
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setSuccess(true);
    } catch {
      setError("Failed to generate content. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-gradient-to-br from-green-500/40 to-blue-500/5">
          <Lightbulb className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>
            Content has been successfully generated!
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="prompt">Content Prompt</Label>
        <Textarea
          required
          id="prompt"
          value={prompt}
          className="min-h-[120px]"
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the content you want to generate..."
        />
        <p className="text-sm text-muted-foreground">
          Be specific about the content you need. Include details about tone,
          style, and purpose.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="content-type">Content Type</Label>
          <Select value={contentType} onValueChange={setContentType}>
            <SelectTrigger id="content-type">
              <SelectValue placeholder="Select content type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="blog-post">Blog Post</SelectItem>
              <SelectItem value="social-post">Social Media Post</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="ad-copy">Ad Copy</SelectItem>
              <SelectItem value="newsletter">Newsletter</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="platform">Platform</Label>
          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger id="platform">
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="twitter">Twitter</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
              <SelectItem value="tiktok">TikTok</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            Optional: Select the platform where this content will be used
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="recipient-toggle">Recipient Targeting</Label>
            <p className="text-sm text-muted-foreground">
              Enable to specify recipient email addresses
            </p>
          </div>
          <Switch
            id="recipient-toggle"
            checked={enableRecipients}
            onCheckedChange={setEnableRecipients}
          />
        </div>

        {enableRecipients && (
          <div className="space-y-2">
            <Label htmlFor="recipients">Recipient Emails</Label>
            <Textarea
              id="recipients"
              placeholder="Enter email addresses (one per line or comma-separated)"
              className="min-h-[80px]"
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              These recipients will receive the generated content
            </p>
          </div>
        )}
      </div>

      <div className="flex pt-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>Generate Content</>
          )}
        </Button>
      </div>
    </form>
  );
};

export default ContentGenerationForm;
