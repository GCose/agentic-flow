import { NextPage } from "next";
import Head from "next/head";
import FileUpload from "@/components/upload/file-upload";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { AdminPageMeta } from "@/page-config/meta.config";

const UploadDesignsPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Agentic Flow | Upload Designs</title>
        <meta name="description" content="Upload designs for Agentic Flow" />
      </Head>
      <DashboardLayout
        role="designer"
        meta={AdminPageMeta.graphicsDesignerUploadPage}
      >
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">
              Upload Designs
            </h2>
          </div>

          <FileUpload
            title="Upload Design Assets"
            description="Upload images, graphics, and design files"
            acceptedFileTypes={[
              "image/*",
              "application/pdf",
              "application/postscript",
              "application/illustrator",
            ]}
            maxFiles={5}
            maxSize={52428800} // 50MB
          />
        </div>
      </DashboardLayout>
    </>
  );
};

export default UploadDesignsPage;
