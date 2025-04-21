import ClientActivity from "@/components/client-dashboard/client-activity";
import ClientDashboardHeader from "@/components/client-dashboard/client-dashboard-header";
import ClientList from "@/components/client-dashboard/client-list";
import ClientOverview from "@/components/client-dashboard/client-overview";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import type { NextPage } from "next";
import Head from "next/head";

const ClientDashboardPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Agentic Flow | Client Dashboard </title>
        <meta
          name="description"
          content="Monitor client interactions with your AI agents"
        />
      </Head>
      <DashboardLayout>
        <ClientDashboardHeader />
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">
              Client Overview
            </h2>
          </div>
          <ClientOverview />
          <div className="grid gap-4 md:grid-cols-7 pt-2">
            <div className="col-span-4">
              <ClientList />
            </div>
            <div className="col-span-3">
              <ClientActivity />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default ClientDashboardPage;
