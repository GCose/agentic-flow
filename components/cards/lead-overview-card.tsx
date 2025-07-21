import {
  Building,
  Calendar,
  Clock,
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

const LeadOverviewCard = ({ lead }: any) => {
  const getLeadScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-amber-500";
    return "text-rose-500";
  };

  console.log("Lead Overview Card Data:", lead);

  return (
    <div className="bg-gradient-to-r from-blue-800/10 to-blue-900/20 rounded-xl border-none overflow-hidden">
      <div className="px-8 pt-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-rows-[1fr_auto] gap-8">
          {/*==================== Top Row: Lead Score and About ==================== */}
          <div className="lg:row-span-1 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/*==================== Lead Score Section ==================== */}
            <div className="lg:col-span-1 lg:border-r lg:pr-6 border-blue-900/30 flex flex-col items-center justify-center text-center">
              <div className="mb-4">
                <div
                  className={cn(
                    "text-6xl font-bold mb-2",
                    getLeadScoreColor(
                      lead.lead_analysis?.lead_score ||
                        lead.report.report_section?.audit_scorecard[0]
                          .overall_funnel_score.score
                    )
                  )}
                >
                  {lead.lead_analysis?.lead_score ||
                    lead.report.report_section?.audit_scorecard[0]
                      .overall_funnel_score.score}
                </div>
                <p className="text-slate-300 text-sm font-medium">Lead Score</p>
              </div>
              <div className="grid grid-cols-1 gap-4 w-full">
                <div className="bg-gray-100/5 rounded-lg p-3">
                  <div className="flex items-center gap-5 justify-center">
                    <Calendar className="h-4 w-4 text-amber-400" />
                    <div className="text-left">
                      <p className="text-xs text-muted-foreground mb-1">
                        Lead Captured
                      </p>
                      <p className="text-sm font-medium">{lead.created_at}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-100/5 rounded-lg p-3">
                  <div className="flex items-center gap-5 justify-center">
                    <Clock className="h-4 w-4 text-lime-500" />
                    <div className="text-left">
                      <p className="text-xs text-muted-foreground mb-1">
                        Last Contact
                      </p>
                      <p className="text-sm font-medium">{lead.updated_at}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/*==================== End of Lead Score Section ==================== */}

            {/*==================== Company Description ==================== */}
            <div className="lg:col-span-2">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Building className="h-5 w-5 text-emerald-400" />
                About {lead.company_name}
              </h3>
              <p className="text-muted-foreground mb-6 leading-10">
                {lead.lead_analysis?.summary ||
                  lead.summary?.writer_report?.summary}
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
                        href={lead.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium flex items-center hover:text-primary"
                      >
                        {lead.website_url?.replace(/(^\w+:|^)\/\//, "")}
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
                      <p className="text-sm font-medium">
                        {lead.lead_analysis?.address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/*====================  End of Company Description ==================== */}
          </div>
          {/*==================== End of Top Row ==================== */}

          {/*==================== Bottom Row: Company Details ==================== */}
          <div className="lg:row-span-1 lg:border-t border-blue-900/30">
            <div className="grid grid-cols-1 md:grid-cols-3">
              {lead.lead_analysis?.company_size && (
                <div className="text-center border-r md:border-r-blue-900/30 md:border-b-0 border-b border-b-blue-900/30 md:last:border-r-0 last:border-b-0">
                  <div className="flex items-center justify-center gap-2 pt-6 mb-3">
                    <Users className="h-5 w-5 text-blue-400" />
                    <span className="text-sm font-medium text-muted-foreground">
                      Company Size
                    </span>
                  </div>
                  <p className="text-lg font-semibold">
                    {lead.lead_analysis?.company_size}
                  </p>
                </div>
              )}
              {lead.lead_analysis?.annual_revenue && (
                <div className="text-center border-r md:border-r-blue-900/30 md:border-b-0 border-b border-b-blue-900/30 md:last:border-r-0 last:border-b-0">
                  <div className="flex items-center justify-center gap-2 pt-6 mb-3">
                    <DollarSign className="h-5 w-5 text-green-400" />
                    <span className="text-sm font-medium text-muted-foreground">
                      Annual Revenue
                    </span>
                  </div>
                  <p className="text-lg font-semibold">
                    {lead.lead_analysis?.annual_revenue}
                  </p>
                </div>
              )}
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 pt-6 mb-3">
                  <Briefcase className="h-5 w-5 text-purple-400" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Industry
                  </span>
                </div>
                <p className="text-lg font-semibold">
                  {lead.lead_analysis?.industry || lead.industry}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadOverviewCard;
