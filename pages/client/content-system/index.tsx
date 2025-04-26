import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ContentAgentPerformance from "@/components/systems/content-system/content-agent-performance";
import ContentCalendar from "@/components/systems/content-system/content-calendar";
import ContentChannelCard from "@/components/systems/content-system/content-channel";
import ContentSystemHeader from "@/components/systems/content-system/content-generation-header";
import RecentContent from "@/components/systems/content-system/recent-content";

const ContentSystemPage = () => {
  const [activeTab, setActiveTab] = useState("channels");
  const [searchQuery] = useState("");

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

  return (
    <>
      <Head>
        <title>Aftermath Marketing | Content System</title>
        <link rel="icon" href="/images/logo.jpg" />
        <meta
          name="description"
          content="Manage and monitor your social media ad campaigns"
        />
      </Head>
      <DashboardLayout role="client">
        <ContentSystemHeader />
        <div className="flex-1 space-y-4 px-8 pb-6">
          <Tabs
            value={activeTab}
            className="space-y-4 border-slate-800"
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
                    href={`/client/content-system/${platform.id}`}
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
