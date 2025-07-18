import {
  Building,
  Calendar,
  Clock,
  Target,
  Lightbulb,
  ExternalLink,
  Mail,
  Phone,
  Globe,
  MapPin,
  Briefcase,
  Users,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

interface LeadOverviewCardProps {
  lead: LeadData;
}

const LeadOverviewCard = ({ lead }: LeadOverviewCardProps) => {
  const getLeadScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-amber-500";
    return "text-rose-500";
  };

  return (
    <div className="bg-gradient-to-r from-blue-800/10 to-blue-900/20 rounded-xl border-none overflow-hidden">
      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/*====================  Lead Score Section ==================== */}
          <div className="lg:col-span-1 flex flex-col items-center justify-center text-center">
            <div className="mb-4">
              <div
                className={cn(
                  "text-6xl font-bold mb-2",
                  getLeadScoreColor(lead.leadScore)
                )}
              >
                {lead.leadScore}
              </div>
              <p className="text-slate-300 text-sm font-medium">Lead Score</p>
            </div>

            <div className="grid grid-cols-1 gap-4 w-full">
              <div className="bg-slate-800/30 rounded-lg p-3">
                <div className="flex items-center gap-2 justify-center">
                  <Calendar className="h-4 w-4 text-primary" />
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">
                      Lead Captured
                    </p>
                    <p className="text-sm font-medium">{lead.createdAt}</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/30 rounded-lg p-3">
                <div className="flex items-center gap-2 justify-center">
                  <Clock className="h-4 w-4 text-primary" />
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">
                      Last Contact
                    </p>
                    <p className="text-sm font-medium">{lead.leadEntry}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*====================  End of Lead Score Section ==================== */}

          {/*====================  Company Description ==================== */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              About {lead.company}
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {lead.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-800/50 h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{lead.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-slate-800/50 h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="h-4 w-4 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm font-medium">{lead.phone}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-800/50 h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Globe className="h-4 w-4 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Website</p>
                    <a
                      href={lead.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium flex items-center hover:text-primary"
                    >
                      {lead.website?.replace(/(^\w+:|^)\/\//, "")}
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-slate-800/50 h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-4 w-4 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Address</p>
                    <p className="text-sm font-medium">{lead.address}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*====================  End of Company Description ==================== */}

          {/*====================  Company Stats ==================== */}
          <div className="lg:col-span-1">
            <h4 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
              Company Details
            </h4>
            <div className="space-y-4">
              <div className="bg-slate-800/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-blue-400" />
                  <span className="text-xs text-muted-foreground">
                    Company Size
                  </span>
                </div>
                <p className="font-medium">{lead.size}</p>
              </div>

              <div className="bg-slate-800/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-purple-400" />
                  <span className="text-xs text-muted-foreground">
                    Annual Revenue
                  </span>
                </div>
                <p className="font-medium">{lead.revenue}</p>
              </div>

              <div className="bg-slate-800/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="h-4 w-4 text-purple-400" />
                  <span className="text-xs text-muted-foreground">
                    Industry
                  </span>
                </div>
                <p className="font-medium">{lead.industry}</p>
              </div>
            </div>
          </div>
          {/*====================  End of Company Stats ==================== */}
        </div>
      </div>

      {/*==================== Strategy & Pitch Overview ====================*/}
      <div className="grid grid-cols-2 border-t border-blue-900/30">
        <div className="p-6 text-center border-r border-blue-900/30">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Target className="h-4 w-4 text-primary" />
            <p className="text-sm font-medium text-muted-foreground">
              Strategy
            </p>
          </div>
          <p className="font-semibold">{lead.strategy}</p>
        </div>

        <div className="p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Lightbulb className="h-4 w-4 text-primary" />
            <p className="text-sm font-medium text-muted-foreground">
              Sale Pitch
            </p>
          </div>
          <p className="font-semibold">{lead.salePitch}</p>
        </div>
      </div>
      {/*==================== End of Strategy & Pitch Overview ====================*/}
    </div>
  );
};

export default LeadOverviewCard;
