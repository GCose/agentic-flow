import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Scatter,
  ScatterChart,
  ZAxis,
} from "recharts";
import { Agent } from "@/types/agent-systems";

interface AgentTaskDistributionProps {
  agents: Agent[];
  systemColor: string;
}

const AgentTaskDistribution: React.FC<AgentTaskDistributionProps> = ({
  agents,
  systemColor,
}) => {
  const [taskStatusData, setTaskStatusData] = useState<
    Array<{ name: string; value: number }>
  >([]);
  const [agentLoadData, setAgentLoadData] = useState<
    Array<{
      name: string;
      completed: number;
      inProgress: number;
      failed: number;
    }>
  >([]);
  const [taskTypeData, setTaskTypeData] = useState<
    Array<{ name: string; value: number }>
  >([]);
  const [taskMatrix, setTaskMatrix] = useState<
    Array<{ name: string; load: number; efficiency: number; tasks: number }>
  >([]);

  useEffect(() => {
    // Generate task status data
    const totalCompleted = agents.reduce(
      (sum, agent) => sum + agent.taskStats.completed,
      0
    );
    const totalInProgress = agents.reduce(
      (sum, agent) => sum + agent.taskStats.inProgress,
      0
    );
    const totalFailed = agents.reduce(
      (sum, agent) => sum + agent.taskStats.failed,
      0
    );

    setTaskStatusData([
      { name: "Completed", value: totalCompleted },
      { name: "In Progress", value: totalInProgress },
      { name: "Failed", value: totalFailed },
    ]);

    // Generate agent load data
    const loadData = agents
      .filter((agent) => agent.taskStats.completed > 0) // Only show agents with tasks
      .map((agent) => ({
        name: agent.name.replace(" Agent", ""),
        completed: agent.taskStats.completed,
        inProgress: agent.taskStats.inProgress,
        failed: agent.taskStats.failed,
      }))
      .sort(
        (a, b) =>
          b.completed +
          b.inProgress +
          b.failed -
          (a.completed + a.inProgress + a.failed)
      )
      .slice(0, 8); // Take top 8 for readability

    setAgentLoadData(loadData);

    // Generate task type distribution data
    // In a real app, this would come from the API
    const taskTypes = [
      {
        name: "Content Creation",
        value: Math.floor(Math.random() * 500) + 300,
      },
      { name: "Data Processing", value: Math.floor(Math.random() * 400) + 200 },
      { name: "Analysis", value: Math.floor(Math.random() * 300) + 150 },
      {
        name: "Response Generation",
        value: Math.floor(Math.random() * 350) + 180,
      },
      { name: "Monitoring", value: Math.floor(Math.random() * 250) + 100 },
    ];

    setTaskTypeData(taskTypes);

    // Generate efficiency matrix data
    const matrixData = agents.map((agent) => {
      const totalTasks =
        agent.taskStats.completed +
        agent.taskStats.failed +
        agent.taskStats.inProgress;
      const efficiency = (agent.taskStats.completed / (totalTasks || 1)) * 100;
      return {
        name: agent.name.replace(" Agent", ""),
        load: totalTasks,
        efficiency: efficiency,
        tasks: totalTasks,
      };
    });

    setTaskMatrix(matrixData);

    // Simulate real-time updates
    const interval = setInterval(() => {
      // Update task status
      setTaskStatusData((prev) => {
        const newData = [...prev];
        // Randomly update one of the values
        const randomIndex = Math.floor(Math.random() * newData.length);

        if (randomIndex === 0) {
          // Completed tasks increase
          newData[randomIndex].value += Math.floor(Math.random() * 5) + 1;
        } else if (randomIndex === 1) {
          // In progress tasks fluctuate
          newData[randomIndex].value = Math.max(
            1,
            newData[randomIndex].value + (Math.random() > 0.5 ? 1 : -1)
          );
        } else {
          // Failed tasks increase occasionally
          if (Math.random() > 0.7) {
            newData[randomIndex].value += 1;
          }
        }

        return newData;
      });

      // Update agent load data
      setAgentLoadData((prev) => {
        return prev.map((item) => ({
          ...item,
          completed: item.completed + Math.floor(Math.random() * 3),
          inProgress: Math.max(
            0,
            item.inProgress + (Math.random() > 0.5 ? 1 : -1)
          ),
          failed: item.failed + (Math.random() > 0.8 ? 1 : 0),
        }));
      });

      // Update task types occasionally
      if (Math.random() > 0.7) {
        setTaskTypeData((prev) => {
          return prev.map((item) => ({
            ...item,
            value: item.value + Math.floor(Math.random() * 5),
          }));
        });
      }

      // Update task matrix
      setTaskMatrix((prev) => {
        return prev.map((item) => {
          const newLoad = item.load + Math.floor(Math.random() * 3);
          const randomEfficiency = item.efficiency + (Math.random() * 2 - 1);
          return {
            ...item,
            load: newLoad,
            efficiency: Math.min(100, Math.max(70, randomEfficiency)),
            tasks: newLoad,
          };
        });
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [agents]);

  // Custom tooltips
  const StatusTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: { payload: { name: string; value: number } }[];
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const total = taskStatusData.reduce((sum, item) => sum + item.value, 0);
      const percentage = ((data.value / total) * 100).toFixed(1);

      return (
        <div className="bg-slate-800 p-3 rounded-md border border-slate-700 shadow-lg">
          <p className="font-medium mb-1">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            Count: <span className="text-blue-400">{data.value}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Percentage: <span className="text-blue-400">{percentage}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  interface LoadTooltipProps {
    active?: boolean;
    payload?: Array<{
      value: number;
    }>;
    label?: string;
  }

  const LoadTooltip = ({ active, payload, label }: LoadTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 p-3 rounded-md border border-slate-700 shadow-lg">
          <p className="font-medium mb-1">{label}</p>
          <p className="text-sm text-muted-foreground">
            Completed:{" "}
            <span className="text-green-400">{payload[0].value}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            In Progress:{" "}
            <span className="text-blue-400">{payload[1].value}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Failed: <span className="text-red-400">{payload[2].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const MatrixTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: { payload: { name: string; load: number; efficiency: number } }[];
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-800 p-3 rounded-md border border-slate-700 shadow-lg">
          <p className="font-medium mb-1">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            Task Load: <span className="text-blue-400">{data.load}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Efficiency:{" "}
            <span className="text-green-400">
              {data.efficiency.toFixed(1)}%
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  const COLORS = ["#4ade80", "#3b82f6", "#ef4444"];
  const TYPE_COLORS = ["#8b5cf6", "#ec4899", "#f59e0b", "#06b6d4", "#10b981"];

  return (
    <div className="space-y-8">
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/30 rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground">Total Tasks</p>
          <p className="text-2xl font-bold mt-1">
            {taskStatusData.reduce((sum, item) => sum + item.value, 0)}
          </p>
        </div>
        <div className="bg-slate-800/30 rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground">Completion Rate</p>
          <p className="text-2xl font-bold mt-1 text-green-500">
            {taskStatusData.length
              ? (
                  (taskStatusData[0].value /
                    taskStatusData.reduce((sum, item) => sum + item.value, 0)) *
                  100
                ).toFixed(1) + "%"
              : "0%"}
          </p>
        </div>
        <div className="bg-slate-800/30 rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground">Busiest Agent</p>
          <p className="text-lg font-bold mt-1 truncate">
            {agentLoadData.length > 0 ? agentLoadData[0].name : "None"}
          </p>
        </div>
      </div> */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Task Status Distribution */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Task Status Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskStatusData}
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
                  {taskStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<StatusTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Agent Task Load */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Agent Task Load</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={agentLoadData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#6b7280" />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={120}
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                />
                <Tooltip content={<LoadTooltip />} />
                <Bar dataKey="completed" stackId="a" fill="#4ade80" />
                <Bar dataKey="inProgress" stackId="a" fill="#3b82f6" />
                <Bar dataKey="failed" stackId="a" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Task Type Distribution */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Task Type Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskTypeData}
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
                  {taskTypeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={TYPE_COLORS[index % TYPE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<StatusTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Efficiency Matrix */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Efficiency vs Load Matrix</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  type="number"
                  dataKey="load"
                  name="Task Load"
                  stroke="#6b7280"
                  label={{
                    value: "Task Load",
                    position: "bottom",
                    offset: 0,
                    fill: "#6b7280",
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="efficiency"
                  name="Efficiency"
                  unit="%"
                  domain={[60, 100]}
                  stroke="#6b7280"
                  label={{
                    value: "Efficiency (%)",
                    angle: -90,
                    position: "left",
                    fill: "#6b7280",
                  }}
                />
                <ZAxis
                  type="number"
                  dataKey="tasks"
                  range={[60, 400]}
                  name="Tasks"
                />
                <Tooltip content={<MatrixTooltip />} />
                <Scatter
                  name="Agents"
                  data={taskMatrix}
                  fill={`#${systemColor}-500`}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentTaskDistribution;
