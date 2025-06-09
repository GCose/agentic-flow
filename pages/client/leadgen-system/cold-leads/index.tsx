import Head from "next/head";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import ColdLeads from "@/components/systems/leadgen-system/cold-leads";
import LeadGenHeader from "@/components/systems/leadgen-system/leadgen-header";
import { ClientPageMeta } from "@/page-config/meta.config";

const ClientColdLeadsPage = () => {
  return (
    <>
      <Head>
        <title>Aftermath Marketing | Cold Leads</title>
        <meta
          name="description"
          content="Manage your cold leads in the lead generation system"
        />
      </Head>
      <DashboardLayout role="client" meta={ClientPageMeta.coldLeadsSubPage}>
        <LeadGenHeader title="Cold Leads" hasBackButton={true} role="client" />
        <div className="flex-1 space-y-6 p-8 pt-6">
          <ColdLeads />
        </div>
      </DashboardLayout>
    </>
  );
};

export default ClientColdLeadsPage;
