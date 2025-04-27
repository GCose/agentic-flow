import { NextPage } from "next";
import Head from "next/head";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/layouts/dashboard-layout";

const DesignerDashboard: NextPage = () => {
  return (
    <>
      <Head>
        <title>Agentic Flow | Designer Dashboard</title>
        <meta
          name="description"
          content="Designer dashboard for Agentic Flow"
        />
      </Head>
      <DashboardLayout role="designer">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">
              Designer Dashboard
            </h2>
          </div>

          <Card className="border bg-transparent backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Welcome to your dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Here you can manage your design tasks, upload graphics and
                visual assets, and view AI research to guide your creative work.
                Use the sidebar to navigate to different sections.
              </p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </>
  );
};

export default DesignerDashboard;
