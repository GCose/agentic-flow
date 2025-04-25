import { useTheme } from "next-themes";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import ChartTooltip from "@/components/ui/chart-tooltip";
import { Card, CardContent } from "@/components/ui/card";

type AgentData = {
  name: string;
  contentCount: number;
  avgViews: number;
  avgEngagement: number;
  successRate: number;
  color: string;
};

const generateAgentPerformanceData = (): AgentData[] => {
  return [
    {
      name: "Content Creator Agent",
      contentCount: Math.floor(20 + Math.random() * 30),
      avgViews: Math.floor(2000 + Math.random() * 5000),
      avgEngagement: 3 + Math.random() * 8,
      successRate: 90 + Math.random() * 9,
      color: "#3B82F6",
    },
    {
      name: "Content Optimizer Agent",
      contentCount: Math.floor(15 + Math.random() * 25),
      avgViews: Math.floor(2500 + Math.random() * 5000),
      avgEngagement: 4 + Math.random() * 7,
      successRate: 92 + Math.random() * 7,
      color: "#10B981",
    },
    {
      name: "Topic Selector Agent",
      contentCount: Math.floor(10 + Math.random() * 20),
      avgViews: Math.floor(3000 + Math.random() * 4000),
      avgEngagement: 5 + Math.random() * 6,
      successRate: 93 + Math.random() * 6,
      color: "#F59E0B",
    },
    {
      name: "Trend Selector Agent",
      contentCount: Math.floor(8 + Math.random() * 18),
      avgViews: Math.floor(3500 + Math.random() * 4500),
      avgEngagement: 6 + Math.random() * 5,
      successRate: 94 + Math.random() * 5,
      color: "#8B5CF6",
    },
  ];
};

type DistributionData = {
  name: string;
  value: number;
  color: string;
};

const generateContentDistributionData = (
  agents: AgentData[]
): DistributionData[] => {
  return agents.map((agent) => ({
    name: agent.name,
    value: agent.contentCount,
    color: agent.color,
  }));
};

const AgentPerformanceForChannel = () => {
  const { theme } = useTheme();
  const agentData = generateAgentPerformanceData();
  const contentDistributionData = generateContentDistributionData(agentData);

  const maxViews = Math.max(...agentData.map((agent) => agent.avgViews));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-80">
          <h3 className="text-lg font-medium mb-4">
            Content Production by Agent
          </h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart
              data={agentData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                stroke={theme === "dark" ? "#9CA3AF" : "#6B7280"}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => value.replace(" Agent", "")}
              />
              <YAxis stroke={theme === "dark" ? "#9CA3AF" : "#6B7280"} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="contentCount" name="Content Count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="h-80">
          <h3 className="text-lg font-medium mb-4">Content Distribution</h3>
          <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <Pie
                data={contentDistributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }: { name: string; percent: number }) =>
                  `${name.replace(" Agent", "")}: ${(percent * 100).toFixed(
                    0
                  )}%`
                }
              >
                {contentDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Average Views by Agent */}
        <Card className="border bg-transparent">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Average Views by Agent</h3>
            <div className="space-y-4">
              {agentData.map((agent) => {
                const widthPercent = (agent.avgViews / maxViews) * 100;

                return (
                  <div key={agent.name}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">
                        {agent.name.replace(" Agent", "")}
                      </span>
                      <span className="text-sm">
                        {agent.avgViews.toLocaleString()} views
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${widthPercent}%`,
                          backgroundColor: agent.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Success Rate by Agent */}
        <Card className="border bg-transparent">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Success Rate by Agent</h3>
            <div className="space-y-4">
              {agentData.map((agent) => {
                const successColor =
                  agent.successRate >= 90
                    ? "bg-green-500"
                    : agent.successRate >= 80
                    ? "bg-yellow-500"
                    : "bg-red-500";
                
                return (
                  <div key={agent.name}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">
                        {agent.name.replace(" Agent", "")}
                      </span>
                      <span className="text-sm font-medium">
                        {agent.successRate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div
                        className={`h-2 rounded-full ${successColor}`}
                        style={{ width: `${agent.successRate}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgentPerformanceForChannel;
