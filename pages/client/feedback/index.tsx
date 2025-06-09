import FeedbackList from "@/components/feedback/feedback-list";
import FeedbackOverview from "@/components/feedback/feedback-overview";
import OptimizationSuggestions from "@/components/feedback/optimization-suggestions";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import type { NextPage } from "next";
import { ClientPageMeta } from "@/page-config/meta.config";
import DashboardHeader from "@/components/dashboard/dashboard-header";

const FeedbackPage: NextPage = () => {
  return (
    <DashboardLayout role="client" meta={ClientPageMeta.feedbackPage}>
      <DashboardHeader title="Feedback & Optimization" />
      <div className="flex-1 space-y-4 p-8 pt-6">
        <FeedbackOverview />
        <div className="grid gap-4 md:grid-cols-7 pt-3">
          <div className="col-span-4">
            <FeedbackList />
          </div>
          <div className="col-span-3">
            <OptimizationSuggestions />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FeedbackPage;
