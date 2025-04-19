import { useTheme } from "next-themes";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Progress } from "@/components/ui/progress";
import ChartTooltip from "@/components/ui/chart-tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Mock data for agent performance
const agentPerformanceData = [
  {
    name: "Topic Selector Agent",
    performanceScore: 95,
    contentCreated: 42,
    avgSuccess: 98,
    trend: "+2.3%",
    color: "#3B82F6",
  },
  {
    name: "Trend Researcher Agent",
    performanceScore: 92,
    contentCreated: 38,
    avgSuccess: 94,
    trend: "+1.7%",
    color: "#10B981",
  },
  {
    name: "Trend Selector Agent",
    performanceScore: 90,
    contentCreated: 35,
    avgSuccess: 92,
    trend: "+0.5%",
    color: "#F59E0B",
  },
  {
    name: "Content Creator Agent",
    performanceScore: 96,
    contentCreated: 124,
    avgSuccess: 97,
    trend: "+3.1%",
    color: "#8B5CF6",
  },
  {
    name: "Content Optimizer Agent",
    performanceScore: 94,
    contentCreated: 118,
    avgSuccess: 95,
    trend: "+1.2%",
    color: "#EC4899",
  },
  {
    name: "Email Sender Agent",
    performanceScore: 98,
    contentCreated: 36,
    avgSuccess: 99,
    trend: "+0.8%",
    color: "#06B6D4",
  },
  {
    name: "Post-Strategy Agent",
    performanceScore: 91,
    contentCreated: 32,
    avgSuccess: 93,
    trend: "+1.5%",
    color: "#14B8A6",
  },
  {
    name: "Ad Intelligence Agent",
    performanceScore: 93,
    contentCreated: 28,
    avgSuccess: 96,
    trend: "+2.0%",
    color: "#F97316",
  },
  {
    name: "Counter Strategy Agent",
    performanceScore: 89,
    contentCreated: 25,
    avgSuccess: 91,
    trend: "+1.3%",
    color: "#EF4444",
  },
  {
    name: "SIM - Content Intelligence Manager",
    performanceScore: 97,
    contentCreated: 0,
    avgSuccess: 100,
    trend: "+0.4%",
    color: "#6366F1",
  },
];

// Data for performance over time chart
const performanceOverTimeData = [
  {
    name: "Week 1",
    "Content Creator": 92,
    "Content Optimizer": 90,
    "Topic Selector": 93,
  },
  {
    name: "Week 2",
    "Content Creator": 93,
    "Content Optimizer": 91,
    "Topic Selector": 94,
  },
  {
    name: "Week 3",
    "Content Creator": 94,
    "Content Optimizer": 92,
    "Topic Selector": 94,
  },
  {
    name: "Week 4",
    "Content Creator": 95,
    "Content Optimizer": 93,
    "Topic Selector": 95,
  },
  {
    name: "Week 5",
    "Content Creator": 96,
    "Content Optimizer": 94,
    "Topic Selector": 95,
  },
  {
    name: "Week 6",
    "Content Creator": 96,
    "Content Optimizer": 94,
    "Topic Selector": 96,
  },
  {
    name: "Week 7",
    "Content Creator": 97,
    "Content Optimizer": 95,
    "Topic Selector": 96,
  },
  {
    name: "Week 8",
    "Content Creator": 97,
    "Content Optimizer": 95,
    "Topic Selector": 97,
  },
];

// Data for content production
const contentProductionData = agentPerformanceData
  .filter((agent) => agent.contentCreated > 0)
  .map((agent) => ({
    name: agent.name.replace(" Agent", ""),
    value: agent.contentCreated,
    color: agent.color,
  }));

const ContentAgentPerformance = () => {
  const { theme } = useTheme();

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="h-80">
          <h3 className="text-lg font-medium mb-4">Performance Over Time</h3>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart
              data={performanceOverTimeData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                stroke={theme === "dark" ? "#9CA3AF" : "#6B7280"}
              />
              <YAxis
                domain={[85, 100]}
                stroke={theme === "dark" ? "#9CA3AF" : "#6B7280"}
              />
              <Tooltip content={<ChartTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="Content Creator"
                stroke="#8B5CF6"
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="Content Optimizer"
                stroke="#EC4899"
              />
              <Line type="monotone" dataKey="Topic Selector" stroke="#3B82F6" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="h-80">
          <h3 className="text-lg font-medium mb-4">Content Production</h3>
          <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <Pie
                cx="50%"
                cy="50%"
                fill="#8884d8"
                dataKey="value"
                outerRadius={80}
                labelLine={false}
                data={contentProductionData}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {contentProductionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Agent Performance Ranking</h3>
        <div className="space-y-6">
          {agentPerformanceData
            .sort((a, b) => b.performanceScore - a.performanceScore)
            .map((agent, index) => (
              <div key={index} className="flex items-center gap-4">
                <Avatar className="h-9 w-9">
                  <AvatarFallback style={{ backgroundColor: agent.color }}>
                    {agent.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{agent.name}</span>
                    <span className="text-sm font-medium">
                      {agent.performanceScore}%
                    </span>
                  </div>
                  <Progress
                    className="h-1"
                    value={agent.performanceScore}
                    indicatorClassName={`bg-[${agent.color}]`}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Content: {agent.contentCreated}</span>
                    <span>Success Rate: {agent.avgSuccess}%</span>
                    <span className="text-green-500">{agent.trend}</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ContentAgentPerformance;
