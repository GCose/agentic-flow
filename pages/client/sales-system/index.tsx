import DashboardLayout from "@/components/dashboard/dashboard-layout";
import SubSystemComponent from "@/components/sub-system";
import { ClientSalesSystemSubSystems } from "@/data/sub-systems";
import { ClientPageMeta } from "@/page-meta/meta";
import DashboardHeader from "@/components/dashboard/dashboard-header";

const SalesSystemPage = () => {
  return (
    <DashboardLayout role="client" meta={ClientPageMeta.salesSystemPage}>
      <DashboardHeader title="Sales System" />
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
