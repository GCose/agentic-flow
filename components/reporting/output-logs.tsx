import { useState } from "react";
import { Search, Filter } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const logs = [
  {
    id: "1",
    agent: "Customer Support Assistant",
    client: "Acme Corp",
    timestamp: "2023-07-15 14:32:45",
    message:
      "Successfully resolved customer inquiry about product return policy.",
    type: "success",
  },
  {
    id: "2",
    agent: "Data Analysis Agent",
    client: "TechStart Inc",
    timestamp: "2023-07-15 14:28:12",
    message: "Generated quarterly report with sales projections.",
    type: "success",
  },
  {
    id: "3",
    agent: "Content Generator",
    client: "Marketing Team",
    timestamp: "2023-07-15 14:15:33",
    message:
      "Failed to generate social media post due to content policy violation.",
    type: "error",
  },
  {
    id: "4",
    agent: "Meeting Scheduler",
    client: "Executive Office",
    timestamp: "2023-07-15 13:55:21",
    message: "Rescheduled meeting with stakeholders for next Tuesday.",
    type: "success",
  },
  {
    id: "5",
    agent: "Code Assistant",
    client: "Dev Team",
    timestamp: "2023-07-15 13:42:09",
    message: "Optimized database query, reducing execution time by 45%.",
    type: "success",
  },
  {
    id: "6",
    agent: "Customer Support Assistant",
    client: "Global Services Ltd",
    timestamp: "2023-07-15 13:30:55",
    message: "Escalated complex billing issue to human support team.",
    type: "warning",
  },
  {
    id: "7",
    agent: "Data Analysis Agent",
    client: "Future Tech",
    timestamp: "2023-07-15 13:22:18",
    message: "Warning: Incomplete data set detected. Results may be partial.",
    type: "warning",
  },
];

const OutputLogs = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLogs = logs.filter(
    (log) =>
      log.agent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="col-span-1 border bg-transparent">
      <CardHeader>
        <CardTitle>Output Logs</CardTitle>
        <CardDescription>Recent outputs from your AI agents</CardDescription>
        <div className="flex items-center gap-2 pt-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {filteredLogs.map((log) => (
              <div key={log.id} className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{log.agent}</div>
                  <Badge
                    variant={
                      log.type === "success"
                        ? "default"
                        : log.type === "error"
                        ? "destructive"
                        : "outline"
                    }
                  >
                    {log.type}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Client: {log.client}
                </div>
                <div className="mt-2 text-sm">{log.message}</div>
                <div className="mt-2 text-xs text-muted-foreground">
                  {log.timestamp}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default OutputLogs;
