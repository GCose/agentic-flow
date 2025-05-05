import { useState } from "react";
import { CheckCircle, AlertCircle, Clock, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ActivityItem {
  id: string;
  agent: string;
  system: string;
  action: string;
  time: string;
  status: "success" | "error" | "pending" | "waiting";
}

// Mock activity data
const mockActivities: ActivityItem[] = [
  {
    id: "act-1",
    agent: "Content Creator Agent",
    system: "Content System",
    action: "Generated blog post about AI automation",
    time: "2 minutes ago",
    status: "success",
  },
  {
    id: "act-2",
    agent: "Lead Analyzer Agent",
    system: "LeadGen System",
    action: "Analyzed 12 new leads for qualification",
    time: "5 minutes ago",
    status: "success",
  },
  {
    id: "act-3",
    agent: "Email Sender Agent",
    system: "Content System",
    action: "Failed to send newsletter to segment B",
    time: "10 minutes ago",
    status: "error",
  },
  {
    id: "act-4",
    agent: "Objection Intelligence Agent",
    system: "Sales System",
    action: "Processing client objection patterns",
    time: "15 minutes ago",
    status: "pending",
  },
  {
    id: "act-5",
    agent: "Content Optimizer Agent",
    system: "Content System",
    action: "Optimized 3 Facebook ads for better CTR",
    time: "22 minutes ago",
    status: "success",
  },
  {
    id: "act-6",
    agent: "Cold Lead Scoring Agent",
    system: "LeadGen System",
    action: "Waiting for external API response",
    time: "25 minutes ago",
    status: "waiting",
  },
  {
    id: "act-7",
    agent: "Onboarding Coordinator Agent",
    system: "Onboarding System",
    action: "Successfully onboarded new client: Tech Solutions Inc.",
    time: "30 minutes ago",
    status: "success",
  },
  {
    id: "act-8",
    agent: "Proposal Generator Agent",
    system: "Sales System",
    action: "Generated custom proposal for Enterprise client",
    time: "35 minutes ago",
    status: "success",
  },
  {
    id: "act-9",
    agent: "Topic Selector Agent",
    system: "Content System",
    action: "Selected trending topics for next week's content",
    time: "40 minutes ago",
    status: "success",
  },
  {
    id: "act-10",
    agent: "SIM - Sales Intelligence Manager",
    system: "Sales System",
    action: "Weekly performance review completed",
    time: "1 hour ago",
    status: "success",
  },
];

interface AgentActivityFeedProps {
  limit?: number;
  systemFilter?: string;
}

const AgentActivityFeed = ({
  limit = 5,
  systemFilter,
}: AgentActivityFeedProps) => {
  const [activities] = useState<ActivityItem[]>(mockActivities);

  // Filter activities by system if systemFilter is provided
  const filteredActivities = systemFilter
    ? activities.filter((activity) =>
        activity.system.toLowerCase().includes(systemFilter.toLowerCase())
      )
    : activities;

  // Apply limit
  const displayedActivities = filteredActivities.slice(0, limit);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "pending":
        return <RefreshCw className="h-5 w-5 text-blue-500" />;
      case "waiting":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getSystemColor = (system: string) => {
    switch (system) {
      case "Content System":
        return "bg-blue-500/10 text-blue-500";
      case "LeadGen System":
        return "bg-purple-500/10 text-purple-500";
      case "Sales System":
        return "bg-green-500/10 text-green-500";
      case "Onboarding System":
        return "bg-orange-500/10 text-orange-500";
      default:
        return "bg-slate-500/10 text-slate-500";
    }
  };

  return (
    <div className="space-y-4">
      {displayedActivities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-center gap-4 rounded-lg p-3 hover:bg-white/5 transition-colors"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
            {getStatusIcon(activity.status)}
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium leading-none">
                {activity.agent}
              </p>
              <Badge
                variant="outline"
                className={getSystemColor(activity.system)}
              >
                {activity.system.replace(" System", "")}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{activity.action}</p>
          </div>
          <div className="text-sm text-muted-foreground whitespace-nowrap">
            {activity.time}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AgentActivityFeed;
