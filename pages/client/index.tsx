import type { NextPage } from "next";
import Head from "next/head";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import DashboardStats from "@/components/dashboard/admin-dashboard-stats";
import SystemCards from "@/components/dashboard/system-cards";

const DashboardPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Aftermath Marketing | Home</title>
        <link rel="icon" href="/images/logo.jpg" />
        <meta
          name="description"
          content="Welcome to the Agentic Flow AI agent management system"
        />
      </Head>
      <DashboardLayout role="client">
        <DashboardHeader />
        <div className="flex-1 p-8 pt-6">
          {/*==================== Stats Overview ====================*/}
          <div className="mb-10">
            <h2 className="text-xl font-bold tracking-tight mb-6">
              System Overview
            </h2>
            <DashboardStats />
          </div>
          {/*==================== End of Stats Overview ====================*/}

          {/*==================== Core Systems ====================*/}
          <div>
            <h2 className="text-xl font-bold tracking-tight mb-6">
              Subscribed System
            </h2>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
              <SystemCards />
            </div>
          </div>
          {/*==================== End of Core Systems ====================*/}
        </div>
      </DashboardLayout>
    </>
  );
};

export default DashboardPage;
