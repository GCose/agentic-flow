import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface UsageData {
  time: string;
  usage: number;
}

interface TokenUsage {
  name: string;
  value: number;
}
const SystemHealthMonitor = () => {
  const [cpuUsage, setCpuUsage] = useState<UsageData[]>([]);
  const [memoryUsage, setMemoryUsage] = useState<UsageData[]>([]);

  const [tokenUsage, setTokenUsage] = useState<TokenUsage[]>([]);

  // Generate initial data
  useEffect(() => {
    // Generate time points for the last 60 minutes
    const timePoints = Array.from({ length: 60 }, (_, i) => {
      const date = new Date();
      date.setMinutes(date.getMinutes() - (59 - i));
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    });

    // Initial CPU usage
    const initialCpu = timePoints.map((time) => ({
      time,
      usage: Math.floor(Math.random() * 40) + 20,
    }));
    setCpuUsage(initialCpu);

    // Initial memory usage
    const initialMemory = timePoints.map((time) => ({
      time,
      usage: Math.floor(Math.random() * 30) + 40,
    }));
    setMemoryUsage(initialMemory);

    // Initial token usage distribution
    const initialTokens = [
      {
        name: "Content System",
        value: Math.floor(Math.random() * 5000000) + 1000000,
      },
      {
        name: "LeadGen System",
        value: Math.floor(Math.random() * 4000000) + 800000,
      },
      {
        name: "Sales System",
        value: Math.floor(Math.random() * 3000000) + 500000,
      },
      {
        name: "Onboarding System",
        value: Math.floor(Math.random() * 2000000) + 300000,
      },
    ];
    setTokenUsage(initialTokens);

    // Update data every 5 seconds to simulate real-time monitoring
    const interval = setInterval(() => {
      const now = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      // Update CPU usage
      setCpuUsage((prev) => {
        const newData = [...prev.slice(1)];
        const lastValue = prev[prev.length - 1].usage;
        // Random fluctuation with trend continuation
        const newValue = Math.max(
          5,
          Math.min(95, lastValue + (Math.random() * 10 - 5))
        );
        newData.push({ time: now, usage: newValue });
        return newData;
      });

      // Update memory usage
      setMemoryUsage((prev) => {
        const newData = [...prev.slice(1)];
        const lastValue = prev[prev.length - 1].usage;
        // Memory tends to grow slowly
        const newValue = Math.max(
          10,
          Math.min(90, lastValue + (Math.random() * 4 - 1.5))
        );
        newData.push({ time: now, usage: newValue });
        return newData;
      });

      // Update token usage occasionally
      if (Math.random() > 0.7) {
        setTokenUsage((prev) => {
          return prev.map((item) => ({
            ...item,
            value: item.value + Math.floor(Math.random() * 100000),
          }));
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Custom tooltip
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: { value: number }[];
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 p-3 rounded-md border border-slate-700 shadow-lg">
          <p className="font-medium mb-1">{label}</p>
          <p className="text-sm text-muted-foreground">
            Usage:{" "}
            <span className="text-blue-400">
              {payload[0].value.toFixed(1)}%
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  const TokenTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: { payload: TokenUsage }[];
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-800 p-3 rounded-md border border-slate-700 shadow-lg">
          <p className="font-medium mb-1">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            Tokens:{" "}
            <span className="text-blue-400">{data.value.toLocaleString()}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const COLORS = ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B"];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CPU Usage Chart */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            CPU Utilization
          </h3>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={cpuUsage}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 10 }}
                  stroke="#6b7280"
                  interval="preserveStartEnd"
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 10 }}
                  stroke="#6b7280"
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="usage"
                  stroke="#3B82F6"
                  fill="url(#cpuGradient)"
                  isAnimationActive={false}
                />
                <defs>
                  <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Memory Usage Chart */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            Memory Utilization
          </h3>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={memoryUsage}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 10 }}
                  stroke="#6b7280"
                  interval="preserveStartEnd"
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 10 }}
                  stroke="#6b7280"
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="usage"
                  stroke="#8B5CF6"
                  fill="url(#memoryGradient)"
                  isAnimationActive={false}
                />
                <defs>
                  <linearGradient
                    id="memoryGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Token Usage Distribution */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">
          Token Usage by System
        </h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={tokenUsage}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {tokenUsage.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<TokenTooltip />} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="text-xs text-center text-muted-foreground">
          Total tokens:{" "}
          {tokenUsage
            .reduce((sum, item) => sum + item.value, 0)
            .toLocaleString()}
        </div>
      </div>

      {/* System Status Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-green-500/10 rounded-lg p-4 text-center">
          <p className="text-xs text-muted-foreground">API Connectivity</p>
          <p className="text-sm font-medium text-green-500 mt-1">Healthy</p>
        </div>
        <div className="bg-green-500/10 rounded-lg p-4 text-center">
          <p className="text-xs text-muted-foreground">Database</p>
          <p className="text-sm font-medium text-green-500 mt-1">Healthy</p>
        </div>
        <div className="bg-green-500/10 rounded-lg p-4 text-center">
          <p className="text-xs text-muted-foreground">Message Queue</p>
          <p className="text-sm font-medium text-green-500 mt-1">Healthy</p>
        </div>
        <div className="bg-yellow-500/10 rounded-lg p-4 text-center">
          <p className="text-xs text-muted-foreground">External Services</p>
          <p className="text-sm font-medium text-yellow-500 mt-1">Degraded</p>
        </div>
      </div>
    </div>
  );
};

export default SystemHealthMonitor;
