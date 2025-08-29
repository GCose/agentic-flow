import DashboardHeader from "@/components/dashboard/dashboard-header";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { ClientPageMeta } from "@/page-meta/meta";
import SubSystemComponent from "@/components/sub-system";
import { clientDashboardSystem } from "@/data/sub-systems";
import DashboardStatCard from "@/components/cards/dashboard-stats-card";
import { clientDashboardStats } from "@/data/stats-card-data";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";

const DashboardPage = () => {
  const { isImpersonating, stopImpersonation } = useAuth();
  return (
    <DashboardLayout role="client" meta={ClientPageMeta.dashboardPage}>
      {isImpersonating && (
        <div className="w-full flex justify-end pt-4 pb-2">
          <Button
            size="sm"
            variant="destructive"
            className="rounded-full px-6 py-2 font-semibold text-white bg-gradient-to-r from-blue-900 via-blue-700 to-indigo-500 shadow-lg hover:from-blue-800 hover:to-indigo-600 transition-all duration-200 border-0"
            onClick={stopImpersonation}
          >
            Return to Admin View
          </Button>
        </div>
      )}
      <DashboardHeader title="Dashboard" role="client" />
      <div className="flex-1 p-8 ">
        <div className="mb-10">
          {/*==================== Stats Overview ====================*/}
          <DashboardStatCard stats={clientDashboardStats} />
          {/*==================== SubSystem Component ====================*/}
          <SubSystemComponent
            title="Subscribed Systems"
            systems={clientDashboardSystem}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
