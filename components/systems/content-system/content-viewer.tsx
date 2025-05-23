import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, MousePointer, ThumbsUp, DollarSign, Clock } from "lucide-react";

// Define the content type structure
interface ContentStats {
  impressions?: number;
  ctr?: string;
  conversions?: number;
}

interface Content {
  title: string;
  agent?: string;
  type: string;
  headline?: string;
  copy?: string;
  callToAction?: string;
  targetAudience?: string;
  stats?: ContentStats;
}

interface ContentViewerProps {
  content: Content;
  platformId: string;
}

const ContentViewer = ({ content, platformId }: ContentViewerProps) => {
  const [activeTab, setActiveTab] = useState("preview");

  // Different preview components based on platform
  const renderPlatformPreview = () => {
    switch (platformId) {
      case "facebook":
        return <FacebookPreview content={content} />;
      case "instagram":
        return <InstagramPreview content={content} />;
      case "twitter":
        return <TwitterPreview content={content} />;
      case "linkedin":
        return <LinkedInPreview content={content} />;
      case "youtube":
        return <YouTubePreview content={content} />;
      case "tiktok":
        return <TikTokPreview content={content} />;
      default:
        return <GenericPreview content={content} />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold">{content.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Generated by {content.agent || "Ad Intelligence Agent"}
          </p>
        </div>
        <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
          {content.type}
        </Badge>
      </div>

      <Tabs
        value={activeTab}
        defaultValue="preview"
        className="space-y-4"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full max-w-md grid-cols-3 bg-slate-800/30">
          <TabsTrigger value="preview">Content Preview</TabsTrigger>
          <TabsTrigger value="details">Content Details</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="space-y-4">
          {renderPlatformPreview()}
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <Card className="border-none bg-transparent">
            <CardContent className="space-y-4 pt-4">
              <div>
                <h4 className="text-sm font-semibold mb-1">Content Headline</h4>
                <p>{content.headline || content.title}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-1">Content Copy</h4>
                <p>
                  {content.copy ||
                    "This ad copy showcases the value proposition of our product, highlighting the key benefits and encouraging users to take action."}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-1">Call To Action</h4>
                <p>{content.callToAction || "Get Started Today"}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-1">Target Audience</h4>
                <p>
                  {content.targetAudience ||
                    "Business Professionals, 25-54 years old"}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-1">Content Format</h4>
                <p>{content.type}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-1">Platform</h4>
                <p>
                  {platformId.charAt(0).toUpperCase() + platformId.slice(1)} Ads
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-none bg-transparent">
              <CardContent className="pt-6">
                <div className="flex flex-col">
                  <div className="flex items-center text-muted-foreground mb-1">
                    <Eye className="mr-2 h-4 w-4" />
                    <span className="text-sm">Impressions</span>
                  </div>
                  <span className="text-2xl font-bold">
                    {content.stats?.impressions?.toLocaleString() || "0"}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none bg-transparent">
              <CardContent className="pt-6">
                <div className="flex flex-col">
                  <div className="flex items-center text-muted-foreground mb-1">
                    <MousePointer className="mr-2 h-4 w-4" />
                    <span className="text-sm">Click-Through Rate</span>
                  </div>
                  <span className="text-2xl font-bold">
                    {content.stats?.ctr || "0%"}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none bg-transparent">
              <CardContent className="pt-6">
                <div className="flex flex-col">
                  <div className="flex items-center text-muted-foreground mb-1">
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    <span className="text-sm">Conversions</span>
                  </div>
                  <span className="text-2xl font-bold">
                    {content.stats?.conversions?.toLocaleString() || "0"}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none bg-transparent">
              <CardContent className="pt-6">
                <div className="flex flex-col">
                  <div className="flex items-center text-muted-foreground mb-1">
                    <DollarSign className="mr-2 h-4 w-4" />
                    <span className="text-sm">Cost per Click</span>
                  </div>
                  <span className="text-2xl font-bold">$0.42</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-none bg-transparent">
            <CardHeader>
              <CardTitle className="text-lg">Performance Summary</CardTitle>
              <CardDescription>
                AI-generated analysis of content performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                This post is performing <strong>18% better</strong> than average
                for this audience and platform. The click-through rate is
                particularly strong, suggesting the creative resonates well with
                viewers. Based on current performance, we recommend continuing
                to run this ad and potentially increasing budget allocation.
              </p>
              <div className="flex items-center mt-4 text-muted-foreground">
                <Clock className="mr-2 h-4 w-4" />
                <span className="text-sm">Last updated 3 hours ago</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Platform-specific preview components
interface PlatformPreviewProps {
  content: Content;
}

const FacebookPreview = ({ content }: PlatformPreviewProps) => (
  <div className="border rounded-md overflow-hidden">
    <div className="bg-blue-500 text-white text-sm font-semibold px-4 py-2">
      Facebook Post Preview
    </div>
    <div className="p-4 bg-white text-black">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
          <span className="text-blue-600 font-bold">C</span>
        </div>
        <div>
          <p className="font-semibold text-sm">Company Name</p>
          <p className="text-xs text-gray-500">Sponsored</p>
        </div>
      </div>
      <p className="text-sm mb-3">{content.copy}</p>
      <div className="bg-gray-100 rounded-md overflow-hidden mb-3">
        <div className="h-48 bg-gray-300 flex items-center justify-center">
          <span className="text-gray-600">Creative Image</span>
        </div>
        <div className="p-3 border-t">
          <p className="font-bold text-sm">{content.headline}</p>
          <p className="text-xs text-gray-500 mt-1">company-website.com</p>
        </div>
      </div>
      <button className="w-full rounded-md bg-blue-500 text-white py-1.5 text-sm font-semibold">
        {content.callToAction}
      </button>
    </div>
  </div>
);

const InstagramPreview = ({ content }: PlatformPreviewProps) => (
  <div className="border rounded-md overflow-hidden">
    <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-semibold px-4 py-2">
      Instagram Post Preview
    </div>
    <div className="p-4 bg-white text-black">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-pink-100 flex items-center justify-center">
            <span className="text-pink-600 font-bold">C</span>
          </div>
          <p className="font-semibold text-sm">company_name</p>
        </div>
        <span className="text-xs text-gray-500">Sponsored</span>
      </div>
      <div className="h-64 bg-gray-200 rounded mb-3 flex items-center justify-center">
        <span className="text-gray-600">Creative Image</span>
      </div>
      <div className="flex text-lg mb-2 gap-4">
        <span>❤️</span>
        <span>💬</span>
        <span>📤</span>
      </div>
      <p className="text-sm mb-2">
        <span className="font-semibold">company_name</span> {content.copy}
      </p>
      <button className="w-full rounded-md bg-blue-500 text-white py-1.5 text-sm font-semibold mt-2">
        {content.callToAction}
      </button>
    </div>
  </div>
);

const TwitterPreview = ({ content }: PlatformPreviewProps) => (
  <div className="border rounded-md overflow-hidden">
    <div className="bg-blue-400 text-white text-sm font-semibold px-4 py-2">
      Twitter / X Ad Preview
    </div>
    <div className="p-4 bg-white text-black">
      <div className="flex items-start gap-3 mb-3">
        <div className="h-10 w-10 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center">
          <span className="text-blue-500 font-bold">C</span>
        </div>
        <div>
          <div className="flex items-center gap-1">
            <p className="font-semibold text-sm">Company Name</p>
            <p className="text-xs text-gray-500">@company_name</p>
            <span className="text-xs text-gray-500">·</span>
            <span className="text-xs text-gray-500">Promoted</span>
          </div>
          <p className="text-sm mt-1">{content.copy}</p>
          <div className="mt-3 rounded-md overflow-hidden border">
            <div className="h-40 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-600">Creative Image</span>
            </div>
            <div className="p-3">
              <p className="font-semibold text-sm">{content.headline}</p>
              <p className="text-xs text-gray-500 mt-1">company-website.com</p>
            </div>
          </div>
          <div className="flex justify-between mt-3 text-gray-500 text-sm">
            <span>💬 12</span>
            <span>🔄 24</span>
            <span>❤️ 36</span>
            <span>📤</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const LinkedInPreview = ({ content }: PlatformPreviewProps) => (
  <div className="border rounded-md overflow-hidden">
    <div className="bg-blue-700 text-white text-sm font-semibold px-4 py-2">
      LinkedIn Ad Preview
    </div>
    <div className="p-4 bg-white text-black">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-12 w-12 rounded bg-blue-100 flex items-center justify-center">
          <span className="text-blue-700 font-bold">C</span>
        </div>
        <div>
          <p className="font-semibold text-sm">Company Name</p>
          <p className="text-xs text-gray-500">Sponsored · 1,234 followers</p>
        </div>
      </div>
      <p className="text-sm mb-3">{content.copy}</p>
      <div className="rounded-md overflow-hidden border mb-3">
        <div className="h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-600">Creative Image</span>
        </div>
        <div className="p-3 bg-gray-50">
          <p className="font-bold text-sm">{content.headline}</p>
          <p className="text-xs text-gray-500 mt-1">company-website.com</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="flex-1 rounded-md bg-blue-700 text-white py-1.5 text-sm font-semibold">
          {content.callToAction}
        </button>
        <button className="px-3 rounded-md border border-gray-300 text-gray-700 py-1.5 text-sm font-semibold">
          Save
        </button>
      </div>
    </div>
  </div>
);

const YouTubePreview = ({ content }: PlatformPreviewProps) => (
  <div className="border rounded-md overflow-hidden">
    <div className="bg-red-600 text-white text-sm font-semibold px-4 py-2">
      YouTube Ad Preview
    </div>
    <div className="p-4 bg-white text-black">
      <div className="bg-black h-56 rounded-md flex items-center justify-center mb-4">
        <div className="text-white text-center">
          <p className="font-semibold mb-2">Video Preview</p>
          <p className="text-sm text-gray-400">5 seconds until skip</p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-full bg-red-100 flex-shrink-0 flex items-center justify-center">
          <span className="text-red-600 font-bold">C</span>
        </div>
        <div className="flex-1">
          <p className="font-bold text-base">{content.headline}</p>
          <p className="text-sm text-gray-700 mt-1 line-clamp-2">
            {content.copy}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Company Name · Post · company-website.com
          </p>
          <button className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-sm text-sm">
            {content.callToAction}
          </button>
        </div>
      </div>
    </div>
  </div>
);

const TikTokPreview = ({ content }: PlatformPreviewProps) => (
  <div className="border rounded-md overflow-hidden">
    <div className="bg-black text-white text-sm font-semibold px-4 py-2">
      TikTok Ad Preview
    </div>
    <div className="p-0 bg-black text-white">
      <div className="h-96 relative">
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <p className="text-white">Video Content Preview</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="font-semibold">@company_name</p>
          <p className="text-sm mt-1">{content.copy}</p>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex flex-col items-center">
              <span className="text-xl">❤️</span>
              <span className="text-xs">123K</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xl">💬</span>
              <span className="text-xs">4.5K</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xl">🔄</span>
              <span className="text-xs">28.2K</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xl">📤</span>
              <span className="text-xs">Share</span>
            </div>
            <button className="bg-pink-500 text-white px-4 py-1 rounded-full text-sm">
              {content.callToAction}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const GenericPreview = ({ content }: PlatformPreviewProps) => (
  <Card className="border-none">
    <CardHeader>
      <CardTitle>{content.title}</CardTitle>
      <CardDescription>Ad Preview</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="h-48 bg-muted rounded-md flex items-center justify-center">
          <span className="text-muted-foreground">Post Creative Preview</span>
        </div>
        <div>
          <h4 className="font-semibold">{content.headline}</h4>
          <p className="mt-2 text-sm">{content.copy}</p>
          <button className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm">
            {content.callToAction}
          </button>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default ContentViewer;
