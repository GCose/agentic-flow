import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: "blue" | "purple" | "green" | "cyan" | "orange" | "red";
}

const StatCard = ({
  title,
  value,
  change,
  icon: Icon,
  color,
}: StatCardProps) => {
  const colorMap = {
    blue: {
      bg: "bg-gradient-to-br from-blue-500/10 to-blue-500/5",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
    },
    purple: {
      bg: "bg-gradient-to-br from-purple-500/10 to-purple-500/5",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-500",
    },
    green: {
      bg: "bg-gradient-to-br from-green-500/10 to-green-500/5",
      iconBg: "bg-green-500/10",
      iconColor: "text-green-500",
    },
    cyan: {
      bg: "bg-gradient-to-br from-cyan-500/10 to-cyan-500/5",
      iconBg: "bg-cyan-500/10",
      iconColor: "text-cyan-500",
    },
    orange: {
      bg: "bg-gradient-to-br from-orange-500/10 to-orange-500/5",
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-500",
    },
    red: {
      bg: "bg-gradient-to-br from-red-500/10 to-red-500/5",
      iconBg: "bg-red-500/10",
      iconColor: "text-red-500",
    },
  };

  const colors = colorMap[color];

  return (
    <Card className={`border-none overflow-hidden border ${colors.bg}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-md font-medium">{title}</CardTitle>
        <Icon className={`h-7 w-7 ${colors.iconColor}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold pb-1">{value}</div>
        <p className="text-xs text-muted-foreground">{change}</p>
      </CardContent>
    </Card>
  );
};

export default StatCard;
