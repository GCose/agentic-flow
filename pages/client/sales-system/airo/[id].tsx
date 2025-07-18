import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import jsPDF from "jspdf";
import {
  Building,
  FileText,
  MessageCircle,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Target,
  Download,
  Phone,
  Users,
  DollarSign,
} from "lucide-react";
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
import LeadOverviewCard from "@/components/cards/lead-overview.card";
import { AdminPageMeta } from "@/page-meta/meta";

interface ReportSection {
  title: string;
  content: string;
}

interface LeadData {
  id: string;
  company: string;
  leadScore: number;
  strategy: string;
  salePitch: string;
  leadEntry: string;
  createdAt: string;
  industry: string;
  salesCall: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  size: string;
  revenue: string;
  description: string;
  notes: string[];
  salesReport: ReportSection[];
  salesStrategy: ReportSection[];
  salesPitch: ReportSection[];
}

const reportSections = [
  {
    title: "Executive Summary",
    content:
      "This sales intelligence report provides a comprehensive analysis of Acme Inc., a leading technology company in the cloud-based enterprise solutions space. The company shows strong interest in our automation solutions and has budget approval expected by the end of the quarter. They are currently evaluating competitive offerings but our unique value proposition positions us favorably in the selection process.",
  },
  {
    title: "Company Profile",
    content:
      "Acme Inc. is an established technology provider with a strong market presence in cloud infrastructure and enterprise SaaS solutions. Founded in 2005, they have grown to 250-500 employees with estimated annual revenue between $50M-$100M. Their primary market segments include finance, healthcare, and manufacturing with a focus on mid to large enterprises.",
  },
  {
    title: "Pain Points & Challenges",
    content:
      "Through our analysis, we've identified several key challenges Acme Inc. is facing:\n\n1. Operational inefficiency in their customer support workflow\n2. High cost of manual data processing across departments\n3. Integration issues between their legacy systems and newer cloud applications\n4. Employee productivity bottlenecks in their approval processes\n5. Compliance reporting requirements creating significant overhead",
  },
  {
    title: "Budget & Timeline",
    content:
      "Based on our intelligence gathering, Acme Inc. has allocated a budget range of $100K-$150K for this initiative. They expect to make a final vendor selection within the next 4-6 weeks and aim for full implementation by the end of Q3. Budget approval is expected at their next executive meeting scheduled for the end of the current quarter.",
  },
  {
    title: "Risk Assessment",
    content:
      "Key risks to closing this opportunity include:\n\n- Budget constraints (Medium risk): While budget exists, there may be pressure to reduce scope\n- Technical concerns (Low risk): Some stakeholders have expressed concerns about integration complexity\n- Competitive pressure (Medium risk): CompetitorY has an existing relationship with their CFO\n- Implementation timeline (High risk): Their desired implementation window is aggressive",
  },
  {
    title: "Recommended Actions",
    content:
      "Based on our analysis, we recommend the following actions:\n\n1. Prepare a detailed technical integration plan addressing their specific pain points\n2. Develop a phased implementation approach to show quick wins\n3. Create a custom ROI calculator highlighting cost savings vs. competitors\n4. Schedule a technical deep-dive with their IT team focusing on API capabilities\n5. Prepare references from similar clients in their industry",
  },
];

const leadDetails: Record<string, LeadData> = {
  "wl-1": {
    id: "wl-1",
    company: "Acme Inc.",
    leadScore: 87,
    strategy: "Direct outreach",
    salePitch: "ROI-focused solution",
    leadEntry: "2025-04-20",
    createdAt: "2025-04-15",
    industry: "Technology",
    salesCall: "Scheduled for next week",
    email: "contact@acmeinc.com",
    phone: "+1 (555) 123-4567",
    website: "https://www.acmeinc.com",
    address: "123 Corporate Drive, Business Park, CA 94123",
    size: "250-500 employees",
    revenue: "$50M - $100M",
    description:
      "Acme Inc. is a leading technology company specializing in cloud-based solutions for enterprise clients. They are currently looking to optimize their operational efficiency and reduce costs through automation solutions.",
    notes: [
      "Initial contact made through LinkedIn outreach campaign",
      "CEO showed strong interest in our automation solution during preliminary discussion",
      "Budget approval expected by end of quarter based on executive feedback",
      "Currently evaluating competitors, but our solution has unique technical advantages",
      "Implementation timeline aligns with their Q3 operational goals",
    ],
    salesReport: reportSections,
    salesStrategy: [],
    salesPitch: [],
  },
};

const AiroLeadDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [lead, setLead] = useState<LeadData | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    if (id && typeof id === "string") {
      setLoading(true);

      // Simulate API fetch
      setTimeout(() => {
        const leadData = leadDetails[id as keyof typeof leadDetails];
        if (leadData) {
          setLead(leadData);
        }
        setLoading(false);
      }, 500);
    }
  }, [id]);

  const handleDownload = (type: string) => {
    if (!lead) return;
    setDownloading(type);

    const contentMap: Record<string, typeof lead.salesReport> = {
      report: lead.salesReport,
    };

    const content = contentMap[type];
    if (!content) {
      setDownloading(null);
      return;
    }

    const doc = new jsPDF();
    const title = `${lead.company} – ${
      type.charAt(0).toUpperCase() + type.slice(1)
    }`;

    // Set up page margins and dimensions
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

    content.forEach((section, sectionIndex) => {
      // Check if we need a new page for the section header
      if (currentY > pageHeight - 40) {
        doc.addPage();
        currentY = 20;
      }

      // Section title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(`${sectionIndex + 1}. ${section.title}`, margin, currentY);
      currentY += 10;

      // Section content
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);

      // Split content into lines that fit the page width
      const contentLines = doc.splitTextToSize(section.content, maxWidth);

      // Process each line and handle page breaks
      contentLines.forEach((line: string) => {
        // Check if we need a new page
        if (currentY > pageHeight - 20) {
          doc.addPage();
          currentY = 20;
        }

        doc.text(line, margin, currentY);
        currentY += lineHeight;
      });

      // Add spacing between sections
      currentY += 10;
    });

    const filename = `${lead.company}-${type}.pdf`.replace(/\s+/g, "-");
    doc.save(filename);
    setDownloading(null);
  };

  const meta = lead
    ? {
        title: `Agentic Flow | ${lead.company} Lead Details`,
        description: `View detailed information about ${lead.company}`,
      }
    : AdminPageMeta.leadDetailPage;

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
        title={lead.company}
        hasBackButton={true}
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
            <TabsList className="grid w-full max-w-2xl grid-cols-2 bg-slate-800/30 p-1">
              <TabsTrigger value="overview" className="rounded-md">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-blue-400" />
                  <span className="hidden sm:inline">Overview</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="report" className="rounded-md">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-purple-400" />
                  <span className="hidden sm:inline">Report</span>
                </div>
              </TabsTrigger>
            </TabsList>
          </div>

          {/*==================== Overview Tab ====================*/}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/*==================== Business Intelligence ====================*/}
              <Card className="border-blue-900/30 bg-transparent">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Target className="h-5 w-5 text-blue-400" />
                    Business Intelligence
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        <span className="text-sm font-medium text-emerald-400">
                          Decision Timeline
                        </span>
                      </div>
                      <p className="text-sm">
                        Budget approval expected by end of quarter. Active
                        evaluation phase with 4-6 week decision window.
                      </p>
                    </div>

                    <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-4 w-4 text-blue-400" />
                        <span className="text-sm font-medium text-blue-400">
                          Budget Range
                        </span>
                      </div>
                      <p className="text-sm">
                        $100K-$150K allocated for automation solutions. Strong
                        ROI requirements with 6-month payback expectation.
                      </p>
                    </div>

                    <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="h-4 w-4 text-amber-400" />
                        <span className="text-sm font-medium text-amber-400">
                          Competitive Landscape
                        </span>
                      </div>
                      <p className="text-sm">
                        Evaluating 3 vendors. Our integration capabilities
                        provide key differentiation advantage.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/*==================== End of Business Intelligence ====================*/}

              {/*==================== Sales Activities & Next Steps ====================*/}
              <Card className="border-blue-900/30 bg-transparent">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5 text-purple-400" />
                    Sales Activities & Next Steps
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
                      <div className="bg-slate-700/50 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0">
                        <Phone className="h-4 w-4 text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-blue-400">
                          Technical Demo Scheduled
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Next Tuesday - Integration capabilities showcase
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
                      <div className="bg-slate-700/50 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0">
                        <FileText className="h-4 w-4 text-purple-400" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-purple-400">
                          ROI Analysis Prepared
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Custom calculations ready for executive presentation
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
                      <div className="bg-slate-700/50 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0">
                        <Users className="h-4 w-4 text-purple-400" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-purple-400">
                          Stakeholder Mapping
                        </p>
                        <p className="text-xs text-muted-foreground">
                          CTO and Procurement Manager identified as key decision
                          makers
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/*==================== End of Sales Activities & Next Steps ====================*/}
            </div>

            {/*==================== Lead Notes ====================*/}
            <Card className="border-blue-900/30 bg-transparent">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MessageCircle className="h-5 w-5 text-orange-400" />
                  Lead Notes & Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                  <ul className="space-y-3">
                    {lead.notes?.map((note, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="rounded-full h-2 w-2 bg-blue-400 mt-2 flex-shrink-0"></div>
                        <span className="text-sm leading-relaxed">{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
            {/*==================== End of Lead Notes ====================*/}
          </TabsContent>
          {/*==================== End of Overview Tab ====================*/}

          {/*==================== Sales Report Tab ====================*/}
          <TabsContent value="report">
            <Card className="border-blue-900/30 bg-transparent">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5 text-purple-400" />
                    Sales Intelligence Report
                  </CardTitle>
                  <CardDescription>
                    Comprehensive analysis of {lead.company} for sales
                    preparation
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  disabled={downloading === "report"}
                  onClick={() => handleDownload("report")}
                  className="bg-slate-800/50 border-slate-700"
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
                  {lead.salesReport?.map((section, index) => (
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
          </TabsContent>
          {/*==================== End of Sales Report Tab ====================*/}
        </Tabs>
        {/*==================== End of Tabs for detailed information ====================*/}
      </div>
    </DashboardLayout>
  );
};

export default AiroLeadDetailsPage;
