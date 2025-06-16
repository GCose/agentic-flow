import { useState } from "react";
import { useRouter } from "next/router";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  LucideIcon,
  Download,
  Eye,
  MousePointer,
  FileText,
  Clock,
  TrendingUp,
  Share2,
  Music2Icon,
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
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
import AgentPerformanceForChannel from "@/components/systems/content-system/agent-performance-for-channel";
import ChannelAnalytics from "@/components/systems/content-system/channel-analytics";
import ChannelContentList from "@/components/systems/content-system/channel-content-list";
import ContentViewer from "@/components/systems/content-system/content-viewer";
import { ClientPageMeta } from "@/page-config/meta.config";
import DashboardHeader from "@/components/dashboard/dashboard-header";

interface Client {
  id: string;
  name: string;
  description: string;
}

const clients: Record<string, Client> = {
  "client-1": {
    id: "client-1",
    name: "Nextgen Agency",
    description: "Forward-thinking digital marketing solutions",
  },
  "client-2": {
    id: "client-2",
    name: "Aftermath Marketing",
    description: "Results-driven performance marketing",
  },
  "client-3": {
    id: "client-3",
    name: "Group26Consult",
    description: "Strategic marketing consultancy",
  },
};

export type ChannelId =
  | "facebook"
  | "instagram"
  | "twitter"
  | "linkedin"
  | "youtube"
  | "tiktok";

export interface ContentData {
  id: string;
  title: string;
  type: string;
  platform: string;
  headline: string;
  copy: string;
  callToAction: string;
  targetAudience: string;
  imageUrl: string;
  stats: {
    impressions: number;
    ctr: string;
    conversions: number;
  };
}

interface PlatformInfo {
  name: string;
  icon: LucideIcon;
  color: string;
}

const platformData: Record<ChannelId, PlatformInfo> = {
  facebook: { name: "Facebook Channel Content", icon: Facebook, color: "blue" },
  instagram: {
    name: "Instagram Channel Content",
    icon: Instagram,
    color: "pink",
  },
  twitter: {
    name: "Twitter / X Channel Content",
    icon: Twitter,
    color: "cyan",
  },
  linkedin: {
    name: "LinkedIn Channel Content",
    icon: Linkedin,
    color: "indigo",
  },
  youtube: { name: "YouTube Channel Contents", icon: Youtube, color: "red" },
  tiktok: {
    name: "TikTok Channel Contents",
    icon: Music2Icon,
    color: "purple",
  },
};

// Function to check if a string is a valid channel ID
function isValidChannelId(id: string | string[] | undefined): id is ChannelId {
  if (typeof id !== "string") return false;
  return Object.keys(platformData).includes(id as ChannelId);
}

const AdminChannelsPage = () => {
  const router = useRouter();
  const { channelId, clientId } = router.query;
  const [activeTab, setActiveTab] = useState("content");
  const [selectedContent, setSelectedContent] = useState<ContentData | null>(
    null
  );
  const [isApproving, setIsApproving] = useState(false);
  const [isFiltering] = useState(false);
  const client =
    clientId && typeof clientId === "string" ? clients[clientId] : null;

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
    }, 1000);
  };

  // Helper function to fix the type issue
  const handleViewContent = (content: ContentData) => {
    setSelectedContent(content);
  };

  // If the page is still loading or channelId isn't available
  if (!isValidChannelId(channelId)) {
    return (
      <DashboardLayout
        role="client"
        meta={ClientPageMeta.contentSystemDetailPage}
      >
        <div className="flex-1 p-8 flex items-center justify-center">
          <p>
            {!channelId
              ? "Loading platform data..."
              : `Invalid platform: ${channelId}`}
          </p>
        </div>
      </DashboardLayout>
    );
  }

  // channelId is a valid key
  const platform = platformData[channelId];

  return (
    <DashboardLayout
      role="admin"
      meta={{
        title: platform
          ? `${platform.name} | Agentic Flow`
          : "platform Dashboard",
        description: `Dashboard for ${platform?.name || "platform"}`,
      }}
    >
      <DashboardHeader
        role="client"
        hasBackButton
        onBackClick={() =>
          router.push(`/admin/clients/${clientId}/content-system`)
        }
        title={client ? `${client.name} | ${platform.name}` : platform.name}
      />

      <div className="flex-1 space-y-4 p-8">
        {selectedContent ? (
          <Card className="border-blue-900/30 bg-transparent">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Content Viewer</CardTitle>
                <CardDescription>
                  Reviewing agent-generated content for {platform.name}
                </CardDescription>
              </div>
              <Button variant="ghost" onClick={handleCloseViewer}>
                Close Viewer
              </Button>
            </CardHeader>
            <CardContent>
              <ContentViewer platformId={channelId} content={selectedContent} />
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
                  <Button onClick={handleApproveContent} disabled={isApproving}>
                    {isApproving ? "Approving..." : "Approve & Publish"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              <Card className="border border-blue-900/30 bg-transparent ">
                <CardContent className="p-6">
                  <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Impressions
                    </p>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex items-baseline gap-2 mt-4">
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

              <Card className="border border-blue-900/30 bg-transparent ">
                <CardContent className="p-6">
                  <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Engagement Rate
                    </p>
                    <MousePointer className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex items-baseline gap-2 mt-4">
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

              <Card className="border border-blue-900/30 bg-transparent ">
                <CardContent className="p-6">
                  <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Active Posts
                    </p>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex items-baseline gap-2 mt-4">
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

              <Card className="border border-blue-900/30 bg-transparent ">
                <CardContent className="p-6">
                  <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Last Update
                    </p>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col mt-2">
                    <h3 className="text-xl font-bold">3 hours ago</h3>
                    <p className="text-sm text-muted-foreground">
                      by Content Creator Agent
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs
              value={activeTab}
              className="space-y-4"
              defaultValue="content"
              onValueChange={setActiveTab}
            >
              <TabsList className="grid w-full mt-8 max-w-md grid-cols-3 bg-slate-800/30">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="analytics">Content Analytics</TabsTrigger>
                <TabsTrigger value="agents">Agent Performance</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-4">
                <Card className="border border-blue-900/30 bg-transparent">
                  <CardHeader>
                    <CardTitle className="text-center font-medium text-lg">
                      Content Library
                    </CardTitle>
                    <CardDescription className="text-center font-medium text-sm">
                      Agent-generated content for {platform.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChannelContentList
                      channelId={channelId}
                      isFiltered={isFiltering}
                      onViewContent={handleViewContent}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4 ">
                <Card className="border border-blue-900/30 bg-transparent">
                  <CardHeader>
                    <CardTitle>Content Performance</CardTitle>
                    <CardDescription>
                      Performance metrics for {platform.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChannelAnalytics />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="agents" className="space-y-4">
                <Card className="border border-blue-900/30 bg-transparent ">
                  <CardHeader>
                    <CardTitle>Agent Performance</CardTitle>
                    <CardDescription>
                      See how each agent is performing for {platform.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AgentPerformanceForChannel />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminChannelsPage;
