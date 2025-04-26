import Head from "next/head";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import ColdLeads from "@/components/systems/leadgen-system/cold-leads";
import LeadGenHeader from "@/components/systems/leadgen-system/leadgen-header";

const ClientColdLeadsPage = () => {
  return (
    <>
      <Head>
        <title>Agentic Flow | Cold Leads</title>
        <meta
          name="description"
          content="Manage your cold leads in the lead generation system"
        />
      </Head>
      <DashboardLayout role="client">
        <LeadGenHeader title="Cold Leads" hasBackButton={true} />
        <div className="flex-1 space-y-6 p-8 pt-6">
          <ColdLeads />
        </div>
      </DashboardLayout>
    </>
  );
};

export default ClientColdLeadsPage;
