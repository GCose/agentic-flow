import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import jsPDF from "jspdf";
import { FileText, Target, Download, Badge, Lightbulb } from "lucide-react";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import LeadOverviewCard from "@/components/cards/lead-overview-card";
import { ClientPageMeta } from "@/page-meta/meta";
import { useLead } from "@/hooks/use-airo";

const AiroLeadDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { lead } = useLead(id as string);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  const salesReport = [
    { title: "Summary", content: lead.lead_analysis.summary },
    { title: "Industry", content: lead.lead_analysis.industry },
    { title: "Company Size", content: lead.lead_analysis.company_size },
    { title: "Annual Revenue", content: lead.lead_analysis.annual_revenue },
    {
      title: "Lead Score",
      content: lead.lead_analysis.lead_score?.toString(),
    },
    { title: "Status", content: lead.lead_analysis.status },
    {
      title: "Pain Points & System Gaps",
      content: lead.lead_analysis.system_gap,
    },
  ];

  const salesStrategy = [
    {
      title: "CTA Decision",
      content: `${lead.sales_strategy.cta_decision.cta_tier}\nFunnel Path: ${lead.sales_strategy.cta_decision.funnel_path}\nUrgency: ${lead.sales_strategy.cta_decision.urgency_logic}`,
    },
    { title: "Handoff Message", content: lead.sales_strategy.handoff_message },
    { title: "Memory Log", content: lead.sales_strategy.memory_log },
    {
      title: "Narrative Breakdown",
      content: Object.entries(lead.sales_strategy.narrative_breakdown)
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n"),
    },
  ];

  const salesPitch =
    lead.sales_strategy.modular_pitch?.map(
      (item: { module_type: string; content: string }) => ({
        title: item.module_type,
        content: item.content,
      })
    ) || [];

  useEffect(() => {
    if (lead) {
      setLoading(false);
    }
  }, [lead]);

  const handleDownload = (type: string) => {
    if (!lead) return;
    setDownloading(type);

    const contentMap: Record<string, { title: string; content: string }[]> = {
      report: salesReport,
      strategy: salesStrategy,
      pitch: salesPitch,
    };

    const content = contentMap[type];
    if (!content) {
      setDownloading(null);
      return;
    }

    const doc = new jsPDF();
    const title = `${lead.company_name} – ${
      type.charAt(0).toUpperCase() + type.slice(1)
    }`;

    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;
    const lineHeight = 6;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(title, margin, 20);

    let currentY = 35;

    content.forEach((section, sectionIndex) => {
      if (currentY > pageHeight - 40) {
        doc.addPage();
        currentY = 20;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(`${sectionIndex + 1}. ${section.title}`, margin, currentY);
      currentY += 10;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);

      const contentLines = doc.splitTextToSize(section.content, maxWidth);
      contentLines.forEach((line: string) => {
        if (currentY > pageHeight - 20) {
          doc.addPage();
          currentY = 20;
        }

        doc.text(line, margin, currentY);
        currentY += lineHeight;
      });

      currentY += 10;
    });

    const filename = `${lead.company_name}-${type}.pdf`.replace(/\s+/g, "-");
    doc.save(filename);
    setDownloading(null);
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
          onBackClick={() => router.push("/client/sales-system/airo")}
        />
        <div className="flex-1 p-8 flex items-center justify-center h-screen">
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
        onBackClick={() => router.push("/client/sales-system/airo")}
      />

      <div className="flex-1 p-6 md:p-8 pt-6 space-y-8">
        {/*==================== Lead Score & Company Overview ====================*/}
        <LeadOverviewCard lead={lead} />
        {/*==================== End of Lead Score & Company Overview ====================*/}

        {/*==================== Tabs for detailed information ====================*/}
        <Tabs
          value={activeTab}
          className="space-y-6"
          onValueChange={setActiveTab}
        >
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-2xl grid-cols-3 bg-slate-800/30  p-1">
              <TabsTrigger value="report" className="rounded-md">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-purple-400" />
                  <span className="hidden sm:inline">Report</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="strategy" className="rounded-md">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-orange-400" />
                  <span className="hidden sm:inline">Strategy</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="pitch" className="rounded-md">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-green-400" />
                  <span className="hidden sm:inline">Pitch</span>
                </div>
              </TabsTrigger>
            </TabsList>
          </div>

          {/*==================== Sales Report Tab ====================*/}
          <TabsContent value="report">
            <Card className="border-blue-900/30 bg-transparent ">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5 text-purple-400" />
                    Sales Intelligence Report
                  </CardTitle>
                  <CardDescription>
                    Comprehensive analysis of {lead.company_name} for sales
                    preparation
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  disabled={downloading === "report"}
                  onClick={() => handleDownload("report")}
                  className="bg-slate-800/50 border-slate-700 "
                >
                  {downloading === "report" ? (
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
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salesReport.map((section, index) => (
                    <div
                      key={index}
                      className="group hover:bg-blue-800/10 transition-colors duration-200 rounded-xl overflow-hidden bg-slate-900/30 "
                    >
                      <div className="bg-gradient-to-r from-purple-800/30 to-purple-900/20 px-6 py-4 ">
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
          </TabsContent>
          {/*==================== End of Sales Report Tab ====================*/}

          {/*==================== Sales Strategy Tab ====================*/}

          <TabsContent value="strategy">
            <Card className="border-blue-900/30 bg-transparent ">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Target className="h-5 w-5 text-orange-400" />
                    Sales Strategy
                  </CardTitle>
                  <CardDescription>
                    Strategic approach to convert {lead.company_name} into a
                    client
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  disabled={downloading === "strategy"}
                  onClick={() => handleDownload("strategy")}
                  className="bg-slate-800/50 border-slate-700 "
                >
                  {downloading === "strategy" ? (
                    <>
                      <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Download Strategy
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salesStrategy.map((section, index) => (
                    <div
                      key={index}
                      className="group hover:bg-blue-800/10 transition-colors duration-200 rounded-xl overflow-hidden bg-slate-900/30 "
                    >
                      <div className="bg-gradient-to-r from-orange-500/50 to-orange-500/50 px-6 py-4 ">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-white flex items-center gap-2">
                            <Target className="h-4 w-4 text-orange-400" />
                            {section.title}
                          </h3>
                          <div className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded">
                            Step {index + 1}
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
          </TabsContent>
          {/*==================== End of Sales Strategy Tab ====================*/}

          {/*==================== Sales Pitch Tab ====================*/}

          <TabsContent value="pitch">
            <Card className="border-blue-900/30 bg-transparent ">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Lightbulb className="h-5 w-5 text-orange-400" />
                    Sales Pitch
                  </CardTitle>
                  <CardDescription>
                    Persuasive script for engaging with {lead.company_name}
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  onClick={() => handleDownload("pitch")}
                  disabled={downloading === "pitch"}
                  className="bg-slate-800/50 border-slate-700 "
                >
                  {downloading === "pitch" ? (
                    <>
                      <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Download Pitch
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salesPitch.map(
                    (
                      section: { title: string; content: string },
                      index: number
                    ) => (
                      <div
                        key={index}
                        className="group hover:bg-blue-800/10 transition-colors duration-200 rounded-xl overflow-hidden bg-slate-900/30 "
                      >
                        <div className="bg-gradient-to-r from-green-500/30 to-green-700/20 px-6 py-4 ">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-white flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                              {section.title}
                            </h3>
                            <div className="flex items-center gap-2">
                              {index === 0 && (
                                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                                  Start Here
                                </Badge>
                              )}
                              <div className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded">
                                Step {index + 1}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                            {section.content}
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          {/*==================== End of Sales Pitch Tab ====================*/}
        </Tabs>
        {/*==================== End of Tabs for detailed information ====================*/}
      </div>
    </DashboardLayout>
  );
};

export default AiroLeadDetailsPage;
