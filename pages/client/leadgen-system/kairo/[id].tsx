import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import jsPDF from "jspdf";
import { FileText, Download } from "lucide-react";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClientPageMeta } from "@/page-meta/meta";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import LeadOverviewCard from "@/components/cards/lead-overview-card";
import { useLead } from "@/hooks/use-kairo";

const KairoLeadDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { lead, error } = useLead(id as string);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (lead || error) {
      setLoading(false);
    }
  }, [lead, error]);

  const handleDownload = (type: "report" | "strategy" | "pitch") => {
    if (!lead) return;

    setDownloading(true);

    // Only implement report download for now
    if (type !== "report") {
      setDownloading(false);
      return;
    }

    const formattedReport = formatReport(lead);
    if (!formattedReport || formattedReport.length === 0) {
      setDownloading(false);
      return;
    }

    const doc = new jsPDF();
    const title = `${lead.company_name} – Audit Report`;

    // Page settings
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;
    const lineHeight = 6;

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(title, margin, 20);

    let currentY = 35;

    formattedReport.forEach((section, index) => {
      if (currentY > pageHeight - 40) {
        doc.addPage();
        currentY = 20;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(`${index + 1}. ${section.title}`, margin, currentY);
      currentY += 10;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      const lines = doc.splitTextToSize(String(section.content), maxWidth);

      lines.forEach((line: string) => {
        if (currentY > pageHeight - 20) {
          doc.addPage();
          currentY = 20;
        }
        doc.text(line, margin, currentY);
        currentY += lineHeight;
      });

      currentY += 10;
    });

    const filename = `${lead.company_name}-Audit-${type}.pdf`.replace(
      /\s+/g,
      "-"
    );
    doc.save(filename);
    setDownloading(false);
  };

  interface ReportData {
    company_name: string;
    industry: string;
    created_at: string;
    insight?: {
      insights?: {
        summary?: string;
        handoff_message?: string;
        tags?: string[];
        insight_bullets?: string[];
        scores?: Record<string, number>;
      };
    };
    report?: {
      report_section?: {
        executive_summary?: string;
        key_insights?: string[];
        audit_tags?: string[];
        call_to_action?: string;
        painful_reality_of_revenue?: string;
        path_to_recovery_and_growth?: string;
      };
      deliverables?: {
        deliverables_list?: string[];
        pdf_report_url?: string;
        loom_video_url?: string;
      };
    };
    summary?: {
      writer_report?: {
        summary?: string;
        transition?: string;
        pain_points?: Record<string, string>;
      };
    };
  }

  const formatReport = (reportData: ReportData) => {
    const insight = reportData.insight?.insights;
    const report = reportData.report?.report_section;
    const summary = reportData.summary?.writer_report;

    const getValue = (
      value: string | number | null | undefined,
      fallback = "Not available"
    ) =>
      value !== null && value !== undefined && value !== "" ? value : fallback;

    const salesReport = [
      {
        title: "Company Name",
        content: getValue(reportData.company_name),
      },
      {
        title: "Industry",
        content: getValue(reportData.industry),
      },
      {
        title: "Created At",
        content: getValue(reportData.created_at),
      },
      {
        title: "Insight Summary",
        content: getValue(insight?.summary),
      },
      {
        title: "Insight Handoff Message",
        content: getValue(insight?.handoff_message),
      },
      {
        title: "Insight Tags",
        content: insight?.tags?.length
          ? insight.tags.join(", ")
          : "Not available",
      },
      {
        title: "Insight Bullets",
        content: insight?.insight_bullets?.join("\n\n") || "Not available",
      },
      {
        title: "Insight Scores",
        content: insight?.scores
          ? Object.entries(insight.scores)
              .map(([key, val]) => `${key}: ${val}%`)
              .join("\n")
          : "Not available",
      },
      {
        title: "Audit Executive Summary",
        content: getValue(report?.executive_summary),
      },
      {
        title: "Key Insights",
        content: report?.key_insights?.join("\n\n") || "Not available",
      },
      {
        title: "Audit Tags",
        content: report?.audit_tags?.join(", ") || "Not available",
      },
      {
        title: "Call to Action",
        content: getValue(report?.call_to_action),
      },
      {
        title: "Revenue Leak Estimate",
        content: getValue(report?.painful_reality_of_revenue),
      },
      {
        title: "Recovery Plan",
        content: getValue(report?.path_to_recovery_and_growth),
      },
      {
        title: "Deliverables",
        content:
          reportData.report?.deliverables?.deliverables_list?.join(", ") ||
          "Not available",
      },
      {
        title: "PDF Report URL",
        content: getValue(reportData.report?.deliverables?.pdf_report_url),
      },
      {
        title: "Loom Video URL",
        content: getValue(reportData.report?.deliverables?.loom_video_url),
      },
      {
        title: "Writer Summary",
        content: getValue(summary?.summary),
      },
      {
        title: "Writer Transition",
        content: getValue(summary?.transition),
      },
      {
        title: "Writer Pain Points",
        content: summary?.pain_points
          ? Object.entries(summary.pain_points)
              .map(([k, v]) => `${k}: ${v}`)
              .join("\n\n")
          : "Not available",
      },
    ];

    return salesReport;
  };

  const meta = lead
    ? {
        title: `Agentic Flow | ${lead.company_name} Lead Details`,
        description: `View detailed information about ${lead.company_name}`,
      }
    : ClientPageMeta.leadDetailPage;

  if (loading) {
    return (
      <DashboardLayout role="client" meta={meta}>
        <DashboardHeader
          hasBackButton={true}
          title="Loading Lead Details..."
          onBackClick={() => router.push("/client/leadgen-system/kairo")}
        />
        <div className="flex-1 p-8 flex items-center justify-center h-screen ">
          <p>Loading lead details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!lead) {
    return (
      <DashboardLayout role="client" meta={meta}>
        <DashboardHeader
          hasBackButton={true}
          title="Lead Not Found..."
          onBackClick={() => router.push("/client/leadgen-system/kairo")}
        />
        <div className="flex-1 p-8 flex flex-col items-center justify-center w-full">
          <h2 className="text-2xl font-bold mb-2">
            Unable to load lead details
          </h2>
          <p className="text-muted-foreground mb-4">
            The lead you are looking for does not exist or has been removed.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="client" meta={meta}>
      <DashboardHeader
        title={lead.company_name}
        hasBackButton={true}
        onBackClick={() => router.push("/client/leadgen-system/kairo")}
      />
      <div className="flex-1 p-6 md:p-8 pt-6 space-y-8 ">
        {/*==================== Lead Score & Company Overview ====================*/}
        <LeadOverviewCard lead={lead} />
        {/*==================== End of Lead Score & Company Overview ====================*/}

        {/*==================== Sales Report ====================*/}
        <Card className="border-none bg-transparent">
          <CardHeader className="flex flex-row items-center pb-3 relative">
            <div className="flex-1"></div>
            <div className="flex-1 text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                <FileText className="h-5 w-5 text-purple-400" />
                Kairo Audit Report
              </CardTitle>
              <CardDescription className="text-lg pt-2 text-slate-300">
                Here's the detailed audit report by Kairo.
              </CardDescription>
            </div>
            <div className="flex-1 flex justify-end">
              <Button
                variant="outline"
                disabled={downloading}
                onClick={() => handleDownload("report")}
                className="bg-slate-800/50 border-slate-700 "
              >
                {downloading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download Report
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {formatReport(lead).map((section, index) => (
                <div
                  key={index}
                  className="group hover:bg-blue-800/10 transition-colors duration-200 rounded-xl overflow-hidden bg-slate-900/30"
                >
                  <div className="bg-gradient-to-r from-purple-800/30 to-purple-900/20 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-white flex items-center gap-2">
                        <FileText className="h-4 w-4 text-purple-400" />
                        {section.title}
                      </h3>
                      <div className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded">
                        Section {index + 1}
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                      {section.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        {/*==================== End of Sales Report ====================*/}
      </div>
    </DashboardLayout>
  );
};

export default KairoLeadDetailsPage;
