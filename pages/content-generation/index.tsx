import { useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { PlusCircle, Filter, ChevronDown, ListFilter } from "lucide-react";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContentGenerationForm from "@/components/content-generation/content-generation-form";
import ContentHistory from "@/components/content-generation/content-history";
import ContentAgentEventLog from "@/components/content-generation/agent-event-log";
import ContentGenerationHeader from "@/components/content-generation/content-generation-header";

const ContentGenerationPage: NextPage = () => {
  const [activeTab, setActiveTab] = useState("generate");

  return (
    <>
      <Head>
        <title>Agentic Flow | Content System</title>
        <meta
          name="description"
          content="Generate and manage content with AI agents"
        />
      </Head>
      <DashboardLayout>
        <ContentGenerationHeader />
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">
              Content System
            </h2>
            <Button onClick={() => setActiveTab("generate")}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Content
            </Button>
          </div>

          <Tabs
            value={activeTab}
            className="w-full"
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full grid-cols-3 bg-slate-800/30">
              <TabsTrigger value="generate">Generate Content</TabsTrigger>
              <TabsTrigger value="history">Content History</TabsTrigger>
              <TabsTrigger value="events">Agent Event Log</TabsTrigger>
            </TabsList>

            <TabsContent value="generate" className="space-y-4 pt-4">
              <Card className="border bg-transparent backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Generate New Content</CardTitle>
                  <CardDescription>
                    Create new content using AI agents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ContentGenerationForm />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-4 pt-4">
              <Card className="border bg-transparent backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle>Content History</CardTitle>
                    <CardDescription>
                      Previously generated content
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <ListFilter className="mr-2 h-4 w-4" />
                      Sort
                      <ChevronDown className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ContentHistory />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="events" className="space-y-4 pt-4">
              <Card className="border bg-transparent backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Agent Event Log</CardTitle>
                  <CardDescription>
                    Activity log of content generation agents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ContentAgentEventLog />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </>
  );
};

export default ContentGenerationPage;
