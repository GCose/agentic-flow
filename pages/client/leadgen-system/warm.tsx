import Head from "next/head";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import LeadGenHeader from "@/components/systems/leadgen-system/leadgen-header";
import WarmLeads from "@/components/systems/leadgen-system/warm-leads";

const ClientWarmLeadsPage = () => {
  return (
    <>
      <Head>
        <title>Aftermath Marketing | Warm Leads</title>
        <meta
          name="description"
          content="Manage your warm leads in the lead generation system"
        />
      </Head>
      <DashboardLayout role="client">
        <LeadGenHeader title="Warm Leads" hasBackButton={true} />
        <div className="flex-1 space-y-6 p-8 pt-6">
          <WarmLeads />
        </div>
      </DashboardLayout>
    </>
  );
};

export default ClientWarmLeadsPage;
