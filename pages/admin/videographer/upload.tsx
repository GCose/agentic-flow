import DashboardLayout from "@/components/layouts/dashboard-layout";
import FileUpload from "@/components/upload/file-upload";
import { NextPage } from "next";
import Head from "next/head";
import VideographerHeader from "./videographer-header";
const UploadVideosPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Agentic Flow | Upload Videos</title>
        <meta name="description" content="Upload videos for Agentic Flow" />
      </Head>
      <DashboardLayout role="videographer">
        <VideographerHeader />
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Upload Videos</h2>
          </div>

          <FileUpload
            maxFiles={3}
            maxSize={104857600} // 100MB
            title="Upload Video Content"
            acceptedFileTypes={["video/*"]}
            description="Upload video files for content creation"
          />
        </div>
      </DashboardLayout>
    </>
  );
};

export default UploadVideosPage;
