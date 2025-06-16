import { FileText, Users, UserPlus, ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface SystemCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  iconBg: string;
  iconColor: string;
}

const SystemCard = ({
  title,
  description,
  icon,
  color,
  iconBg,
  iconColor,
}: SystemCardProps) => {
  return (
    <Card
      className={`border-blue-900/30 ${color} hover:-translate-y-2 transition-all duration-500 h-full bg-transparent`}
    >
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className={`rounded-full ${iconBg} p-4 mb-4`}>
          <div className={`${iconColor}`}>{icon}</div>
        </div>
        <h3 className="font-medium text-lg mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

const SystemCards = () => {
  const systems = [
    {
      title: "Content Generation",
      description: "Generate and manage content with AI agents",
      icon: <FileText className="h-6 w-6" />,
      href: "/content-system",
      color: "bg-transparent from-blue-500/10 to-blue-500/5",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
    },
    {
      title: "Lead Generation",
      description: "Identify and nurture potential clients",
      icon: <Users className="h-6 w-6" />,
      href: "/lead-generation",
      color: "bg-transparent from-purple-500/10 to-purple-500/5",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-500",
    },
    {
      title: "Sales System",
      description: "Maximize conversion and manage proposals",
      icon: <ShoppingBag className="h-6 w-6" />,
      href: "/sales-system",
      color: "bg-transparent from-cyan-500/10 to-cyan-500/5",
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-500",
    },
    {
      title: "Onboarding System",
      description: "Streamline client onboarding process",
      icon: <UserPlus className="h-6 w-6" />,
      href: "/onboarding",
      color: "bg-transparent from-orange-500/10 to-orange-500/5",
      iconBg: "bg-cyan-500/10",
      iconColor: "text-cyan-500",
    },
  ];

  return (
    <>
      {systems.map((system) => (
        <SystemCard key={system.title} {...system} />
      ))}
    </>
  );
};

export default SystemCards;
