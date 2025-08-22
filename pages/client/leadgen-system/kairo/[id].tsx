import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import jsPDF from "jspdf";
import { FileText, Download } from "lucide-react";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
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

  console.log("Lead Dataaa", lead);

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
        bullets?: string[];
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
        audit_scorecard?: string[];
        fixes_and_recommendations?: string[];
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

    const getValue = (
      value: string | number | null | undefined,
      fallback = "Not available"
    ) =>
      value !== null && value !== undefined && value !== "" ? value : fallback;
    const formatKey = (key: string) => {
      return key
        .split("_") // Split the snake case into words
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
        .join(" "); // Join the words with a space
    };

    const scorecard =
      Array.isArray(reportData?.report?.report_section?.audit_scorecard) &&
      typeof reportData.report.report_section.audit_scorecard[0] === "object"
        ? Object.entries(reportData.report.report_section.audit_scorecard[0])
            .map(([key, value]) => {
              const formattedKey = formatKey(key); // Format the key
              if (typeof value === "object" && value !== null) {
                // Assuming the object has `benchmark` and `score` properties
                const { benchmark, score } = value as {
                  benchmark: string;
                  score: string;
                };
                return `${formattedKey}: Benchmark - ${benchmark}, Score - ${score}`;
              }
              return `${formattedKey}: ${value}`;
            })
            .join("\n")
        : "Not available";

    // Helper to format nested objects/arrays for insights
    const formatNested = (obj: any, indent = 0): string => {
      if (Array.isArray(obj)) {
        return obj.map((item) => formatNested(item, indent)).join("\n");
      } else if (typeof obj === "object" && obj !== null) {
        return Object.entries(obj)
          .map(([key, value]) => {
            const pad = "  ".repeat(indent);
            if (typeof value === "object" && value !== null) {
              return `${pad}${formatKey(key)}:\n${formatNested(value, indent + 1)}`;
            }
            return `${pad}${formatKey(key)}: ${value}`;
          })
          .join("\n");
      }
      return String(obj);
    };

    return [
      {
        title: "1. Executive Summary",
        content:
          `${getValue(report?.executive_summary)}\n\n` +
          `**The Painful Reality of Lost Revenue:**\n${getValue(
            report?.painful_reality_of_revenue
          )}\n\n` +
          `**The Path to Recovery and Growth:**\n${getValue(
            report?.path_to_recovery_and_growth
          )}`,
      },
      {
        title: "2. Audit Scorecard",
        content: scorecard,
      },
      {
        title: "3. Insights",
        content:
          insight
            ? formatNested(insight)
            : "Not available",
      },
      
      {
        title: "4. Fixes & Recommendations",
        content:
          Array.isArray(report?.fixes_and_recommendations)
            ? report?.fixes_and_recommendations
                .map((fix, idx) => {
                  if (typeof fix === "object" && fix !== null) {
                    return (
                      `${idx + 1}.\n` +
                      Object.entries(fix)
                        .map(([key, value]) => {
                          if (Array.isArray(value)) {
                            return (
                              `${formatKey(key)}:\n` +
                              value.map((v, i) => `  - ${v}`).join("\n")
                            );
                          }
                          return `${formatKey(key)}: ${value}`;
                        })
                        .join("\n")
                    );
                  }
                  return `${idx + 1}. ${fix}`;
                })
                .join("\n\n")
            : "Not available",
      },
      {
        title: "5. Call to Action",
        content:
          report?.call_to_action ||
          "Schedule a call with us to implement these changes and grow your revenue.",
      },
    ];
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
        hasBackButton={true}
        title={lead.company_name}
        onBackClick={() => router.push("/client/leadgen-system/kairo")}
      />
      <div className="flex-1 p-6 md:p-8 pt-6 space-y-8 ">
        {/*==================== Lead Score & Company Overview ====================*/}
  <LeadOverviewCard lead={lead} />
        {/*==================== End of Lead Score & Company Overview ====================*/}

        {/*==================== Sales Report ====================*/}
        <div className="bg-gradient-to-r from-blue-800/5 to-blue-950/10 rounded-2xl border border-blue-900/30 overflow-hidden">
          {/*==================== Report Header ====================*/}
          <div className="bg-gradient-to-r from-blue-800/40 to-blue-900/40 px-4 sm:px-8 py-6 border-b border-blue-900/30">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-center sm:text-left">
                <h1 className="text-lg sm:text-xl font-bold text-white flex items-center justify-center sm:justify-start gap-3">
                  <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400" />
                  Kairo Audit Report
                </h1>
                <p className="text-slate-300 mt-1 text-sm sm:text-base">
                  Here is the detailed audit report by Kairo for
                  {lead.company_name}
                </p>
              </div>
              <Button
                variant="outline"
                disabled={downloading}
                onClick={() => handleDownload("report")}
                className="bg-transparent border-slate-600 hover:bg-slate-700/50 w-full sm:w-auto"
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
          </div>
          {/*==================== End of Report Header ====================*/}

          {/*==================== Report Content ====================*/}
          <div className="px-8 py-8">
            <div className="prose prose-invert max-w-none space-y-8">
              {formatReport(lead).map((section, index) => (
                <div
                  key={index}
                  className="border-b border-blue-900/30 pb-6 last:border-b-0 last:pb-0"
                >
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="text-purple-400 font-mono text-sm bg-purple-400/10 px-2 py-1 rounded-full">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {section.title}
                  </h2>
                  <div className="text-slate-300 leading-10 whitespace-pre-line pl-8">
                    {section.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/*==================== End of Report Content ====================*/}
        </div>
        {/*==================== End of Sales Report ====================*/}
      </div>
    </DashboardLayout>
  );
};

export default KairoLeadDetailsPage;
