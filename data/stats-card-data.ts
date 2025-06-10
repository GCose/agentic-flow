import { StatCardData } from "@/types";
import {
  Grid2X2,
  Zap,
  Clock,
  Users2Icon,
  Brain,
  CalendarClock,
  ShieldCheck,
  Snowflake,
  Thermometer,
} from "lucide-react";

/**===========================================
 * Stat card data for the admin dashboard.
 ===========================================*/
export const adminDashboardStats: StatCardData[] = [
  {
    value: "14",
    icon: Grid2X2,
    color: "blue",
    title: "Total Leads",
    change: "Warm and Cold Leads",
  },
  {
    value: "20",
    icon: Users2Icon,
    color: "purple",
    title: "Total Clients",
    change: "Clients using Agentic Flow",
  },
  {
    value: "100%",
    color: "green",
    icon: Zap,
    title: "AI-driven",
    change: "Intelligent by design, scalable by nature",
  },
  {
    value: "24/7",
    icon: Clock,
    color: "cyan",
    title: "Operation",
    change: "Proactive monitoring and execution",
  },
];

/**===================================================
 * Stat card data for the admin warm lead dashboard.
 ===================================================*/
export const adminWarmLeadDashboardStats: StatCardData[] = [
  {
    value: "28",
    icon: Thermometer,
    color: "orange",
    title: "Warm Leads",
    change: "+5 from last month",
  },
  {
    value: "63",
    icon: Snowflake,
    color: "blue",
    title: "Cold Leads",
    change: "+14 from last month",
  },
  {
    value: "19",
    icon: CalendarClock,
    color: "green",
    title: "Appointments Set",
    change: "+3 from last month",
  },
  {
    value: "11",
    icon: ShieldCheck,
    color: "purple",
    title: "Audits Done",
    change: "+2 from last month",
  },
];

/**============================================
 * Stat card data for the client dashboard.
 ============================================*/
export const clientDashboardStats: StatCardData[] = [
  {
    value: "44",
    icon: Brain,
    color: "blue",
    title: "Total Agents",
    change: "Autonomous AI agents across all systems",
  },
  {
    value: "4",
    icon: Grid2X2,
    color: "purple",
    title: "Core Systems",
    change: "Content, Lead Gen, Sales, and Onboarding",
  },
  {
    value: "100%",
    color: "green",
    icon: Zap,
    title: "AI-driven",
    change: "Intelligent by design, scalable by nature",
  },
  {
    value: "24/7",
    icon: Clock,
    color: "cyan",
    title: "Operation",
    change: "Proactive monitoring and execution",
  },
];

/**===================================================
 * Stat card data for the client warm lead dashboard.
 ===================================================*/
export const clientWarmLeadDashboardStats: StatCardData[] = [
  {
    value: "28",
    icon: Thermometer,
    color: "orange",
    title: "Warm Leads",
    change: "+5 from last month",
  },
  {
    value: "63",
    icon: Snowflake,
    color: "blue",
    title: "Cold Leads",
    change: "+14 from last month",
  },
  {
    value: "19",
    icon: CalendarClock,
    color: "green",
    title: "Appointments Set",
    change: "+3 from last month",
  },
  {
    value: "11",
    icon: ShieldCheck,
    color: "purple",
    title: "Audits Done",
    change: "+2 from last month",
  },
];
