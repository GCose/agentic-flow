import DashboardHeader from "@/components/dashboard/dashboard-header";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import Appointments from "@/components/systems/leadgen-system/appointments";
import { ClientPageMeta } from "@/page-config/meta.config";

const ClientAppointmentsPage = () => {
  return (
    <DashboardLayout role="client" meta={ClientPageMeta.appointmentsPage}>
      <DashboardHeader
        role="client"
        title="Appointments"
        hasBackButton={true}
      />
      <div className="flex-1 px-8 py-2">
        <Appointments role="client" />
      </div>
    </DashboardLayout>
  );
};

export default ClientAppointmentsPage;
