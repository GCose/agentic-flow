import FeedbackHeader from "@/components/feedback/feedback-header";
import FeedbackList from "@/components/feedback/feedback-list";
import FeedbackOverview from "@/components/feedback/feedback-overview";
import OptimizationSuggestions from "@/components/feedback/optimization-suggestions";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import type { NextPage } from "next";
import Head from "next/head";

const FeedbackPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Agentic Flow | Feedback & Optimization</title>
        <meta
          name="description"
          content="Collect feedback and optimize your AI agents"
        />
      </Head>
      <DashboardLayout role="client">
        <FeedbackHeader />
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">
              Feedback & Optimization
            </h2>
          </div>
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
    </>
  );
};

export default FeedbackPage;
