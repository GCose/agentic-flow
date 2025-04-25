import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Music2Icon,
  ArrowLeft,
} from "lucide-react";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import ContentCalendar from "@/components/content-system/content-calendar";
import ContentChannelCard from "@/components/content-system/content-channel";
import ContentSystemHeader from "@/components/content-system/content-generation-header";
import RecentContent from "@/components/content-system/recent-content";
import ContentAgentPerformance from "@/components/content-system/content-agent-performance";

// Client interface
interface Client {
  id: string;
  name: string;
  description: string;
}

// Sample client data for lookup
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
  // Add more clients for the mapping
};

const ContentSystemPage = () => {
  const [activeTab, setActiveTab] = useState("channels");
  const [searchQuery] = useState("");
  const [client, setClient] = useState<Client | null>(null);
  const router = useRouter();

  // Get clientId from query parameter
  useEffect(() => {
    const { clientId } = router.query;
    if (clientId && typeof clientId === "string") {
      // In a real app, this would be an API call
      const clientData = clients[clientId];
      if (clientData) {
        setClient(clientData);
      }
    }
  }, [router.query]);

  // Social media ad platforms data
  const adPlatforms = [
    {
      id: "facebook",
      name: "Facebook Channel",
      icon: Facebook,
      color: "blue",
    },
    {
      id: "instagram",
      name: "Instagram Channel",
      icon: Instagram,
      color: "pink",
    },
    {
      id: "twitter",
      name: "Twitter / X Channel",
      icon: Twitter,
      color: "cyan",
    },
    {
      id: "linkedin",
      name: "LinkedIn Channel",
      icon: Linkedin,
      color: "indigo",
    },
    {
      id: "youtube",
      name: "YouTube Channel",
      icon: Youtube,
      color: "red",
    },
    {
      id: "tiktok",
      name: "TikTok Channel",
      icon: Music2Icon,
      color: "purple",
    },
  ];

  // Filter platforms based on search
  const filteredPlatforms = adPlatforms.filter((platform) =>
    platform.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle going back to client dashboard
  const handleBackToClient = () => {
    if (client) {
      router.push(`/admin/client-dashboard/${client.id}`);
    } else {
      router.push("/admin/client-dashboard");
    }
  };

  return (
    <>
      <Head>
        <title> Agentic Flow | Content System</title>
        <meta
          name="description"
          content="Manage and monitor your social media ad campaigns"
        />
      </Head>
      <DashboardLayout>
        <ContentSystemHeader />
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {client && (
                <Button
                  variant="outline"
                  onClick={handleBackToClient}
                  className="h-9 w-9 p-0 rounded-full"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="sr-only">Back</span>
                </Button>
              )}
              <h2 className="text-3xl font-bold tracking-tight">
                {client ? `${client.name} | Content System` : "Content System"}
              </h2>
            </div>
          </div>

          <Tabs
            value={activeTab}
            className="space-y-4"
            defaultValue="channels"
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full max-w-md grid-cols-3 bg-slate-800/30 mt-6">
              <TabsTrigger value="channels">Channels</TabsTrigger>
              <TabsTrigger value="agents">Agents</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
            </TabsList>

            <TabsContent value="channels" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredPlatforms.map((platform) => (
                  <Link
                    key={platform.id}
                    href={`/content-system/channels/${platform.id}${
                      client ? `?clientId=${client.id}` : ""
                    }`}
                  >
                    <ContentChannelCard
                      name={platform.name}
                      icon={platform.icon}
                      color={platform.color}
                    />
                  </Link>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="agents" className="space-y-4">
              <Card className="border bg-transparent">
                <CardHeader>
                  <CardTitle>Agent Performance</CardTitle>
                  <CardDescription>
                    See how your AI content agents are performing across
                    platforms
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ContentAgentPerformance />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="calendar" className="space-y-4">
              <Card className="border bg-transparent backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Content Calendar</CardTitle>
                  <CardDescription>
                    Upcoming and scheduled ad content across platforms
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ContentCalendar />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {activeTab === "channels" && (
            <Card className="border border-slate-800 bg-transparent backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Recent Agent-Generated Content</CardTitle>
                <CardDescription>
                  Latest content created by AI agents across platforms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentContent />
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </>
  );
};

export default ContentSystemPage;
