import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ContentChannelCardProps {
  name: string;
  icon: LucideIcon;
  color: string;
}

const ContentChannelCard = ({
  name,
  icon: Icon,
  color,
}: ContentChannelCardProps) => {
  const colorMap = {
    blue: {
      bg: "bg-transparent",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
      textColor: "text-blue-500",
    },
    purple: {
      bg: "bg-transparent",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-500",
      textColor: "text-purple-500",
    },
    green: {
      bg: "bg-transparent",
      iconBg: "bg-green-500/10",
      iconColor: "text-green-500",
      textColor: "text-green-500",
    },
    cyan: {
      bg: "bg-transparent",
      iconBg: "bg-cyan-500/10",
      iconColor: "text-cyan-500",
      textColor: "text-cyan-500",
    },
    orange: {
      bg: "bg-transparent",
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-500",
      textColor: "text-orange-500",
    },
    red: {
      bg: "bg-transparent",
      iconBg: "bg-red-500/10",
      iconColor: "text-red-500",
      textColor: "text-red-500",
    },
    pink: {
      bg: "bg-transparent",
      iconBg: "bg-pink-500/10",
      iconColor: "text-pink-500",
      textColor: "text-pink-500",
    },
    indigo: {
      bg: "bg-transparent",
      iconBg: "bg-indigo-500/10",
      iconColor: "text-indigo-500",
      textColor: "text-indigo-500",
    },
    amber: {
      bg: "bg-transparent",
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-500",
      textColor: "text-amber-500",
    },
  };

  const colors = colorMap[color as keyof typeof colorMap] || colorMap.blue;

  return (
    <Card
      className={`border border-slate-800 backdrop-blur-sm overflow-hidden cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-md ${colors.bg}`}
    >
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className={`rounded-full ${colors.iconBg} p-2`}>
            <Icon className={`h-10 w-10 ${colors.iconColor}`} />
          </div>
        </div>
        <h3 className="text-lg font-bold mb-2">{name}</h3>
      </CardContent>
    </Card>
  );
};

export default ContentChannelCard;
