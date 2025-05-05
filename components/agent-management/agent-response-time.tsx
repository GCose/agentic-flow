import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";
import { Agent } from "@/types/agent-systems";

interface AgentResponseTimesProps {
  agents: Agent[];
  systemColor: string;
}

interface ResponseData {
  name: string;
  responseTime: number;
  status: string;
}

interface ResponseTimeHistory {
  hour: string;
  responseTime: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}

const AgentResponseTimes: React.FC<AgentResponseTimesProps> = ({
  agents,
  systemColor,
}) => {
  const [responseData, setResponseData] = useState<ResponseData[]>([]);
  const [averageTime, setAverageTime] = useState<number>(0);

  const [responseTimeHistory, setResponseTimeHistory] = useState<
    ResponseTimeHistory[]
  >([]);

  useEffect(() => {
    // Format the agents data for the bar chart
    const formattedData = agents.map((agent) => ({
      name: agent.name.replace(" Agent", ""),
      responseTime: agent.responseTime,
      status: agent.status,
    }));

    setResponseData(formattedData);

    // Calculate average response time
    const total = agents.reduce((sum, agent) => sum + agent.responseTime, 0);
    setAverageTime(Math.round(total / agents.length));

    // Generate mock historical data
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const historicalData = hours.map((hour) => {
      const baseTime = Math.floor(Math.random() * 300) + 500;
      return {
        hour: `${hour}:00`,
        responseTime: baseTime + (hour >= 9 && hour <= 17 ? 100 : 0), // Simulated higher times during work hours
      };
    });

    setResponseTimeHistory(historicalData);

    // Set up an interval to simulate real-time updates
    const interval = setInterval(() => {
      setResponseData((prev) => {
        return prev.map((item) => ({
          ...item,
          responseTime: Math.max(
            100,
            item.responseTime + (Math.random() * 100 - 50)
          ),
        }));
      });

      // Update average
      const newTotal = responseData.reduce(
        (sum, item) => sum + item.responseTime,
        0
      );
      setAverageTime(Math.round(newTotal / responseData.length));

      // Update history for the current hour
      const currentHour = new Date().getHours();
      setResponseTimeHistory((prev) => {
        return prev.map((item, index) => {
          if (index === currentHour) {
            return {
              ...item,
              responseTime: Math.max(
                100,
                item.responseTime + (Math.random() * 50 - 25)
              ),
            };
          }
          return item;
        });
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [agents, responseData]);

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 p-3 rounded-md border border-slate-700 shadow-lg">
          <p className="font-medium mb-1">{label}</p>
          <p className="text-sm text-muted-foreground">
            Response Time:{" "}
            <span className="text-blue-400">
              {payload[0].value.toFixed(0)}ms
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Get bar color based on response time
  const getBarColor = (responseTime: number) => {
    if (responseTime < 500) return "#4ade80"; // Good - green
    if (responseTime < 800) return "#facc15"; // Warning - yellow
    return "#f87171"; // Slow - red
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/30 rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground">Average Response Time</p>
          <p className="text-2xl font-bold mt-1">{averageTime} ms</p>
        </div>
        <div className="bg-slate-800/30 rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground">Fastest Agent</p>
          <p className="text-2xl font-bold mt-1">
            {Math.min(...responseData.map((d) => d.responseTime)).toFixed(0)} ms
          </p>
        </div>
        <div className="bg-slate-800/30 rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground">Slowest Agent</p>
          <p className="text-2xl font-bold mt-1">
            {Math.max(...responseData.map((d) => d.responseTime)).toFixed(0)} ms
          </p>
        </div>
      </div>

      <div className="text-sm text-muted-foreground mb-2">
        Response time for each agent in milliseconds. Lower is better. The
        dashed line represents the average response time.
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={responseData.sort((a, b) => a.responseTime - b.responseTime)}
            margin={{ top: 10, right: 30, left: 20, bottom: 70 }}
            layout="vertical"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={true}
              vertical={false}
              stroke="#1e293b"
            />
            <XAxis
              type="number"
              domain={[0, "dataMax"]}
              stroke="#6b7280"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              dataKey="name"
              type="category"
              width={150}
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              x={averageTime}
              stroke="#8b5cf6"
              strokeDasharray="3 3"
              label={{
                value: `Avg: ${averageTime}ms`,
                fill: "#8b5cf6",
                fontSize: 12,
                position: "insideRight",
              }}
            />
            <Bar dataKey="responseTime">
              {responseData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getBarColor(entry.responseTime)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">
          24-Hour Response Time Trend
        </h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={responseTimeHistory}
              margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="hour"
                stroke="#6b7280"
                tick={{ fontSize: 10 }}
                interval={1}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="responseTime"
                fill={`#${systemColor}-500`}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AgentResponseTimes;
