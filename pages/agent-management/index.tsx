import type { NextPage } from "next";
import Head from "next/head";
import AgentManagementHeader from "@/components/agent-management/agent-management-header";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import AgentList from "@/components/agent-management/agent-list";

const AgentManagementPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Agentic Flow | Agent Management</title>
        <meta name="description" content="Manage your AI agents" />
      </Head>
      <DashboardLayout>
        <AgentManagementHeader />
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">
              Agent Management
            </h2>
          </div>
          <AgentList />
        </div>
      </DashboardLayout>
    </>
  );
};

export default AgentManagementPage;
