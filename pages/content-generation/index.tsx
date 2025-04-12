import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  FileText,
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
import ContentCalendar from "@/components/content-generation/content-calendar";
import ContentChannelCard from "@/components/content-generation/content-channel";
import ContentSystemHeader from "@/components/content-generation/content-generation-header";
import RecentContent from "@/components/content-generation/recent-content";
import ContentAgentPerformance from "@/components/content-generation/content-agent-performance";

const ContentSystemPage = () => {
  const [activeTab, setActiveTab] = useState("channels");
  const [searchQuery] = useState("");
  const [filterApplied, setFilterApplied] = useState(false);

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

  // Handle search from header
  //   const handleSearch = (query: string) => {
  //     setSearchQuery(query);
  //   };

  //   // Handle filter button clicks
  //   const handleFilter = () => {
  //     // Toggle filter state to demonstrate functionality
  //     setFilterApplied(!filterApplied);

  //     // In a real implementation, this would open a filter modal/dropdown
  //     // with options like: performance range, date range, etc.
  //     console.log(
  //       "Filter button clicked - would show filter options in real implementation"
  //     );
  //   };

  return (
    <>
      <Head>
        <title>Agentic Flow | Content System</title>
        <meta
          name="description"
          content="Manage and monitor your social media ad campaigns"
        />
      </Head>
      <DashboardLayout>
        <ContentSystemHeader />
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">
              Content System
            </h2>
            <div className="flex items-center gap-2">
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                View Agent Reports
              </Button>
            </div>
          </div>

          {filterApplied && (
            <div className="bg-muted/30 p-3 rounded-md flex justify-between items-center">
              <span className="text-sm">
                Filter applied: Showing high-performing content only
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilterApplied(false)}
              >
                Clear Filter
              </Button>
            </div>
          )}

          <Tabs
            value={activeTab}
            className="space-y-4"
            defaultValue="channels"
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full max-w-md grid-cols-3 bg-slate-800/30">
              <TabsTrigger value="channels">Channels</TabsTrigger>
              <TabsTrigger value="agents">Agents</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
            </TabsList>

            <TabsContent value="channels" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredPlatforms.map((platform) => (
                  <Link
                    key={platform.id}
                    href={`/content-system/channels/${platform.id}`}
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
            <Card className="border  bg-transparent backdrop-blur-sm">
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
