import { Brain, Users, BarChart3, Clock } from "lucide-react";
import StatCard from "../ui/stat-card";

const DashboardStats = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        value="44"
        icon={Brain}
        color="blue"
        title="Total Agents"
        change="+20 from last month"
      />
      <StatCard
        value="573"
        icon={Users}
        color="purple"
        title="Active Clients"
        change="+18 from last week"
      />
      <StatCard
        value="92.6%"
        color="green"
        icon={BarChart3}
        title="Success Rate"
        change="+2.1% from last month"
      />
      <StatCard
        value="1.2s"
        icon={Clock}
        color="cyan"
        title="Avg. Response Time"
        change="-0.1s from last week"
      />
    </div>
  );
};

export default DashboardStats;
