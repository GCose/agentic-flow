import { DashboardStatsProps } from "@/types";
import StatCard from "../ui/stat-card";

const DashboardStatCard = ({ stats }: DashboardStatsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard
          key={`${stat.title}-${index}`}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
          title={stat.title}
          change={stat.change}
        />
      ))}
    </div>
  );
};

export default DashboardStatCard;
