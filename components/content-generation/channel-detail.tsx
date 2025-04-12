import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  ArrowLeft,
  FileText,
  TrendingUp,
  Eye,
  MousePointer,
  Clock,
  Filter,
  Download,
  Share2,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  Music2Icon,
} from "lucide-react";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import AgentPerformanceForChannel from "./agent-performance-for-channel";
import ChannelAnalytics from "./channel-analytics";
import ChannelContentList from "./channel-content-list";
import ContentViewer from "./content-viewer";

// Mock data for social media ad platforms
const platformData = {
  facebook: { name: "Facebook Ads", icon: Facebook, color: "blue" },
  instagram: { name: "Instagram Ads", icon: Instagram, color: "pink" },
  twitter: { name: "Twitter / X Ads", icon: Twitter, color: "cyan" },
  linkedin: { name: "LinkedIn Ads", icon: Linkedin, color: "indigo" },
  youtube: { name: "YouTube Ads", icon: Youtube, color: "red" },
  tiktok: { name: "TikTok Ads", icon: Music2Icon, color: "purple" },
};

const ChannelDetailPage = () => {
  const router = useRouter();
  const { channelId } = router.query;
  const [activeTab, setActiveTab] = useState("analytics");
  const [selectedContent, setSelectedContent] = useState(null);
  const [isApproving, setIsApproving] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  // Simulate loading content when component mounts
  useEffect(() => {
    // In a real implementation, this would fetch content from an API
    console.log("Fetching content for channel:", channelId);

    // Simulate filter functionality
    if (isFiltering) {
      console.log("Applying filters to content");
    }
  }, [channelId, isFiltering]);

  // Reset content viewer when closing
  const handleCloseViewer = () => {
    setSelectedContent(null);
  };

  // Simulate approving content
  const handleApproveContent = () => {
    setIsApproving(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Content approved:", selectedContent);
      setIsApproving(false);
      setSelectedContent(null);

      // Show success toast or notification in a real implementation
    }, 1000);
  };

  // Handle filtering
  const handleFilter = () => {
    setIsFiltering(!isFiltering);
  };

  // If the page is still loading or channelId isn't available
  if (!channelId || typeof channelId !== "string") {
    return (
      <DashboardLayout>
        <div className="flex-1 p-8 flex items-center justify-center">
          <p>Loading platform data...</p>
        </div>
      </DashboardLayout>
    );
  }

  // Get platform info from our mock data
  const platform = platformData[channelId] || {
    name: "Unknown Platform",
    icon: FileText,
    color: "blue",
  };

  const PlatformIcon = platform.icon;

  return (
    <>
      <Head>
        <title>Agentic Flow | {platform.name}</title>
        <meta
          name="description"
          content={`Ad performance and analytics for ${platform.name}`}
        />
      </Head>
      <DashboardLayout>
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-transparent backdrop-blur-xs px-4 sm:px-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/content-system")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className={`rounded-full bg-${platform.color}-500/10 p-1.5`}>
              <PlatformIcon className={`h-5 w-5 text-${platform.color}-500`} />
            </div>
            <h2 className="text-xl font-semibold">{platform.name}</h2>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button
              variant={isFiltering ? "default" : "outline"}
              onClick={handleFilter}
            >
              <Filter className="mr-2 h-4 w-4" />
              {isFiltering ? "Filters Applied" : "Filter"}
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Reports
            </Button>
          </div>
        </header>

        <div className="flex-1 space-y-4 p-8 pt-6">
          {selectedContent ? (
            <Card className="border bg-transparent">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Ad Content Viewer</CardTitle>
                  <CardDescription>
                    Reviewing agent-generated content for {platform.name}
                  </CardDescription>
                </div>
                <Button variant="ghost" onClick={handleCloseViewer}>
                  Close Viewer
                </Button>
              </CardHeader>
              <CardContent>
                <ContentViewer
                  content={selectedContent}
                  platformId={channelId}
                />
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share with Team
                    </Button>
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleCloseViewer}>
                      Request Changes
                    </Button>
                    <Button
                      onClick={handleApproveContent}
                      disabled={isApproving}
                    >
                      {isApproving ? "Approving..." : "Approve & Publish"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border bg-transparent">
                  <CardContent className="p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Impressions
                      </p>
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-2xl font-bold">412,789</h3>
                      <Badge
                        variant="outline"
                        className="bg-green-500/10 text-green-500"
                      >
                        <TrendingUp className="h-3 w-3 mr-1" />
                        12.3%
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border bg-transparent">
                  <CardContent className="p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Click-Through Rate
                      </p>
                      <MousePointer className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-2xl font-bold">3.8%</h3>
                      <Badge
                        variant="outline"
                        className="bg-green-500/10 text-green-500"
                      >
                        <TrendingUp className="h-3 w-3 mr-1" />
                        0.7%
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border bg-transparent">
                  <CardContent className="p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Active Ads
                      </p>
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-2xl font-bold">37</h3>
                      <Badge
                        variant="outline"
                        className="bg-green-500/10 text-green-500"
                      >
                        <TrendingUp className="h-3 w-3 mr-1" />4
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border bg-transparent">
                  <CardContent className="p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Last Update
                      </p>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-xl font-bold">3 hours ago</h3>
                      <p className="text-sm text-muted-foreground">
                        by Ad Intelligence Agent
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Tabs
                defaultValue="analytics"
                value={activeTab}
                onValueChange={setActiveTab}
                className="space-y-4"
              >
                <TabsList className="grid w-full max-w-md grid-cols-3 bg-slate-800/30">
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  <TabsTrigger value="content">Ad Content</TabsTrigger>
                  <TabsTrigger value="agents">Agent Performance</TabsTrigger>
                </TabsList>

                <TabsContent value="analytics" className="space-y-4">
                  <Card className="border bg-transparent">
                    <CardHeader>
                      <CardTitle>Ad Performance</CardTitle>
                      <CardDescription>
                        Performance metrics for {platform.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChannelAnalytics channelId={channelId} />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="content" className="space-y-4">
                  <Card className="border bg-transparent">
                    <CardHeader>
                      <CardTitle>Ad Content Library</CardTitle>
                      <CardDescription>
                        Agent-generated content for {platform.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChannelContentList
                        channelId={channelId}
                        onViewContent={setSelectedContent}
                        isFiltered={isFiltering}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="agents" className="space-y-4">
                  <Card className="border bg-transparent">
                    <CardHeader>
                      <CardTitle>Agent Performance</CardTitle>
                      <CardDescription>
                        See how each agent is performing for {platform.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <AgentPerformanceForChannel channelId={channelId} />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </DashboardLayout>
    </>
  );
};

export default ChannelDetailPage;
