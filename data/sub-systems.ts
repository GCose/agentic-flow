import {
  Users,
  FileText,
  UserPlus,
  Snowflake,
  ShieldCheck,
  ShoppingBag,
  Thermometer,
  CalendarClock,
} from "lucide-react";
import { SubSystemsItem } from "@/types";

/**============================================
 * Client Dashboard Subsystems Configuration.
 ============================================*/
export const ClientDashboardSystem: SubSystemsItem[] = [
  {
    title: "Content Generation",
    description: "Generate and manage content with AI agents",
    icon: FileText,
    bgColor: "bg-blue-500/10",
    iconColor: "text-blue-500",
    leadType: "client/content-system",
  },
  {
    title: "LeadGen System",
    description: "Identify and nurture potential clients",
    icon: Users,
    bgColor: "bg-purple-500/10",
    iconColor: "text-purple-500",
    leadType: "client/leadgen-system",
  },
  {
    title: "Sales System",
    description: "Maximize conversion and manage proposals",
    icon: ShoppingBag,
    bgColor: "bg-green-500/10",
    iconColor: "text-green-500",
    leadType: "appointment",
  },
  {
    title: "Onboarding System",
    description: "Streamline client onboarding process",
    icon: UserPlus,
    bgColor: "bg-orange-500/10",
    iconColor: "text-orange-500",
    leadType: "client/onboarding",
  },
];

/**=================================================
 * Client Lead Generation Subsystems Configuration.
 =================================================*/
export const ClientLeadGenSubSystems: SubSystemsItem[] = [
  {
    title: "Warm Leads",
    description:
      "Manage leads that have shown interest in your products or services",
    icon: Thermometer,
    bgColor: "bg-orange-500/10",
    iconColor: "text-orange-500",
    leadType: "client/leadgen-system/warm-leads",
  },
  {
    title: "Cold Leads",
    description: "Discover potential leads and start your outreach campaigns",
    icon: Snowflake,
    bgColor: "bg-blue-500/10",
    iconColor: "text-blue-500",
    leadType: "client/leadgen-system/cold-leads",
  },
  {
    title: "Appointments",
    description: "Book, reschedule, and manage client appointments efficiently",
    icon: CalendarClock,
    bgColor: "bg-green-500/10",
    iconColor: "text-green-500",
    leadType: "appointment",
  },
  {
    title: "Audits",
    description: "Get detailed breakdowns and recommendations for your funnel",
    icon: ShieldCheck,
    bgColor: "bg-purple-500/10",
    iconColor: "text-purple-500",
    leadType: "audit",
  },
];
