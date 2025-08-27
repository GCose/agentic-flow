import type { NextPage } from "next";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { AdminPageMeta } from "@/page-meta/meta";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import ComingSoon from "@/components/coming-soon";
import AgentPerformanceTable from "@/components/agent-performance-table";
import AgentPerformanceCharts from "@/components/agent-performance-charts";

const AgentManagementPage: NextPage = () => {
  return (
    <DashboardLayout meta={AdminPageMeta.agentManagementPage}>
      <DashboardHeader title="Agentic AI Management" />
      <div className="flex-1 space-y-6 p-8 pt-6">
        <section>
          <h2 className="text-2xl font-bold text-purple-700 mb-2">AI Agent Performance</h2>
          <p className="text-white mb-4">Track usage, tasks, and activity of your agentic AI services.</p>
          <AgentPerformanceTable />
        </section>
        <section className="mt-8">
          <h2 className="text-xl font-bold text-purple-700 mb-2">Agentic Features</h2>
          <ul className="list-disc pl-6 text-white space-y-2">
            <li>Multi-agent orchestration and workflow automation</li>
            <li>Real-time performance and usage analytics</li>
            <li>Agentic memory and context management</li>
            <li>Customizable agent roles and capabilities</li>
            <li>Secure agent-to-agent communication</li>
          </ul>
        </section>
        <section className="mt-8">
          <AgentPerformanceCharts />
        </section>
        <section className="mt-8">
          <ComingSoon />
        </section>
      </div>
    </DashboardLayout>
  );
};

export default AgentManagementPage;
