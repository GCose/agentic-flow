import DashboardHeader from "@/components/dashboard/dashboard-header";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import OnboardingWizard from "@/components/onboarding/onboarding-wizard";
import { ClientPageMeta } from "@/page-config/meta.config";
import type { NextPage } from "next";

const OnboardingPage: NextPage = () => {
  return (
    <DashboardLayout role="client" meta={ClientPageMeta.onboardingPage}>
      <DashboardHeader title="Onboarding" />
      <div className="flex-1 p-8 pt-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold tracking-tight">
            Onboarding & Prompt Customization
          </h2>
        </div>
        <OnboardingWizard />
      </div>
    </DashboardLayout>
  );
};

export default OnboardingPage;
