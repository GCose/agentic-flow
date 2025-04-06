"use client";

import { useTheme } from "next-themes";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { overviewData } from "@/mock/chart-data";
import ChartTooltip from "../ui/chart-tooltip";

const DashboardOverview = () => {
  const { theme } = useTheme();

  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={overviewData}
          margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
        >
          <CartesianGrid
            vertical={false}
            strokeDasharray="3 3"
            stroke={theme === "dark" ? "#374151" : "#e5e7eb"}
          />
          <XAxis
            fontSize={12}
            dataKey="name"
            tickLine={false}
            axisLine={false}
            stroke={theme === "dark" ? "#9CA3AF" : "#6B7280"}
          />
          <YAxis
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
            stroke={theme === "dark" ? "#9CA3AF" : "#6B7280"}
          />
          <Tooltip content={<ChartTooltip />} />
          <Bar
            dataKey="interactions"
            radius={[4, 4, 0, 0]}
            fill={theme === "dark" ? "#60A5FA" : "#3B82F6"}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DashboardOverview;
