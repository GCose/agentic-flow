import { Users, Thermometer, MessageSquare, Target } from "lucide-react";
import StatCard from "@/components/ui/stat-card";

const LeadGenOverview = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        value="42"
        icon={Users}
        color="blue"
        title="Total Leads"
        change="+8 from last month"
      />
      <StatCard
        value="28"
        icon={Thermometer}
        color="red"
        title="Warm Leads"
        change="+5 from last month"
      />
      <StatCard
        value="65%"
        color="green"
        icon={Target}
        title="Conversion Rate"
        change="+3.2% from last month"
      />
      <StatCard
        value="156"
        icon={MessageSquare}
        color="purple"
        title="Outreach Messages"
        change="+32 from last month"
      />
    </div>
  );
};

export default LeadGenOverview;
