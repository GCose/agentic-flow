import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import jsPDF from "jspdf";
import Head from "next/head";
import {
  ArrowLeft,
  Building,
  FileText,
  MessageCircle,
  Clock,
  Download,
  Lightbulb,
  Target,
  ExternalLink,
  X,
  Mail,
  Phone,
  Globe,
  MapPin,
  Briefcase,
  Users,
  DollarSign,
  Calendar,
  User,
  CheckCircle2,
  AlertCircle,
  Bookmark,
} from "lucide-react";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { WarmLead } from "@/types/leads";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

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
    title: "Decision Makers",
    content:
      "We've identified two key stakeholders in the buying process:\n\n- Jane Cooper (CTO): Technical decision maker with final sign-off authority. Strong advocate for automation and efficiency improvements.\n- Robert Garcia (Procurement Manager): Manages vendor selection process and budget allocation. Primary focus on ROI and implementation timeline.",
  },
  {
    title: "Competitive Analysis",
    content:
      "Acme Inc. is currently evaluating two competitor solutions alongside our offering:\n\n- CompetitorX: Lower cost but limited integration capabilities\n- CompetitorY: More established but significantly higher TCO and longer implementation timeline\n\nOur competitive advantages include superior API flexibility, faster implementation, and our unique approach to workflow automation.",
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

// Strategy sections based on the report
const strategySections = [
  {
    title: "Value Proposition Alignment",
    content:
      "Our solution directly addresses Acme Inc.'s five identified pain points with our workflow automation platform. We should emphasize our unique integration capabilities with legacy systems, which is a key differentiator against CompetitorX and CompetitorY. Position our offering as the optimal balance of implementation speed, cost-effectiveness, and technical sophistication.",
  },
  {
    title: "Stakeholder Approach",
    content:
      "For Jane Cooper (CTO):\n- Focus on technical advantages and API flexibility\n- Demonstrate our integration capabilities with their existing tech stack\n- Emphasize our solution's scalability for future needs\n\nFor Robert Garcia (Procurement):\n- Highlight our competitive TCO compared to alternatives\n- Present clear ROI calculations and payback period\n- Detail our implementation timeline advantages\n\nIdentify and engage additional stakeholders in IT and Operations to build broader internal support.",
  },
  {
    title: "Competitive Positioning",
    content:
      "Against CompetitorX:\n- Acknowledge their lower price point but emphasize our superior integration capabilities\n- Demonstrate the hidden costs of their limited feature set\n\nAgainst CompetitorY:\n- Position us as the more agile, innovative alternative\n- Highlight our faster implementation timeline (crucial to their Q3 deadline)\n- Emphasize our modern architecture vs. their legacy approach",
  },
  {
    title: "Risk Mitigation Plan",
    content:
      "1. Budget concerns: Prepare a phased implementation option that fits within their current budget constraints while allowing for expansion\n\n2. Technical concerns: Offer a proof-of-concept demonstration with their actual data to validate integration feasibility\n\n3. Competitive relationships: Provide case studies of clients who switched from CompetitorY to our solution\n\n4. Timeline pressure: Develop an accelerated implementation plan with dedicated resources",
  },
  {
    title: "Sales Process",
    content:
      "1. Technical Deep-Dive (Week 1): Schedule a technical workshop focusing on API integration capabilities\n\n2. Executive Presentation (Week 2): Present ROI analysis and competitive advantages to decision-makers\n\n3. Proposal Submission (Week 3): Deliver customized proposal with phased implementation options\n\n4. Proof-of-Concept Demo (Week 4): Demonstrate integration with their systems using sample data\n\n5. Contract Negotiation (Week 5-6): Prepare for procurement discussions and contract terms",
  },
];

// Pitch elements derived from the strategy
const pitchSections = [
  {
    title: "Opening",
    content:
      "Based on our understanding of Acme Inc.'s challenges with operational efficiency and system integration, I believe our workflow automation platform offers precisely the solution you're looking for. We specialize in helping companies like yours reduce manual processes while seamlessly connecting legacy systems with modern cloud applications.",
  },
  {
    title: "Problem Validation",
    content:
      "We recognize that your team is dealing with several key challenges:\n\n• Your customer support workflow has manual bottlenecks causing delays\n• Data processing across departments is costly and error-prone\n• Your legacy systems don't integrate well with newer cloud applications\n• Approval processes are reducing employee productivity\n• Compliance reporting creates significant overhead\n\nAre these challenges aligned with what you're experiencing?",
  },
  {
    title: "Solution Presentation",
    content:
      "Our platform addresses these challenges through:\n\n1. Automated workflow orchestration that eliminates manual handoffs\n2. Intelligent data processing that reduces errors by 87%\n3. Pre-built connectors for legacy and cloud systems\n4. No-code approval flows that reduce bottlenecks\n5. Automated compliance reporting dashboards\n\nUnlike alternatives, our solution combines enterprise-grade security with rapid implementation and superior integration capabilities.",
  },
  {
    title: "Differentiation",
    content:
      "What sets us apart from CompetitorX and CompetitorY:\n\n• Implementation in 6-8 weeks vs. industry average of 4-6 months\n• 40% lower total cost of ownership compared to CompetitorY\n• Flexible API architecture that connects with any system\n• No-code configuration that reduces IT dependency\n• Phased approach allowing for quick wins while building toward complete solution",
  },
  {
    title: "Evidence & Proof",
    content:
      "Companies similar to Acme Inc. have achieved remarkable results:\n\n• FinTech Leader reduced processing time by 72% within 3 months\n• Healthcare Provider achieved $1.2M annual savings from automation\n• Manufacturing company improved compliance reporting time by 85%\n\nAll with implementation timelines that meet or exceed your Q3 deadline requirement.",
  },
  {
    title: "Call to Action",
    content:
      "I recommend we schedule a technical deep-dive session with your IT team to demonstrate our integration capabilities with your specific systems. Following that, we can present a customized ROI analysis to your executive team.\n\nWould next Tuesday work for an initial technical workshop with your team?",
  },
];

const leadDetails: Record<
  string,
  WarmLead & {
    report?: string;
    email?: string;
    phone?: string;
    website?: string;
    address?: string;
    industry?: string;
    size?: string;
    revenue?: string;
    description?: string;
    notes?: string[];
    activities?: Array<{
      type: string;
      date: string;
      description: string;
      user: string;
    }>;
    contacts?: Array<{
      name: string;
      position: string;
      email: string;
      phone?: string;
    }>;
    documents?: Array<{
      name: string;
      type: string;
      date: string;
      size: string;
    }>;
    timeline?: Array<{
      date: string;
      status: string;
      description: string;
    }>;
    salesReport?: typeof reportSections;
    salesStrategy?: typeof strategySections;
    salesPitch?: typeof pitchSections;
  }
> = {
  "wl-1": {
    id: "wl-1",
    company: "Acme Inc.",
    leadScore: 87,
    strategy: "Direct outreach",
    salePitch: "ROI-focused solution",
    status: "qualified",
    lastContact: "2025-04-20",
    assignedTo: "John Smith",
    createdAt: "2025-04-15",
    report: "Q1 Sales Report - 95% Conversion Rate",
    email: "contact@acmeinc.com",
    phone: "+1 (555) 123-4567",
    website: "https://www.acmeinc.com",
    address: "123 Corporate Drive, Business Park, CA 94123",
    industry: "Technology",
    size: "250-500 employees",
    revenue: "$50M - $100M",
    description:
      "Acme Inc. is a leading technology company specializing in cloud-based solutions for enterprise clients. They are currently looking to optimize their operational efficiency and reduce costs.",
    notes: [
      "Initial contact made through LinkedIn",
      "CEO showed strong interest in our automation solution",
      "Budget approval expected by end of quarter",
      "Considering competitors, but our solution has unique advantages",
    ],
    activities: [
      {
        type: "Email",
        date: "2025-04-18",
        description: "Sent follow-up with case studies",
        user: "John Smith",
      },
      {
        type: "Call",
        date: "2025-04-15",
        description: "Initial discovery call with CTO",
        user: "Sarah Johnson",
      },
      {
        type: "Meeting",
        date: "2025-04-10",
        description: "Demo presentation to the executive team",
        user: "John Smith",
      },
    ],
    contacts: [
      {
        name: "Jane Cooper",
        position: "CTO",
        email: "jane.cooper@acmeinc.com",
        phone: "+1 (555) 987-6543",
      },
      {
        name: "Robert Garcia",
        position: "Procurement Manager",
        email: "robert.garcia@acmeinc.com",
      },
    ],
    documents: [
      {
        name: "Acme Inc Proposal",
        type: "PDF",
        date: "2025-04-19",
        size: "2.4 MB",
      },
      {
        name: "Technical Requirements",
        type: "DOCX",
        date: "2025-04-16",
        size: "1.8 MB",
      },
    ],
    timeline: [
      {
        date: "2025-04-20",
        status: "qualified",
        description: "Lead qualified after technical assessment",
      },
      {
        date: "2025-04-15",
        status: "contacted",
        description: "Initial discovery call completed",
      },
      {
        date: "2025-04-08",
        status: "new",
        description: "Lead created from marketing campaign",
      },
    ],
    salesReport: reportSections,
    salesStrategy: strategySections,
    salesPitch: pitchSections,
  },
  // Other lead details remain the same
  "wl-2": {
    id: "wl-2",
    company: "TechCorp",
    leadScore: 92,
    strategy: "Demo + Case study",
    salePitch: "Cost reduction focus",
    status: "contacted",
    lastContact: "2025-04-22",
    assignedTo: "Sarah Johnson",
    createdAt: "2025-04-16",
    report: "Q1 Sales Report - 87% Conversion Rate",
    email: "info@techcorp.com",
    phone: "+1 (555) 222-3333",
    website: "https://www.techcorp.com",
    address: "456 Innovation Blvd, Tech City, NY 10001",
    industry: "Software Development",
    size: "100-250 employees",
    revenue: "$25M - $50M",
    description:
      "TechCorp specializes in developing software solutions for the healthcare industry. They are expanding their product line and looking for efficiency improvements in their development process.",
    notes: [
      "Referred by existing client MediTech",
      "Looking for implementation before Q3",
      "Budget constraints, but high interest in ROI",
    ],
    activities: [
      {
        type: "Email",
        date: "2025-04-22",
        description: "Sent pricing proposal",
        user: "Sarah Johnson",
      },
      {
        type: "Call",
        date: "2025-04-19",
        description: "Product demonstration call",
        user: "Sarah Johnson",
      },
    ],
    contacts: [
      {
        name: "Alex Morgan",
        position: "CIO",
        email: "alex.morgan@techcorp.com",
        phone: "+1 (555) 444-5555",
      },
    ],
    documents: [
      {
        name: "TechCorp Cost Analysis",
        type: "PDF",
        date: "2025-04-22",
        size: "1.7 MB",
      },
    ],
    timeline: [
      {
        date: "2025-04-22",
        status: "contacted",
        description: "Pricing proposal sent",
      },
      {
        date: "2025-04-16",
        status: "new",
        description: "Lead added from referral program",
      },
    ],
  },
  "wl-3": {
    id: "wl-3",
    company: "Global Services",
    leadScore: 76,
    strategy: "Consultative approach",
    salePitch: "Efficiency improvement",
    status: "new",
    lastContact: "2025-04-19",
    assignedTo: "Michael Brown",
    createdAt: "2025-04-14",
    report: "Monthly Sales Report - 72% Conversion Rate",
    email: "inquiries@globalservices.com",
    phone: "+1 (555) 789-0123",
    website: "https://www.globalservices.com",
    industry: "Consulting",
    size: "50-100 employees",
    revenue: "$10M - $25M",
    description:
      "Global Services provides consulting services to international businesses. They're looking to improve their internal processes and client management systems.",
    notes: [
      "Found us through a LinkedIn post",
      "Currently using a competitor's solution",
      "Dissatisfied with current provider's support",
    ],
    timeline: [
      {
        date: "2025-04-19",
        status: "new",
        description: "Initial information sent",
      },
      {
        date: "2025-04-14",
        status: "new",
        description: "Lead created from LinkedIn campaign",
      },
    ],
  },
};

// Helper function to get initials from name
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

// Helper function to get activity icon
const getActivityIcon = (type: string) => {
  switch (type) {
    case "Email":
      return <Mail className="h-4 w-4" />;
    case "Call":
      return <Phone className="h-4 w-4" />;
    case "Meeting":
      return <Users className="h-4 w-4" />;
    default:
      return <MessageCircle className="h-4 w-4" />;
  }
};

// Helper function to get document icon
const getDocumentIcon = (type: string) => {
  switch (type) {
    case "PDF":
      return <FileText className="h-4 w-4" />;
    case "DOCX":
      return <FileText className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

const LeadDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [lead, setLead] = useState<(typeof leadDetails)[string] | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    if (id && typeof id === "string") {
      setLoading(true);

      // Simulate API fetch
      setTimeout(() => {
        const leadData = leadDetails[id];
        if (leadData) {
          setLead(leadData);
        }
        setLoading(false);
      }, 500);
    }
  }, [id]);

  const handleBack = () => {
    router.push("/admin/leadgen-system/warm");
  };

  const handleDownload = (type: string) => {
    if (!lead) return;
    setDownloading(type);

    const contentMap = {
      report: lead.salesReport,
      strategy: lead.salesStrategy,
      pitch: lead.salesPitch,
    };

    const content = contentMap[type as keyof typeof contentMap];
    if (!content) {
      setDownloading(null);
      return;
    }

    const doc = new jsPDF();
    const title = `${lead.company} – ${
      type.charAt(0).toUpperCase() + type.slice(1)
    }`;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(title, 20, 20);

    doc.setFontSize(12);
    let y = 30;

    content.forEach((section) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      doc.setFont("helvetica", "bold");
      doc.text(section.title, 20, y);
      y += 7;

      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(section.content, 170); // wrap text
      doc.text(lines, 20, y);
      y += lines.length * 6 + 10;
    });

    const filename = `${lead.company}-${type}.pdf`.replace(/\s+/g, "-");
    doc.save(filename);
    setDownloading(null);
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return {
          className: "bg-blue-500/10 text-blue-500 border-blue-500/20",
          icon: <Bookmark className="h-3.5 w-3.5 mr-1" />,
          label: "New Lead",
        };
      case "contacted":
        return {
          className: "bg-amber-500/10 text-amber-500 border-amber-500/20",
          icon: <MessageCircle className="h-3.5 w-3.5 mr-1" />,
          label: "Contacted",
        };
      case "qualified":
        return {
          className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
          icon: <CheckCircle2 className="h-3.5 w-3.5 mr-1" />,
          label: "Qualified",
        };
      case "converted":
        return {
          className: "bg-violet-500/10 text-violet-500 border-violet-500/20",
          icon: <CheckCircle2 className="h-3.5 w-3.5 mr-1" />,
          label: "Converted",
        };
      case "lost":
        return {
          className: "bg-rose-500/10 text-rose-500 border-rose-500/20",
          icon: <AlertCircle className="h-3.5 w-3.5 mr-1" />,
          label: "Lost",
        };
      default:
        return {
          className: "bg-slate-500/10 text-slate-500 border-slate-500/20",
          icon: <Bookmark className="h-3.5 w-3.5 mr-1" />,
          label: status.charAt(0).toUpperCase() + status.slice(1),
        };
    }
  };

  // Get lead score color
  const getLeadScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-amber-500";
    return "text-rose-500";
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
            <p className="text-muted-foreground">Loading lead details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!lead) {
    return (
      <DashboardLayout>
        <div className="flex-1 p-8 flex flex-col items-center justify-center">
          <div className="bg-transparent p-8 rounded-xl border border-slate-800 text-center max-w-md">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-rose-500" />
            <h2 className="text-2xl font-bold mb-2">Lead Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The lead you are looking for does not exist or has been removed.
            </p>
            <Button onClick={handleBack} size="lg">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Leads
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const statusBadge = getStatusBadge(lead.status);

  return (
    <>
      <Head>
        <title>Agentic Flow | {lead.company} Lead Details</title>
        <meta
          name="description"
          content={`Detailed information about ${lead.company}`}
        />
      </Head>
      <DashboardLayout>
        {/* Header with company name and status */}
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 sm:px-6">
          <SidebarTrigger />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3 flex-1">
            <div className="bg-slate-800/50 h-10 w-10 rounded-full flex items-center justify-center">
              <Building className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold leading-none">
                {lead.company}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {lead.industry}
              </p>
            </div>
          </div>
          <Badge
            variant="outline"
            className={cn(
              "flex items-center px-3 py-1.5 rounded-full",
              statusBadge.className
            )}
          >
            {statusBadge.icon}
            {statusBadge.label}
          </Badge>
        </header>

        <div className="flex-1 p-6 md:p-8 pt-6 space-y-8">
          {/* Lead Summary Card */}
          <div className="bg-gradient-to-r from-slate-900/40 to-slate-800/20 rounded-xl border border-slate-800/50 overflow-hidden">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Company Description */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-medium mb-2">
                    About {lead.company}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {lead.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mt-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-800/50 h-8 w-8 rounded-md flex items-center justify-center flex-shrink-0">
                        <Mail className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="text-sm">{lead.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="bg-slate-800/50 h-8 w-8 rounded-md flex items-center justify-center flex-shrink-0">
                        <Phone className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="text-sm">{lead.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="bg-slate-800/50 h-8 w-8 rounded-md flex items-center justify-center flex-shrink-0">
                        <Globe className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Website</p>
                        <a
                          href={lead.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm flex items-center hover:text-primary"
                        >
                          {lead.website?.replace(/(^\w+:|^)\/\//, "")}
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="bg-slate-800/50 h-8 w-8 rounded-md flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Address</p>
                        <p className="text-sm">{lead.address}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lead Score and Stats */}
                <div className="bg-slate-900/40 rounded-xl p-5 border border-slate-800/50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Lead Score</h3>
                    <div
                      className={cn(
                        "text-2xl font-bold",
                        getLeadScoreColor(lead.leadScore)
                      )}
                    >
                      {lead.leadScore}
                    </div>
                  </div>

                  <Progress
                    value={lead.leadScore}
                    className="h-2 mb-6"
                    indicatorClassName={cn(
                      lead.leadScore >= 80
                        ? "bg-emerald-500"
                        : lead.leadScore >= 60
                        ? "bg-amber-500"
                        : "bg-rose-500"
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          Created
                        </span>
                      </div>
                      <p className="text-sm font-medium">{lead.createdAt}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          Last Contact
                        </span>
                      </div>
                      <p className="text-sm font-medium">{lead.lastContact}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          Assigned To
                        </span>
                      </div>
                      <p className="text-sm font-medium">{lead.assignedTo}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          Industry
                        </span>
                      </div>
                      <p className="text-sm font-medium">{lead.industry}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 border-t border-slate-800/50">
              <div className="p-4 text-center border-r border-slate-800/50">
                <p className="text-xs text-muted-foreground mb-1">
                  Company Size
                </p>
                <div className="flex items-center justify-center gap-1.5">
                  <Users className="h-4 w-4 text-primary" />
                  <p className="font-medium">{lead.size}</p>
                </div>
              </div>

              <div className="p-4 text-center border-r border-slate-800/50">
                <p className="text-xs text-muted-foreground mb-1">
                  Annual Revenue
                </p>
                <div className="flex items-center justify-center gap-1.5">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <p className="font-medium">{lead.revenue}</p>
                </div>
              </div>

              <div className="p-4 text-center border-r border-slate-800/50">
                <p className="text-xs text-muted-foreground mb-1">Strategy</p>
                <div className="flex items-center justify-center gap-1.5">
                  <Target className="h-4 w-4 text-primary" />
                  <p className="font-medium">{lead.strategy}</p>
                </div>
              </div>

              <div className="p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Sale Pitch</p>
                <div className="flex items-center justify-center gap-1.5">
                  <Lightbulb className="h-4 w-4 text-primary" />
                  <p className="font-medium">{lead.salePitch}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs for detailed information */}
          <Tabs
            value={activeTab}
            className="space-y-6"
            onValueChange={setActiveTab}
          >
            <div className="flex justify-center">
              <TabsList className="grid w-full max-w-2xl grid-cols-4 bg-slate-800/30 p-1">
                <TabsTrigger value="overview" className="rounded-md">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    <span className="hidden sm:inline">Overview</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="report" className="rounded-md">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="hidden sm:inline">Sales Report</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="strategy" className="rounded-md">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    <span className="hidden sm:inline">Strategy</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="pitch" className="rounded-md">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    <span className="hidden sm:inline">Pitch</span>
                  </div>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Key Contacts */}
                <Card className="md:col-span-1 border-slate-800/50 bg-transparent">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Users className="h-5 w-5 text-primary" />
                      Key Contacts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {lead.contacts && lead.contacts.length > 0 ? (
                      lead.contacts.map((contact, index) => (
                        <div
                          key={index}
                          className={cn(
                            "flex items-start gap-3 p-3 rounded-lg",
                            index % 2 === 0
                              ? "bg-slate-800/20"
                              : "bg-transparent"
                          )}
                        >
                          <Avatar className="h-10 w-10 border border-slate-700">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {getInitials(contact.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{contact.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {contact.position}
                            </p>
                            <div className="flex items-center gap-3 mt-1.5">
                              <a
                                href={`mailto:${contact.email}`}
                                className="text-xs flex items-center text-primary hover:underline"
                              >
                                <Mail className="h-3 w-3 mr-1" />
                                {contact.email}
                              </a>
                              {contact.phone && (
                                <a
                                  href={`tel:${contact.phone}`}
                                  className="text-xs flex items-center text-primary hover:underline"
                                >
                                  <Phone className="h-3 w-3 mr-1" />
                                  {contact.phone}
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No contacts available</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Notes & Activities */}
                <Card className="md:col-span-2 border-slate-800/50 bg-transparent">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <MessageCircle className="h-5 w-5 text-primary" />
                      Notes & Activities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Notes */}
                      {lead.notes && lead.notes.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-sm font-medium text-muted-foreground">
                            Notes
                          </h4>
                          <div className="bg-slate-800/20 rounded-lg p-4 border border-slate-800/50">
                            <ul className="space-y-2">
                              {lead.notes.map((note, index) => (
                                <li
                                  key={index}
                                  className="flex items-start gap-2"
                                >
                                  <div className="rounded-full h-1.5 w-1.5 bg-primary mt-2 flex-shrink-0"></div>
                                  <span className="text-sm">{note}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* Activities */}
                      {lead.activities && lead.activities.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-sm font-medium text-muted-foreground">
                            Recent Activities
                          </h4>
                          <div className="space-y-3">
                            {lead.activities.map((activity, index) => (
                              <div
                                key={index}
                                className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/20 border border-slate-800/50"
                              >
                                <div className="bg-primary/10 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0">
                                  {getActivityIcon(activity.type)}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <p className="font-medium text-sm">
                                      {activity.type}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {activity.date}
                                    </p>
                                  </div>
                                  <p className="text-sm mt-1">
                                    {activity.description}
                                  </p>
                                  <div className="flex items-center mt-2">
                                    <User className="h-3 w-3 text-muted-foreground mr-1" />
                                    <p className="text-xs text-muted-foreground">
                                      {activity.user}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Documents */}
                      {lead.documents && lead.documents.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-sm font-medium text-muted-foreground">
                            Documents
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {lead.documents.map((doc, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/20 border border-slate-800/50"
                              >
                                <div className="bg-primary/10 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0">
                                  {getDocumentIcon(doc.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm truncate">
                                    {doc.name}
                                  </p>
                                  <div className="flex items-center justify-between mt-1">
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {doc.type}
                                    </Badge>
                                    <div className="flex items-center gap-2">
                                      <p className="text-xs text-muted-foreground">
                                        {doc.size}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {doc.date}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Timeline */}
              {lead.timeline && lead.timeline.length > 0 && (
                <Card className="border-slate-800/50 bg-transparent">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Clock className="h-5 w-5 text-primary" />
                      Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative pl-8 border-l border-slate-700">
                      {lead.timeline.map((event, index) => {
                        const status = getStatusBadge(event.status);
                        return (
                          <div key={index} className="mb-8 last:mb-0">
                            <div
                              className={cn(
                                "absolute w-4 h-4 rounded-full -left-2 mt-1 border-2 border-background",
                                event.status === "new"
                                  ? "bg-blue-500"
                                  : event.status === "contacted"
                                  ? "bg-amber-500"
                                  : event.status === "qualified"
                                  ? "bg-emerald-500"
                                  : event.status === "converted"
                                  ? "bg-violet-500"
                                  : event.status === "lost"
                                  ? "bg-rose-500"
                                  : "bg-slate-500"
                              )}
                            ></div>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium">
                                  {event.date}
                                </span>
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "flex items-center",
                                    status.className
                                  )}
                                >
                                  {status.icon}
                                  {status.label}
                                </Badge>
                              </div>
                              <p className="text-sm">{event.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Sales Report Tab */}
            <TabsContent value="report">
              <Card className="border-transparent bg-transparent">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <FileText className="h-5 w-5 text-primary" />
                      Sales Intelligence Report
                    </CardTitle>
                    <CardDescription>
                      Comprehensive analysis of {lead.company} for sales
                      preparation
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => handleDownload("report")}
                    disabled={downloading === "report"}
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
                  <div className="space-y-6">
                    {lead.salesReport ? (
                      lead.salesReport.map((section, index) => (
                        <div
                          key={index}
                          className="border border-slate-800/50 rounded-lg overflow-hidden bg-slate-900/30"
                        >
                          <div className="bg-slate-800/50 px-4 py-3">
                            <h3 className="font-medium">{section.title}</h3>
                          </div>
                          <div className="p-4 text-sm whitespace-pre-line">
                            {section.content}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center py-12 text-center">
                        <div>
                          <FileText className="mx-auto h-16 w-16 text-muted-foreground mb-4 opacity-30" />
                          <h3 className="text-lg font-medium mb-2">
                            No Report Available
                          </h3>
                          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                            A detailed sales report has not been generated for
                            this lead yet. Generate a report to get
                            comprehensive insights.
                          </p>
                          <Button className="bg-primary/90 hover:bg-primary">
                            Generate Report
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sales Strategy Tab */}
            <TabsContent value="strategy">
              <Card className="border-transparent bg-transparent">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Target className="h-5 w-5 text-primary" />
                      Sales Strategy
                    </CardTitle>
                    <CardDescription>
                      Strategic approach to convert {lead.company} into a client
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => handleDownload("strategy")}
                    disabled={downloading === "strategy"}
                    className="bg-slate-800/50 border-slate-700"
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
                  <div className="space-y-6">
                    {lead.salesStrategy ? (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-800/50 flex flex-col items-center justify-center text-center">
                            <div className="bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center mb-3">
                              <DollarSign className="h-6 w-6 text-primary" />
                            </div>
                            <h4 className="font-medium mb-1">Budget Range</h4>
                            <p className="text-sm text-muted-foreground">
                              $100K-$150K
                            </p>
                          </div>

                          <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-800/50 flex flex-col items-center justify-center text-center">
                            <div className="bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center mb-3">
                              <Clock className="h-6 w-6 text-primary" />
                            </div>
                            <h4 className="font-medium mb-1">Timeline</h4>
                            <p className="text-sm text-muted-foreground">
                              4-6 weeks selection, Q3 implementation
                            </p>
                          </div>

                          <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-800/50 flex flex-col items-center justify-center text-center">
                            <div className="bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center mb-3">
                              <Users className="h-6 w-6 text-primary" />
                            </div>
                            <h4 className="font-medium mb-1">
                              Key Decision Makers
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              CTO and Procurement Manager
                            </p>
                          </div>
                        </div>

                        {lead.salesStrategy.map((section, index) => (
                          <div
                            key={index}
                            className="border border-slate-800/50 rounded-lg overflow-hidden bg-slate-900/30"
                          >
                            <div className="bg-slate-800/50 px-4 py-3">
                              <h3 className="font-medium">{section.title}</h3>
                            </div>
                            <div className="p-4 text-sm whitespace-pre-line">
                              {section.content}
                            </div>
                          </div>
                        ))}
                      </>
                    ) : (
                      <div className="flex items-center justify-center py-12 text-center">
                        <div>
                          <Target className="mx-auto h-16 w-16 text-muted-foreground mb-4 opacity-30" />
                          <h3 className="text-lg font-medium mb-2">
                            No Strategy Available
                          </h3>
                          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                            A sales strategy has not been developed for this
                            lead yet. Create a strategy to plan your approach.
                          </p>
                          <Button className="bg-primary/90 hover:bg-primary">
                            Develop Strategy
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sales Pitch Tab */}
            <TabsContent value="pitch">
              <Card className="border-transparent bg-transparent">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Lightbulb className="h-5 w-5 text-primary" />
                      Sales Pitch
                    </CardTitle>
                    <CardDescription>
                      Persuasive script for engaging with {lead.company}
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => handleDownload("pitch")}
                    disabled={downloading === "pitch"}
                    className="bg-slate-800/50 border-slate-700"
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
                  {lead.salesPitch ? (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        {lead.salesPitch.map((section, index) => (
                          <div
                            key={index}
                            className="border border-slate-800/50 rounded-lg overflow-hidden bg-slate-900/30"
                          >
                            <div className="bg-slate-800/50 px-4 py-3 flex justify-between items-center">
                              <h3 className="font-medium flex items-center">
                                {index === 0 && (
                                  <Bookmark className="h-4 w-4 text-primary mr-2" />
                                )}
                                {section.title}
                              </h3>
                              <Badge
                                variant={index === 0 ? "default" : "outline"}
                                className={index === 0 ? "bg-primary" : ""}
                              >
                                {index === 0
                                  ? "Start Here"
                                  : `Step ${index + 1}`}
                              </Badge>
                            </div>
                            <div className="p-4 text-sm whitespace-pre-line">
                              {section.content}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="border border-slate-800/50 rounded-lg p-5 bg-rose-500/5">
                        <h3 className="text-sm font-medium mb-3 text-rose-400">
                          Objection Handling Guidance
                        </h3>
                        <div className="space-y-4">
                          <div className="flex gap-3 p-3 rounded-lg bg-slate-900/40 border border-slate-800/50">
                            <div className="flex-shrink-0 mt-1">
                              <div className="bg-rose-500/10 h-6 w-6 rounded-full flex items-center justify-center">
                                <X className="h-3.5 w-3.5 text-rose-500" />
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                Pricing Concern:
                              </p>
                              <p className="text-sm text-muted-foreground">
                                While our solution requires an initial
                                investment, the ROI within 6 months completely
                                offsets this cost through operational savings of
                                40%.
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-3 p-3 rounded-lg bg-slate-900/40 border border-slate-800/50">
                            <div className="flex-shrink-0 mt-1">
                              <div className="bg-rose-500/10 h-6 w-6 rounded-full flex items-center justify-center">
                                <X className="h-3.5 w-3.5 text-rose-500" />
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                Integration Complexity:
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Our platform was designed with legacy system
                                integration as a core feature. We{"'"}ve
                                successfully integrated with 17 systems similar
                                to yours in the past year alone.
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-3 p-3 rounded-lg bg-slate-900/40 border border-slate-800/50">
                            <div className="flex-shrink-0 mt-1">
                              <div className="bg-rose-500/10 h-6 w-6 rounded-full flex items-center justify-center">
                                <X className="h-3.5 w-3.5 text-rose-500" />
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                Implementation Timeline:
                              </p>
                              <p className="text-sm text-muted-foreground">
                                We can offer a phased implementation approach
                                that delivers immediate value within 2 weeks,
                                while building toward the complete solution by
                                your Q3 deadline.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-12 text-center">
                      <div>
                        <Lightbulb className="mx-auto h-16 w-16 text-muted-foreground mb-4 opacity-30" />
                        <h3 className="text-lg font-medium mb-2">
                          No Pitch Available
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                          A sales pitch has not been created for this lead yet.
                          Create a pitch to guide your sales conversations.
                        </p>
                        <Button className="bg-primary/90 hover:bg-primary">
                          Create Pitch
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </>
  );
};

export default LeadDetailPage;
