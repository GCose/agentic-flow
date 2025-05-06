import { Grid2X2, Zap, Clock, Users2Icon } from "lucide-react";
import StatCard from "../ui/stat-card";

const DashboardStats = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        value="20"
        icon={Users2Icon}
        color="blue"
        title="Total Clients"
        change="Clients using Agentic Flow"
      />
      <StatCard
        value="4"
        icon={Grid2X2}
        color="purple"
        title="Core Systems"
        change="Content, Lead Gen, Sales, and Onboarding"
      />
      <StatCard
        value="100%"
        color="green"
        icon={Zap}
        title="AI-driven"
        change="Intelligent by design, scalable by nature"
      />
      <StatCard
        value="24/7"
        icon={Clock}
        color="cyan"
        title="Operation"
        change="Proactive monitoring and execution"
      />
    </div>
  );
};

export default DashboardStats;
