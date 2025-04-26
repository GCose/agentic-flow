import { Users, BarChart3, Clock, MessageSquare } from "lucide-react";
import StatCard from "../ui/stat-card";

const ClientOverview = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        value="573"
        icon={Users}
        color="blue"
        title="Total Clients"
        change="+18 from last week"
      />
      <StatCard
        value="129"
        color="purple"
        icon={MessageSquare}
        title="Active Sessions"
        change="+24 from Yesterday"
      />
      <StatCard
        icon={Clock}
        value="4.2m"
        color="red"
        title="Avg. Session Duration"
        change="-0.3m from last week"
      />
      <StatCard
        color="green"
        value="94.3%"
        icon={BarChart3}
        title="Satisfaction Rate"
        change="+1.2% from last month"
      />
    </div>
  );
};

export default ClientOverview;
