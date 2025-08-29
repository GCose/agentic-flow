import DashboardLayout from "@/components/dashboard/dashboard-layout";
import SubSystemComponent from "@/components/sub-system";
import { ClientSalesSystemSubSystems } from "@/data/sub-systems";
import { ClientPageMeta } from "@/page-meta/meta";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";

const SalesSystemPage = () => {
  const { isImpersonating, stopImpersonation } = useAuth();

  return (
    <DashboardLayout role="client" meta={ClientPageMeta.salesSystemPage}>
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
      <DashboardHeader title="Sales System" role="client" />
      <div className="flex-1 space-y-6 px-8">
        {/*==================== SubSystem Component ====================*/}
        <SubSystemComponent
          title="Sub-Systems"
          systems={ClientSalesSystemSubSystems}
        />
        {/*==================== End of SubSystem Component ====================*/}
      </div>
    </DashboardLayout>
  );
};

export default SalesSystemPage;
