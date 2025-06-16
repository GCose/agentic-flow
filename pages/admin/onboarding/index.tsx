import DashboardHeader from "@/components/dashboard/dashboard-header";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import OnboardingWizard from "@/components/onboarding/onboarding-wizard";
import { AdminPageMeta } from "@/page-config/meta.config";
import type { NextPage } from "next";

const OnboardingPage: NextPage = () => {
  return (
    <DashboardLayout role="admin" meta={AdminPageMeta.onboardingPage}>
      <DashboardHeader title="Onboarding System" />
      <div className="flex-1 p-8 pt-6">
        <OnboardingWizard />
      </div>
    </DashboardLayout>
  );
};

export default OnboardingPage;
