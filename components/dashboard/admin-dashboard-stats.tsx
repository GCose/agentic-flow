import { Grid2X2, Zap, Clock, Users2Icon } from "lucide-react";
import StatCard from "../ui/stat-card";

const DashboardStats = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        value="14"
        icon={Grid2X2}
        color="blue"
        title="Total Leads"
        change="Warm and Cold Leads"
      />
      <StatCard
        value="20"
        icon={Users2Icon}
        color="purple"
        title="Total Clients"
        change="Clients using Agentic Flow"
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
