import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ContentCalendar from "@/components/systems/content-system/content-calendar";
import RecentContent from "@/components/systems/content-system/recent-content";
import ContentAgentPerformance from "@/components/systems/content-system/content-agent-performance";
import { AdminPageMeta } from "@/page-config/meta.config";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import ChannelCard from "@/components/cards/channel-card";

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

const ContentSystemPage = () => {
  const [activeTab, setActiveTab] = useState("channels");
  const [searchQuery] = useState("");
  const [client, setClient] = useState<Client | null>(null);
  const router = useRouter();

  // Get clientId from query parameter
  useEffect(() => {
    const { clientId } = router.query;
    if (clientId && typeof clientId === "string") {
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
      router.push(`/admin/clients/${client.id}`);
    } else {
      router.push("/admin/clients");
    }
  };

  return (
    <DashboardLayout meta={AdminPageMeta.clientDashboardContentPage}>
      <DashboardHeader
        role="admin"
        hasBackButton={true}
        onBackClick={handleBackToClient}
        title={client ? `${client.name} | Content System` : "Content System"}
      />
      <div className="flex-1 space-y-4 px-8 py-4">
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
                  href={`/admin/clients/${client?.id}/content-system/${platform.id}`}
                >
                  <ChannelCard
                    name={platform.name}
                    icon={platform.icon}
                    color={platform.color}
                  />
                </Link>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="agents" className="space-y-4">
            <Card className="border border-blue-900/30 bg-transparent">
              <CardHeader>
                <CardTitle>Agent Performance</CardTitle>
                <CardDescription>
                  See how your AI content agents are performing across platforms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ContentAgentPerformance />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-4">
            <Card className="border border-blue-900/30 bg-transparent ">
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
          <Card className="border border-blue-900/30 bg-transparent ">
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
  );
};

export default ContentSystemPage;
