import DashboardLayout from "@/components/layouts/dashboard-layout";
import ErrorTracking from "@/components/reporting/error-tracking";
import OutputLogs from "@/components/reporting/output-logs";
import PerformanceMetrics from "@/components/reporting/performanace-metrics";
import ReportingHeader from "@/components/reporting/reporting-header";
import type { NextPage } from "next";
import Head from "next/head";

const ReportingPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Agentic Flow | Reporting & Output</title>
        <meta
          name="description"
          content="View reports and outputs from your AI agents"
        />
      </Head>
      <DashboardLayout>
        <ReportingHeader />
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">
              Reporting & Output
            </h2>
          </div>
          <PerformanceMetrics />
          <div className="grid gap-4 md:grid-cols-2">
            <OutputLogs />
            <ErrorTracking />
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default ReportingPage;
