import { NextPage } from "next";
import Head from "next/head";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import VideographerHeader from "./videographer-header";
import { Brain } from "lucide-react";
import SystemCards from "@/components/cards/system-cards";
import { AdminPageMeta } from "@/page-config/meta.config";

const VideographerDashboard: NextPage = () => {
  return (
    <>
      <Head>
        <title>Agentic Flow | Videographer Dashboard</title>
        <meta
          name="description"
          content="Videographer dashboard for Agentic Flow"
        />
      </Head>
      <DashboardLayout
        role="videographer"
        meta={AdminPageMeta.videographerPage}
      >
        <VideographerHeader />
        <div className="flex-1 p-8 pt-6">
          {/*==================== Welcome Section ====================*/}
          <div className="relative mb-10 py-12 px-8 rounded-2xl overflow-hidden bg-slate-800/30 ">
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                <Brain className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-2">
                  Welcome to Agentic Flow
                </h1>
                <p className="text-xl text-slate-300">
                  Your AI-powered operational ecosystem
                </p>
              </div>
            </div>

            <p className="text-slate-300 max-w-3xl mb-6">
              Agentic Flow streamlines, optimizes, and enhances every major
              revenue-producing and client-facing process across your business —
              from attracting attention and generating leads to converting
              prospects and onboarding clients.
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              <div className="px-4 py-2 rounded-full bg-white/5 text-white text-sm font-medium">
                44 Autonomous AI Agents
              </div>
              <div className="px-4 py-2 rounded-full bg-white/5 text-white text-sm font-medium">
                4 Core Operational Pillars
              </div>
              <div className="px-4 py-2 rounded-full bg-white/5 text-white text-sm font-medium">
                Intelligent by Design
              </div>
              <div className="px-4 py-2 rounded-full bg-white/5 text-white text-sm font-medium">
                Scalable by Nature
              </div>
            </div>
          </div>
          {/*==================== End of Welcome Section ====================*/}

          {/*==================== Core Systems ====================*/}
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-6">
              Core Systems
            </h2>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <SystemCards />
            </div>
          </div>
          {/*==================== End of Core Systems ====================*/}
        </div>
      </DashboardLayout>
    </>
  );
};

export default VideographerDashboard;
