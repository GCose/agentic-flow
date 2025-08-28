import FeedbackList from "@/components/feedback/feedback-list";
import FeedbackOverview from "@/components/feedback/feedback-overview";
import OptimizationSuggestions from "@/components/feedback/optimization-suggestions";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import type { NextPage } from "next";
import { ClientPageMeta } from "@/page-meta/meta";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";

const FeedbackPage: NextPage = () => {
  const { isImpersonating, stopImpersonation } = useAuth();

  return (
    <DashboardLayout role="client" meta={ClientPageMeta.feedbackPage}>
      {isImpersonating && (
        <div className="w-full flex justify-end pt-4 pb-2">
          <Button
            size="sm"
            variant="destructive"
            className="rounded-full px-6 py-2 font-semibold text-white bg-gradient-to-r from-blue-900 via-blue-700 to-indigo-500 shadow-lg hover:from-blue-800 hover:to-indigo-600 transition-all duration-200 border-0"
            onClick={stopImpersonation}
          >
            Return to Admin View
          </Button>
        </div>
      )}
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
