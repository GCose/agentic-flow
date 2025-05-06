import DashboardLayout from "@/components/layouts/dashboard-layout";
import OnboardingHeader from "@/components/onboarding/onboarding-header";
import OnboardingWizard from "@/components/onboarding/onboarding-wizard";
import type { NextPage } from "next";
import Head from "next/head";

const OnboardingPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Agentic Flow | Onboarding & Prompts</title>
        <meta name="description" content="Create and customize AI agents" />
      </Head>
      <DashboardLayout role="client">
        <OnboardingHeader />
        <div className="flex-1 p-8 pt-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold tracking-tight">
              Onboarding & Prompt Customization
            </h2>
          </div>
          <OnboardingWizard />
        </div>
      </DashboardLayout>
    </>
  );
};

export default OnboardingPage;
