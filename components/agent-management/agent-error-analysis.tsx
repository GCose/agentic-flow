// src/components/agent-management/agent-error-analysis.tsx
import { useState, useEffect } from "react";
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
  LineChart,
  Line,
} from "recharts";
import { Agent } from "@/types/agent-systems";

interface AgentErrorAnalysisProps {
  agents: Agent[];
  systemColor: string;
}
interface AgentError {
  name: string;
  errors: number;
  successRate: number;
}

const AgentErrorAnalysis: React.FC<AgentErrorAnalysisProps> = ({ agents }) => {
  const [errorTypes, setErrorTypes] = useState<
    { name: string; value: number }[]
  >([]);

  const [errorByAgent, setErrorByAgent] = useState<AgentError[]>([]);
  const [errorTimeline, setErrorTimeline] = useState<
    { day: string; errors: number }[]
  >([]);

  useEffect(() => {
    // Aggregate error types across all agents
    const errorTypesMap = new Map<string, number>();

    agents.forEach((agent) => {
      Object.entries(agent.errorTypes).forEach(([type, count]) => {
        errorTypesMap.set(type, (errorTypesMap.get(type) || 0) + count);
      });
    });

    // Convert to array for chart
    const errorTypesArray = Array.from(errorTypesMap.entries()).map(
      ([name, value]) => ({ name, value })
    );
    setErrorTypes(errorTypesArray);

    // Prepare error by agent data
    const agentErrors = agents.map((agent) => ({
      name: agent.name.replace(" Agent", ""),
      errors: Object.values(agent.errorTypes).reduce(
        (sum, count) => sum + count,
        0
      ),
      successRate: agent.successRate,
    }));
    setErrorByAgent(agentErrors);

    // Generate error timeline (7 day history)
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const timeline = days.map((day) => {
      // Simulate a pattern where weekdays have more errors than weekends
      const baseErrors = day === "Sat" || day === "Sun" ? 5 : 15;
      return {
        day,
        errors: Math.floor(Math.random() * baseErrors) + baseErrors / 2,
      };
    });
    setErrorTimeline(timeline);

    // Simulate real-time updates
    const interval = setInterval(() => {
      // Randomly update error types
      if (Math.random() > 0.6) {
        setErrorTypes((prev) => {
          const newData = [...prev];
          const randomIndex = Math.floor(Math.random() * newData.length);
          newData[randomIndex] = {
            ...newData[randomIndex],
            value: newData[randomIndex].value + (Math.random() > 0.7 ? 1 : 0),
          };
          return newData;
        });
      }

      // Randomly update agent errors
      if (Math.random() > 0.7) {
        setErrorByAgent((prev) => {
          const newData = [...prev];
          const randomIndices = Array.from({ length: 2 }, () =>
            Math.floor(Math.random() * newData.length)
          );

          randomIndices.forEach((index) => {
            newData[index] = {
              ...newData[index],
              errors: newData[index].errors + (Math.random() > 0.6 ? 1 : 0),
              successRate: Math.max(
                70,
                Math.min(
                  100,
                  newData[index].successRate + (Math.random() * 1 - 0.6)
                )
              ),
            };
          });

          return newData;
        });
      }

      // Update timeline for today
      if (Math.random() > 0.5) {
        const today = new Date().getDay(); // 0 = Sunday, 6 = Saturday
        const todayIndex = today === 0 ? 6 : today - 1; // Convert to our array index

        setErrorTimeline((prev) => {
          const newData = [...prev];
          newData[todayIndex] = {
            ...newData[todayIndex],
            errors: newData[todayIndex].errors + (Math.random() > 0.6 ? 1 : 0),
          };
          return newData;
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [agents]);

  // Custom tooltip components
  const ErrorTypeTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: { name: string; value: number }[];
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 p-3 rounded-md border border-slate-700 shadow-lg">
          <p className="font-medium mb-1">{payload[0].name}</p>
          <p className="text-sm text-muted-foreground">
            Count: <span className="text-red-400">{payload[0].value}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Percentage:{" "}
            <span className="text-red-400">
              {(
                (payload[0].value /
                  errorTypes.reduce((sum, item) => sum + item.value, 0)) *
                100
              ).toFixed(1)}
              %
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  const AgentErrorTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: { value: number; payload: { successRate: number } }[];
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 p-3 rounded-md border border-slate-700 shadow-lg">
          <p className="font-medium mb-1">{label}</p>
          <p className="text-sm text-muted-foreground">
            Errors: <span className="text-red-400">{payload[0].value}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Success Rate:{" "}
            <span className="text-green-400">
              {payload[0].payload.successRate.toFixed(1)}%
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  interface TimelineTooltipProps {
    active?: boolean;
    payload?: { value: number }[];
    label?: string;
  }

  const TimelineTooltip = ({
    active,
    payload,
    label,
  }: TimelineTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 p-3 rounded-md border border-slate-700 shadow-lg">
          <p className="font-medium mb-1">{label}</p>
          <p className="text-sm text-muted-foreground">
            Errors: <span className="text-red-400">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const COLORS = ["#ef4444", "#f97316", "#facc15", "#a78bfa", "#f472b6"];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/30 rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground">Total Errors</p>
          <p className="text-2xl font-bold mt-1 text-red-400">
            {errorTypes.reduce((sum, item) => sum + item.value, 0)}
          </p>
        </div>
        <div className="bg-slate-800/30 rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground">Most Common Error</p>
          <p className="text-lg font-bold mt-1 truncate">
            {errorTypes.length > 0
              ? errorTypes.sort((a, b) => b.value - a.value)[0].name
              : "No errors"}
          </p>
        </div>
        <div className="bg-slate-800/30 rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Agent With Most Errors
          </p>
          <p className="text-lg font-bold mt-1 truncate">
            {errorByAgent.length > 0
              ? errorByAgent.sort((a, b) => b.errors - a.errors)[0].name
              : "None"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Error Types Chart */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Error Type Distribution</h3>
          <div className="h-[300px] flex items-center justify-center">
            {errorTypes.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={errorTypes}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {errorTypes.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<ErrorTypeTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground">No error data available</p>
            )}
          </div>
        </div>

        {/* Errors Per Agent */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Errors By Agent</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={errorByAgent.sort((a, b) => b.errors - a.errors)}
                margin={{ top: 10, right: 30, left: 20, bottom: 70 }}
                layout="vertical"
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={true}
                  vertical={false}
                  stroke="#1e293b"
                />
                <XAxis type="number" stroke="#6b7280" />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={150}
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                />
                <Tooltip content={<AgentErrorTooltip />} />
                <Bar dataKey="errors" fill="#ef4444" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Error Timeline */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Error Trend (Last 7 Days)</h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={errorTimeline}
              margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="day" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip content={<TimelineTooltip />} />
              <Line
                type="monotone"
                dataKey="errors"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ r: 5 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-slate-800/20 rounded-lg p-4">
            <h4 className="text-sm font-medium mb-2">Error Patterns</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                Most errors occur during peak usage hours (10AM-2PM)
              </li>
              <li className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                API timeouts increase when external service load is high
              </li>
              <li className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                Context overflow errors correlate with complex tasks
              </li>
            </ul>
          </div>

          <div className="bg-slate-800/20 rounded-lg p-4">
            <h4 className="text-sm font-medium mb-2">Automated Mitigations</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                SIM dynamically adjusts token limits during peak hours
              </li>
              <li className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                Failed tasks are retried with optimized parameters
              </li>
              <li className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                Load balancing applied to high-demand agents
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentErrorAnalysis;
