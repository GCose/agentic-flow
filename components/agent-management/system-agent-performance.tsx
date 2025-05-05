import { useState } from "react";
import { useTheme } from "next-themes";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface Agent {
  id: string;
  name: string;
  performanceScore: number;
  successRate: number;
}

interface SystemAgentPerformanceProps {
  agents: Agent[];
  systemColor: string;
}

const SystemAgentPerformance: React.FC<SystemAgentPerformanceProps> = ({
  agents,
  systemColor,
}) => {
  const { theme } = useTheme();
  const [activeMetric, setActiveMetric] = useState("performance");
  const [timeRange, setTimeRange] = useState("week");

  // Generate some mock time series data for performance over time
  const generateTimeSeriesData = () => {
    const periods = timeRange === "week" ? 7 : timeRange === "month" ? 30 : 12;
    const periodLabels =
      timeRange === "week"
        ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        : timeRange === "month"
        ? Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`)
        : [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];

    return periodLabels.map((label, index) => {
      // Data object with the time period
      const dataPoint: { name: string; [key: string]: number | string } = {
        name: label,
      };

      // Add a performance value for each agent
      agents.forEach((agent) => {
        // Base value with some randomness that trends slightly upward
        const baseValue = agent.performanceScore - 5 + (index / periods) * 10;
        const randomVariation = Math.random() * 5 - 2.5;
        dataPoint[agent.name] = Math.min(
          100,
          Math.max(50, baseValue + randomVariation)
        );
      });

      return dataPoint;
    });
  };

  // Prepare data for the bar chart comparison
  const performanceData = agents.map((agent) => ({
    name: agent.name.replace(" Agent", "").replace("SIM - ", "SIM"),
    [activeMetric === "performance" ? "Performance Score" : "Success Rate"]:
      activeMetric === "performance"
        ? agent.performanceScore
        : agent.successRate,
  }));

  // Generate time series data
  const timeSeriesData = generateTimeSeriesData();

  // Generate colors for each agent
  const getAgentColor = (index: number) => {
    const colors = [
      `#3B82F6`, // blue
      `#10B981`, // green
      `#8B5CF6`, // purple
      `#F59E0B`, // amber
      `#EC4899`, // pink
      `#EF4444`, // red
      `#14B8A6`, // teal
      `#F97316`, // orange
      `#6366F1`, // indigo
      `#A855F7`, // purple
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Tabs
          value={activeMetric}
          onValueChange={setActiveMetric}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid w-full grid-cols-2 bg-slate-800/30">
            <TabsTrigger value="performance">Performance Score</TabsTrigger>
            <TabsTrigger value="success">Success Rate</TabsTrigger>
          </TabsList>
        </Tabs>

        <Tabs
          value={timeRange}
          onValueChange={setTimeRange}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/30">
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={performanceData}
            margin={{ top: 10, right: 30, left: 20, bottom: 70 }}
            layout="vertical"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={true}
              vertical={false}
            />
            <XAxis
              type="number"
              domain={[0, 100]}
              tickCount={6}
              stroke={theme === "dark" ? "#9CA3AF" : "#6B7280"}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={150}
              tick={{ fontSize: 12 }}
              stroke={theme === "dark" ? "#9CA3AF" : "#6B7280"}
            />
            <Tooltip />
            <Bar
              dataKey={
                activeMetric === "performance"
                  ? "Performance Score"
                  : "Success Rate"
              }
              fill={`#${systemColor}-500`}
              radius={[0, 4, 4, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Performance Over Time</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={timeSeriesData}
              margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                stroke={theme === "dark" ? "#9CA3AF" : "#6B7280"}
              />
              <YAxis
                domain={[50, 100]}
                tickCount={6}
                stroke={theme === "dark" ? "#9CA3AF" : "#6B7280"}
              />
              <Tooltip />
              <Legend />
              {agents.map((agent, index) => (
                <Line
                  key={agent.id}
                  type="monotone"
                  dataKey={agent.name}
                  name={agent.name
                    .replace(" Agent", "")
                    .replace("SIM - ", "SIM")}
                  stroke={getAgentColor(index)}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg">
          <h3 className="text-lg font-medium mb-3">Top Performing Agents</h3>
          <div className="space-y-3">
            {[...agents]
              .sort((a, b) => b.performanceScore - a.performanceScore)
              .slice(0, 3)
              .map((agent, index) => (
                <div
                  key={agent.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Badge className="h-5 w-5 rounded-full flex items-center justify-center p-0">
                      {index + 1}
                    </Badge>
                    <span className="text-sm">
                      {agent.name
                        .replace(" Agent", "")
                        .replace("SIM - ", "SIM")}
                    </span>
                  </div>
                  <span className="text-sm font-medium">
                    {agent.performanceScore}%
                  </span>
                </div>
              ))}
          </div>
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="text-lg font-medium mb-3">Agents Needing Attention</h3>
          <div className="space-y-3">
            {[...agents]
              .sort((a, b) => a.performanceScore - b.performanceScore)
              .slice(0, 3)
              .map((agent) => (
                <div
                  key={agent.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="bg-red-500/10 text-red-500 h-5 w-5 rounded-full flex items-center justify-center p-0"
                    >
                      !
                    </Badge>
                    <span className="text-sm">
                      {agent.name
                        .replace(" Agent", "")
                        .replace("SIM - ", "SIM")}
                    </span>
                  </div>
                  <span className="text-sm font-medium">
                    {agent.performanceScore}%
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemAgentPerformance;
