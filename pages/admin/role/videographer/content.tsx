import ContentLibrary from "@/components/content/content-library";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { NextPage } from "next";
import Head from "next/head";
import VideographerHeader from "./videographer-header";

const ContentLibraryPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Agentic Flow | Content Library</title>
        <meta name="description" content="View content tasks and AI research" />
      </Head>
      <DashboardLayout role="videographer">
        <VideographerHeader />
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">
              Content Library
            </h2>
          </div>

          <ContentLibrary userRole="videographer" />
        </div>
      </DashboardLayout>
    </>
  );
};

export default ContentLibraryPage;
