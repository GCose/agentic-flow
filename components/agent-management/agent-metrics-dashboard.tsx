// src/components/agent-management/agent-metrics-dashboard.tsx
import { useState, useEffect } from "react";
import {
  Brain,
  Zap,
  CheckSquare,
  AlertCircle,
  TrendingUp,
  Cpu,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

interface PerformanceData {
  hour: number;
  performance: number;
  tasks: number;
}

interface TaskDistribution {
  time: string;
  value: number;
}

const AgentMetricsDashboard = () => {
  const [metrics, setMetrics] = useState({
    totalAgents: 44,
    activeAgents: 41,
    tasksCompleted: 1842,
    errorRate: 4.3,
  });

  const [performanceHistory, setPerformanceHistory] = useState<
    PerformanceData[]
  >([]);

  const [taskDistribution, setTaskDistribution] = useState<TaskDistribution[]>(
    []
  );

  // Simulate real-time metric updates
  useEffect(() => {
    // Initialize history data
    const initialPerformance = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      performance: 90 + Math.random() * 8,
      tasks: Math.floor(Math.random() * 100) + 50,
    }));
    setPerformanceHistory(initialPerformance);

    const initialTaskDist = [
      { time: "00:00", value: Math.floor(Math.random() * 50) + 20 },
      { time: "04:00", value: Math.floor(Math.random() * 40) + 15 },
      { time: "08:00", value: Math.floor(Math.random() * 100) + 50 },
      { time: "12:00", value: Math.floor(Math.random() * 150) + 100 },
      { time: "16:00", value: Math.floor(Math.random() * 130) + 80 },
      { time: "20:00", value: Math.floor(Math.random() * 70) + 40 },
      { time: "23:59", value: Math.floor(Math.random() * 40) + 20 },
    ];
    setTaskDistribution(initialTaskDist);

    // Update metrics every few seconds
    const interval = setInterval(() => {
      // Randomly adjust metrics to simulate real-time changes
      setMetrics((prev) => ({
        totalAgents: prev.totalAgents,
        activeAgents: Math.min(
          prev.totalAgents,
          Math.max(
            prev.activeAgents +
              (Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0),
            prev.totalAgents - 5
          )
        ),
        tasksCompleted: prev.tasksCompleted + Math.floor(Math.random() * 5),
        errorRate: parseFloat(
          (
            prev.errorRate +
            (Math.random() > 0.7 ? (Math.random() > 0.5 ? 0.1 : -0.1) : 0)
          ).toFixed(1)
        ),
      }));

      // Update performance history
      setPerformanceHistory((prev) => {
        const newData = [...prev];
        const lastHour = newData[newData.length - 1].hour;
        const nextHour = (lastHour + 1) % 24;

        // Shift data and add new point
        newData.shift();
        newData.push({
          hour: nextHour,
          performance: Math.min(
            100,
            Math.max(85, 94 + (Math.random() * 6 - 3))
          ),
          tasks: Math.floor(Math.random() * 100) + 50,
        });

        return newData;
      });

      // Update task distribution
      setTaskDistribution((prev) => {
        return prev.map((item) => ({
          ...item,
          value: Math.max(10, item.value + (Math.random() * 10 - 5)),
        }));
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-800 hover:-translate-y-1 duration-300 bg-transparent backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-row items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Total Agents
              </p>
              <Brain className="h-6 w-6 text-blue-500" />
            </div>
            <div className="text-2xl font-bold mt-2">{metrics.totalAgents}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all systems
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-800 hover:-translate-y-1 duration-300 bg-transparent backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-row items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Active Agents
              </p>
              <Zap className="h-6 w-6 text-green-500" />
            </div>
            <div className="text-2xl font-bold mt-2">
              {metrics.activeAgents}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((metrics.activeAgents / metrics.totalAgents) * 100)}%
              operational
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-800 hover:-translate-y-1 duration-300 bg-transparent backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-row items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Tasks Completed
              </p>
              <CheckSquare className="h-6 w-6 text-purple-500" />
            </div>
            <div className="text-2xl font-bold mt-2">
              {metrics.tasksCompleted}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Last 7 days</p>
          </CardContent>
        </Card>

        <Card className="border-slate-800 hover:-translate-y-1 duration-300 bg-transparent backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-row items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Error Rate
              </p>
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
            <div className="text-2xl font-bold mt-2">{metrics.errorRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Avg. across all systems
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-slate-800 bg-transparent backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium">System Performance</h3>
                <p className="text-sm text-muted-foreground">24-hour trend</p>
              </div>
              <TrendingUp className="h-5 w-5 text-blue-500" />
            </div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={performanceHistory}
                  margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis
                    dataKey="hour"
                    tickFormatter={(hour) => `${hour}:00`}
                    stroke="#6b7280"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    domain={[80, 100]}
                    stroke="#6b7280"
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      borderRadius: "0.375rem",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="performance"
                    stroke="#4ade80"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-transparent backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium">Task Distribution</h3>
                <p className="text-sm text-muted-foreground">
                  24-hour activity
                </p>
              </div>
              <Cpu className="h-5 w-5 text-purple-500" />
            </div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={taskDistribution}
                  margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis
                    dataKey="time"
                    stroke="#6b7280"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      borderRadius: "0.375rem",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.2}
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgentMetricsDashboard;
