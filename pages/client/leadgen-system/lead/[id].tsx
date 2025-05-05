import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  ArrowLeft,
  Building,
  FileText,
  User,
  BarChart,
  MessageCircle,
  Clock,
  BarChart2,
  Mail,
  Phone,
  ExternalLink,
  Edit,
  Trash,
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
import { WarmLead } from "@/types/leads";

// Mock data for lead details - extended from the warm leads data
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
  },
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
  // Add more lead details as needed
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

const LeadDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [lead, setLead] = useState<(typeof leadDetails)[string] | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

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

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-500/10 text-blue-500";
      case "contacted":
        return "bg-yellow-500/10 text-yellow-500";
      case "qualified":
        return "bg-green-500/10 text-green-500";
      case "converted":
        return "bg-purple-500/10 text-purple-500";
      case "lost":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-slate-500/10 text-slate-500";
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex-1 p-8 flex items-center justify-center">
          <p>Loading lead details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!lead) {
    return (
      <DashboardLayout>
        <div className="flex-1 p-8 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-2">Lead Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The lead you are looking for does not exist or has been removed.
          </p>
          <Button onClick={handleBack}>Back to Leads</Button>
        </div>
      </DashboardLayout>
    );
  }

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
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-transparent backdrop-blur-xs px-4 sm:px-6 border-slate-800">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">
              {lead.company} Lead Details
            </h2>
            <Badge variant="outline" className={getStatusBadge(lead.status)}>
              {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
            </Badge>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit Lead
            </Button>
            <Button variant="destructive">
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </header>

        <div className="flex-1 space-y-6 p-8 pt-6">
          {/* Lead Overview */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2 border border-slate-800 bg-transparent backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Company Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold">{lead.company}</h3>
                    <p className="text-muted-foreground">{lead.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      {lead.industry && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Industry:
                          </span>
                          <span>{lead.industry}</span>
                        </div>
                      )}
                      {lead.size && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Company Size:
                          </span>
                          <span>{lead.size}</span>
                        </div>
                      )}
                      {lead.revenue && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Annual Revenue:
                          </span>
                          <span>{lead.revenue}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      {lead.email && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Email:
                          </span>
                          <span>{lead.email}</span>
                        </div>
                      )}
                      {lead.phone && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Phone:
                          </span>
                          <span>{lead.phone}</span>
                        </div>
                      )}
                      {lead.website && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Website:
                          </span>
                          <a
                            href={lead.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-primary hover:underline"
                          >
                            {lead.website.replace(/(^\w+:|^)\/\//, "")}
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {lead.address && (
                    <div className="pt-2">
                      <span className="text-sm text-muted-foreground">
                        Address:
                      </span>
                      <p>{lead.address}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-800 bg-transparent backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5" />
                  Lead Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Lead Score</span>
                      <span className="font-medium">{lead.leadScore}/100</span>
                    </div>
                    <Progress value={lead.leadScore} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-sm text-muted-foreground">
                        Created
                      </span>
                      <p className="font-medium">{lead.createdAt}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm text-muted-foreground">
                        Last Contact
                      </span>
                      <p className="font-medium">{lead.lastContact}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm text-muted-foreground">
                        Assigned To
                      </span>
                      <p className="font-medium">{lead.assignedTo}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm text-muted-foreground">
                        Strategy
                      </span>
                      <p className="font-medium">{lead.strategy}</p>
                    </div>
                  </div>

                  {lead.report && (
                    <div className="pt-2">
                      <span className="text-sm text-muted-foreground">
                        Latest Report
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>{lead.report}</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs for detailed information */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList className="grid w-full max-w-md grid-cols-4 bg-slate-800/30">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="contacts">Contacts</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card className="border border-slate-800 bg-transparent backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Notes & Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">
                        Sales Pitch Strategy
                      </h4>
                      <p>{lead.salePitch}</p>
                    </div>

                    {lead.notes && lead.notes.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">
                          Notes
                        </h4>
                        <ul className="space-y-2">
                          {lead.notes.map((note, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="rounded-full h-1.5 w-1.5 bg-primary mt-2"></span>
                              <span>{note}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {lead.timeline && lead.timeline.length > 0 && (
                <Card className="border border-slate-800 bg-transparent backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative pl-6 border-l border-slate-800">
                      {lead.timeline.map((event, index) => (
                        <div key={index} className="mb-6 last:mb-0">
                          <div className="absolute w-3 h-3 bg-primary rounded-full -left-1.5 mt-1.5"></div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium">
                                {event.date}
                              </span>
                              <Badge
                                variant="outline"
                                className={getStatusBadge(event.status)}
                              >
                                {event.status.charAt(0).toUpperCase() +
                                  event.status.slice(1)}
                              </Badge>
                            </div>
                            <p className="text-sm">{event.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="contacts" className="space-y-4">
              <Card className="border border-slate-800 bg-transparent backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Key Contacts
                  </CardTitle>
                  <CardDescription>
                    People associated with this lead
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {lead.contacts && lead.contacts.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2">
                      {lead.contacts.map((contact, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-4 p-4 border border-slate-800 rounded-lg"
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>
                              {contact.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <h4 className="font-medium">{contact.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {contact.position}
                            </p>
                            <div className="pt-2 space-y-1">
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                                <span>{contact.email}</span>
                              </div>
                              {contact.phone && (
                                <div className="flex items-center gap-2 text-sm">
                                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                                  <span>{contact.phone}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">
                        No contacts have been added yet
                      </p>
                      <Button className="mt-4">Add Contact</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activities" className="space-y-4">
              <Card className="border border-slate-800 bg-transparent backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart2 className="h-5 w-5" />
                    Activities
                  </CardTitle>
                  <CardDescription>
                    Recent interactions with this lead
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {lead.activities && lead.activities.length > 0 ? (
                    <div className="space-y-4">
                      {lead.activities.map((activity, index) => {
                        let icon;
                        switch (activity.type.toLowerCase()) {
                          case "email":
                            icon = <Mail className="h-4 w-4" />;
                            break;
                          case "call":
                            icon = <Phone className="h-4 w-4" />;
                            break;
                          case "meeting":
                            icon = <User className="h-4 w-4" />;
                            break;
                          default:
                            icon = <MessageCircle className="h-4 w-4" />;
                        }

                        return (
                          <div
                            key={index}
                            className="flex items-start gap-4 rounded-lg p-3 transition-colors hover:bg-white/5"
                          >
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                              {icon}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium">{activity.type}</h4>
                                <span className="text-xs text-muted-foreground">
                                  {activity.date}
                                </span>
                              </div>
                              <p className="mt-1 text-sm">
                                {activity.description}
                              </p>
                              <p className="mt-1 text-xs text-muted-foreground">
                                By: {activity.user}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">
                        No activities recorded yet
                      </p>
                      <Button className="mt-4">Log Activity</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
              <Card className="border border-slate-800 bg-transparent backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Documents
                  </CardTitle>
                  <CardDescription>
                    Files and documents associated with this lead
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {lead.documents && lead.documents.length > 0 ? (
                    <div className="space-y-2">
                      {lead.documents.map((document, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded bg-primary/10">
                              <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{document.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {document.type} · {document.size}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {document.date}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">
                        No documents have been uploaded yet
                      </p>
                      <Button className="mt-4">Upload Document</Button>
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
