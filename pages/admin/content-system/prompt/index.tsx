import { useState } from "react";
import Head from "next/head";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ContentCalendar from "@/components/content-system/content-calendar";
import ContentSystemHeader from "@/components/content-system/content-generation-header";
import ContentGenerationForm from "@/components/content-system/content-generation-form";
import ContentHistory from "@/components/content-system/content-history";

const ContentSystemPage = () => {
  const [activeTab, setActiveTab] = useState("channels");

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
              Content Prompting
            </h2>
          </div>

          <Tabs
            value={activeTab}
            className="space-y-4"
            defaultValue="channels"
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full max-w-md grid-cols-3 bg-slate-800/30">
              <TabsTrigger value="channels">Generate Content</TabsTrigger>
              <TabsTrigger value="agents">Agents</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
            </TabsList>

            <TabsContent value="channels" className="space-y-4">
              <Card className="border bg-transparent backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Agent Performance</CardTitle>
                  <CardDescription>
                    See how your AI content agents are performing across
                    platforms
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ContentGenerationForm />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="agents" className="space-y-4">
              <Card className="border bg-transparent backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Agent Performance</CardTitle>
                  <CardDescription>
                    See how your AI content agents are performing across
                    platforms
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ContentHistory />
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
        </div>
      </DashboardLayout>
    </>
  );
};

export default ContentSystemPage;
