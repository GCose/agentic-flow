import { LucideIcon } from "lucide-react";

export interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: "blue" | "purple" | "green" | "cyan" | "orange" | "red";
}
export interface StatCardData {
  value: string;
  icon: LucideIcon;
  color: "blue" | "purple" | "green" | "cyan" | "orange";
  title: string;
  change: string;
}

export interface DashboardStatsProps {
  stats: StatCardData[];
}

export interface SubSystemCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  bgColor: string;
  onClick: () => void;
}

export interface SubSystemsItem {
  title: string;
  description: string;
  icon: LucideIcon;
  bgColor: string;
  leadType: string;
  iconColor: string;
}

export interface SubSystemComponentProps {
  systems: SubSystemsItem[];
  title: string;
}
