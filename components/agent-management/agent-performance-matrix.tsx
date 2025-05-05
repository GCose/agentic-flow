import { useState, useEffect } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Agent } from "@/types/agent-systems";

interface AgentPerformanceMatrixProps {
  agents: Agent[];
  systemColor: string;
}

interface TransformedAgentData {
  name: string;
  id: string;
  responseTime: number;
  successRate: number;
  tasks: number;
  status: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: {
    payload: TransformedAgentData;
  }[];
}

const AgentPerformanceMatrix: React.FC<AgentPerformanceMatrixProps> = ({
  agents,
}) => {
  const [data, setData] = useState<TransformedAgentData[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  useEffect(() => {
    // Transform agent data for the scatter plot
    const transformedData = agents.map((agent) => ({
      name: agent.name.replace(" Agent", ""),
      id: agent.id,
      responseTime: agent.responseTime,
      successRate: agent.successRate,
      tasks:
        agent.taskStats.completed +
        agent.taskStats.failed +
        agent.taskStats.inProgress,
      status: agent.status,
    }));

    setData(transformedData);
  }, [agents]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) =>
        prev.map((item) => ({
          ...item,
          responseTime: item.responseTime + (Math.random() * 50 - 25),
          successRate: Math.min(
            100,
            Math.max(70, item.successRate + (Math.random() * 2 - 1))
          ),
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleDotClick = (data: TransformedAgentData) => {
    setSelectedAgent(selectedAgent === data.id ? null : data.id);
  };

  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-800 p-3 rounded-md border border-slate-700 shadow-lg">
          <p className="font-medium mb-1">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            Success Rate:{" "}
            <span className="text-green-400">
              {data.successRate.toFixed(1)}%
            </span>
          </p>
          <p className="text-sm text-muted-foreground">
            Response Time:{" "}
            <span className="text-blue-400">
              {data.responseTime.toFixed(0)}ms
            </span>
          </p>
          <p className="text-sm text-muted-foreground">
            Total Tasks: <span className="text-purple-400">{data.tasks}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Status:{" "}
            <span
              className={`${
                data.status === "active"
                  ? "text-green-400"
                  : data.status === "maintenance"
                  ? "text-yellow-400"
                  : "text-red-400"
              }`}
            >
              {data.status}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "#4ade80";
      case "maintenance":
        return "#facc15";
      case "offline":
        return "#6b7280";
      case "error":
        return "#f87171";
      default:
        return "#6b7280";
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mb-2">
        This matrix plots each agent{"'"}s performance by response time (x-axis)
        and success rate (y-axis). The bubble size represents the number of
        tasks processed, and color indicates status.
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              type="number"
              dataKey="responseTime"
              name="Response Time"
              unit="ms"
              domain={["auto", "auto"]}
              label={{
                value: "Response Time (ms)",
                position: "bottom",
                offset: 0,
              }}
              stroke="#6b7280"
            />
            <YAxis
              type="number"
              dataKey="successRate"
              name="Success Rate"
              unit="%"
              domain={[70, 100]}
              label={{
                value: "Success Rate (%)",
                angle: -90,
                position: "left",
              }}
              stroke="#6b7280"
            />
            <ZAxis
              type="number"
              dataKey="tasks"
              range={[60, 400]}
              name="Tasks"
            />
            <Tooltip content={<CustomTooltip />} />
            <Scatter name="Agents" data={data}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getStatusColor(entry.status)}
                  stroke={
                    selectedAgent === entry.id ? "#ffffff" : "transparent"
                  }
                  strokeWidth={2}
                  onClick={() => handleDotClick(entry)}
                  style={{ cursor: "pointer" }}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center space-x-6">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
          <span className="text-xs text-muted-foreground">Active</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
          <span className="text-xs text-muted-foreground">Maintenance</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-gray-500 mr-2"></div>
          <span className="text-xs text-muted-foreground">Offline</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
          <span className="text-xs text-muted-foreground">Error</span>
        </div>
      </div>

      {selectedAgent && (
        <div className="p-4 border border-slate-700 rounded-lg bg-slate-800/50">
          <h3 className="font-medium mb-2">
            {data.find((a) => a.id === selectedAgent)?.name} Details
          </h3>
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-sm">
                <span className="text-muted-foreground">Success Rate:</span>{" "}
                <span className="font-medium">
                  {data
                    .find((a) => a.id === selectedAgent)
                    ?.successRate.toFixed(1)}
                  %
                </span>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Response Time:</span>{" "}
                <span className="font-medium">
                  {data
                    .find((a) => a.id === selectedAgent)
                    ?.responseTime.toFixed(0)}
                  ms
                </span>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Tasks Processed:</span>{" "}
                <span className="font-medium">
                  {data.find((a) => a.id === selectedAgent)?.tasks}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Status:</span>{" "}
                <span
                  className={`font-medium ${
                    data.find((a) => a.id === selectedAgent)?.status ===
                    "active"
                      ? "text-green-400"
                      : data.find((a) => a.id === selectedAgent)?.status ===
                        "maintenance"
                      ? "text-yellow-400"
                      : "text-red-400"
                  }`}
                >
                  {data.find((a) => a.id === selectedAgent)?.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentPerformanceMatrix;
