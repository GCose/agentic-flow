import type { NextPage } from "next";
import Head from "next/head";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import DashboardStats from "@/components/dashboard/dashboard-stats";
import RecentActivity from "@/components/dashboard/recent-activity";
import TopAgents from "@/components/dashboard/top-agents";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import DashboardOverview from "@/components/dashboard/dashboard-overview";

const DashboardPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Agentic Flow | Dashboard</title>
        <meta name="description" content="Monitor and manage your AI agents" />
      </Head>
      <DashboardLayout>
        <DashboardHeader />
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                Last updated: Just now
              </span>
            </div>
          </div>
          <DashboardStats />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 border bg-transparent">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
                <CardDescription>Agent performance over time</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <DashboardOverview />
              </CardContent>
            </Card>
            <Card className="col-span-3 border bg-transparent">
              <CardHeader>
                <CardTitle>Top Performing Agents</CardTitle>
                <CardDescription>
                  Agents with highest success rates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TopAgents />
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-1">
            <Card className="col-span-1 border bg-transparent">
              <CardHeader className="border-b">
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest agent interactions and events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentActivity />
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default DashboardPage;
