import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Thermometer, Snowflake, ArrowUpRight } from "lucide-react";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import LeadGenHeader from "@/components/systems/leadgen-system/leadgen-header";
import LeadGenOverview from "@/components/systems/leadgen-system/leadgen-overview";
import { Card, CardContent } from "@/components/ui/card";
import { LeadType } from "@/types/leads";

const ClientLeadGenSystemPage = () => {
  const router = useRouter();

  // Handle card click to navigate to the detailed view
  const handleLeadTypeClick = (leadType: LeadType) => {
    router.push(`/client/leadgen-system/${leadType}`);
  };

  return (
    <>
      <Head>
        <title>Aftermath Marketing | LeadGen System</title>
        <link rel="icon" href="/images/logo.jpg" />
        <meta
          name="description"
          content="Lead generation system for tracking and managing leads"
        />
      </Head>
      <DashboardLayout role="client">
        <LeadGenHeader title="LeadGen System" />
        <div className="flex-1 space-y-6 p-8 pt-6">
          <LeadGenOverview />

          <div className="pt-8">
            <h2 className="text-xl font-bold tracking-tight mb-4">
              Sub-systems
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {/*==================== Warm leads card ====================*/}
              <Card
                onClick={() => handleLeadTypeClick("warm")}
                className="border-none bg-gradient-to-br from-orange-500/10 to-orange-500/5 cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-1"
              >
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="rounded-full bg-orange-500/10 p-4 mb-4">
                    <Thermometer className="h-8 w-8 text-orange-500" />
                  </div>
                  <h3 className="font-medium text-lg mb-2">Warm Leads</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Manage leads that have shown interest in your products or
                    services
                  </p>
                  <div className="flex items-center justify-center w-full mt-auto">
                    <Link
                      href="/client/leadgen-system/warm"
                      className="flex items-center text-primary text-sm hover:underline"
                    >
                      <span>View warm leads</span>
                      <ArrowUpRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
              {/*==================== End of Warm leads card ====================*/}

              {/*==================== Cold leads card ====================*/}
              <Card
                onClick={() => handleLeadTypeClick("cold")}
                className="border-none bg-gradient-to-br from-blue-500/10 to-blue-500/5 cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-1"
              >
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="rounded-full bg-blue-500/10 p-4 mb-4">
                    <Snowflake className="h-8 w-8 text-blue-500" />
                  </div>
                  <h3 className="font-medium text-lg mb-2">Cold Leads</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Discover potential leads and start your outreach campaigns
                  </p>
                  <div className="flex items-center justify-center w-full mt-auto">
                    <Link
                      href="/client/leadgen-system/cold"
                      className="flex items-center text-primary text-sm hover:underline"
                    >
                      <span>View cold leads</span>
                      <ArrowUpRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
              {/*==================== End of Cold leads card ====================*/}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default ClientLeadGenSystemPage;
