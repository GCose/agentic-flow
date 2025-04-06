import { useTheme } from "next-themes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const performanceData = [
  {
    name: "Mon",
    success: 95,
    error: 5,
    latency: 1.2,
  },
  {
    name: "Tue",
    success: 93,
    error: 7,
    latency: 1.3,
  },
  {
    name: "Wed",
    success: 98,
    error: 2,
    latency: 1.1,
  },
  {
    name: "Thu",
    success: 96,
    error: 4,
    latency: 1.2,
  },
  {
    name: "Fri",
    success: 94,
    error: 6,
    latency: 1.4,
  },
  {
    name: "Sat",
    success: 97,
    error: 3,
    latency: 1.0,
  },
  {
    name: "Sun",
    success: 99,
    error: 1,
    latency: 0.9,
  },
];

const PerformanceMetrics = () => {
  const { theme } = useTheme();

  return (
    <Card className="border bg-transparent">
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
        <CardDescription>
          View performance metrics for your AI agents
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="success-rate">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/30">
            <TabsTrigger value="success-rate">Success Rate</TabsTrigger>
            <TabsTrigger value="error-rate">Error Rate</TabsTrigger>
            <TabsTrigger value="latency">Response Time</TabsTrigger>
          </TabsList>
          <TabsContent value="success-rate" className="pt-4">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
                    borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="success"
                  stroke="#10b981"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="error-rate" className="pt-4">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
                    borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="error"
                  stroke="#ef4444"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="latency" className="pt-4">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
                    borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
                  }}
                />
                <Legend />
                <Bar dataKey="latency" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PerformanceMetrics;
