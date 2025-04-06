import { useTheme } from "next-themes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const errorData = [
  { name: "Content Policy", value: 35, color: "#ef4444" },
  { name: "Authentication", value: 25, color: "#f97316" },
  { name: "Rate Limiting", value: 20, color: "#eab308" },
  { name: "Data Processing", value: 15, color: "#6366f1" },
  { name: "Other", value: 5, color: "#8b5cf6" },
];

const recentErrors = [
  {
    id: "1",
    agent: "Content Generator",
    timestamp: "2023-07-15 14:15:33",
    error:
      "Content Policy Violation: Generated content contains prohibited terms.",
    client: "Marketing Team",
  },
  {
    id: "2",
    agent: "Customer Support Assistant",
    timestamp: "2023-07-15 12:42:18",
    error: "Authentication Error: Failed to authenticate with knowledge base.",
    client: "Acme Corp",
  },
  {
    id: "3",
    agent: "Data Analysis Agent",
    timestamp: "2023-07-15 11:23:05",
    error: "Rate Limiting: API rate limit exceeded for OpenAI service.",
    client: "TechStart Inc",
  },
  {
    id: "4",
    agent: "Code Assistant",
    timestamp: "2023-07-15 10:15:47",
    error: "Data Processing Error: Invalid JSON format in response.",
    client: "Dev Team",
  },
  {
    id: "5",
    agent: "Meeting Scheduler",
    timestamp: "2023-07-15 09:32:21",
    error: "Authentication Error: Calendar API access token expired.",
    client: "Executive Office",
  },
];

const ErrorTracking = () => {
  const { theme } = useTheme();

  return (
    <Card className="border bg-transparent col-span-1">
      <CardHeader>
        <CardTitle>Error Tracking</CardTitle>
        <CardDescription>
          Monitor and analyze errors from your AI agents
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={errorData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {errorData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
                  borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6">
          <h4 className="mb-4 text-sm font-medium">Recent Errors</h4>
          <ScrollArea className="h-[180px] pr-4">
            <div className="space-y-4">
              {recentErrors.map((error) => (
                <div key={error.id} className="rounded-lg border p-3">
                  <div className="font-medium">{error.agent}</div>
                  <div className="text-sm text-muted-foreground">
                    Client: {error.client}
                  </div>
                  <div className="mt-2 text-sm text-destructive">
                    {error.error}
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {error.timestamp}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default ErrorTracking;
