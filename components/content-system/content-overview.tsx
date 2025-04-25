import { BarChart3, FileText, Eye, MousePointer } from "lucide-react";
import StatCard from "@/components/ui/stat-card";

const ContentOverview = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        value="162"
        icon={FileText}
        color="blue"
        title="Total Active Ads"
        change="+18 from last month"
      />
      <StatCard
        value="1.4M"
        icon={Eye}
        color="purple"
        title="Total Impressions"
        change="+12.4% from last month"
      />
      <StatCard
        value="3.8%"
        color="green"
        icon={MousePointer}
        title="Average CTR"
        change="+0.6% from last month"
      />
      <StatCard
        value="95.2%"
        icon={BarChart3}
        color="cyan"
        title="Agent Success Rate"
        change="+1.2% from last month"
      />
    </div>
  );
};

export default ContentOverview;
