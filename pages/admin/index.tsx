import type { NextPage } from "next";
import Head from "next/head";
import { Brain } from "lucide-react";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import DashboardStats from "@/components/dashboard/admin-dashboard-stats";
import SystemCards from "@/components/dashboard/system-cards";

const DashboardPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Agentic Flow | Home</title>
        <meta
          name="description"
          content="Welcome to the Agentic Flow AI agent management system"
        />
      </Head>
      <DashboardLayout>
        <DashboardHeader />
        <div className="flex-1 p-8 pt-6">
          {/*==================== Welcome Section ====================*/}
          <div className="relative mb-10 py-12 px-8 rounded-2xl overflow-hidden bg-slate-800/30 backdrop-blur-md">
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                <Brain className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-2">
                  Agentic Flow
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

          {/*==================== Stats Overview ====================*/}
          <div className="mb-10">
            <h2 className="text-2xl font-bold tracking-tight mb-6">
              System Overview
            </h2>
            <DashboardStats />
          </div>
          {/*==================== End of Stats Overview ====================*/}

          {/*==================== Core Systems ====================*/}
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-6">
              Core Systems
            </h2>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
              <SystemCards />
            </div>
          </div>
          {/*==================== End of Core Systems ====================*/}
        </div>
      </DashboardLayout>
    </>
  );
};

export default DashboardPage;
