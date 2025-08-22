import type { NextPage } from "next";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { AdminPageMeta } from "@/page-meta/meta";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import ComingSoon from "@/components/coming-soon";

const AgentManagementPage: NextPage = () => {
  return (
    <DashboardLayout 
      role="Administrator" 
      allowedRoles={['Administrator']}
      meta={AdminPageMeta.agentManagementPage}
    >
      <DashboardHeader title="Agent Management" />
      <div className="flex-1 space-y-6 p-8 pt-6 flex text-center justify-center">
        <ComingSoon />
      </div>
    </DashboardLayout>
  );
};

export default AgentManagementPage;
