// src/components/agent-management/agent-directory.tsx
import { useState } from "react";
import {
  Search,
  CheckCircle,
  AlertTriangle,
  Clock,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Agent } from "@/types/agent-systems";

interface AgentDirectoryProps {
  agents: Agent[];
  systemColor: string;
}

const AgentDirectory: React.FC<AgentDirectoryProps> = ({
  agents,
  systemColor,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  // Filter agents based on search term
  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedAgentData = selectedAgent
    ? agents.find((a) => a.id === selectedAgent)
    : null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge
            variant="outline"
            className="bg-green-500/10 text-green-500 flex items-center gap-1"
          >
            <CheckCircle className="h-3 w-3" />
            Active
          </Badge>
        );
      case "maintenance":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-500/10 text-yellow-500 flex items-center gap-1"
          >
            <AlertTriangle className="h-3 w-3" />
            Maintenance
          </Badge>
        );
      case "offline":
        return (
          <Badge
            variant="outline"
            className="bg-slate-500/10 text-slate-500 flex items-center gap-1"
          >
            <Clock className="h-3 w-3" />
            Offline
          </Badge>
        );
      case "error":
        return (
          <Badge
            variant="outline"
            className="bg-red-500/10 text-red-500 flex items-center gap-1"
          >
            <AlertCircle className="h-3 w-3" />
            Error
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border bg-transparent">
        <CardHeader>
          <CardTitle>Agent Directory</CardTitle>
          <CardDescription>
            All agents in the{" "}
            {systemColor === "blue"
              ? "Content"
              : systemColor === "purple"
              ? "LeadGen"
              : systemColor === "green"
              ? "Sales"
              : "Onboarding"}{" "}
            system
          </CardDescription>
          <div className="flex items-center pt-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search agents..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAgents.length > 0 ? (
              filteredAgents.map((agent) => (
                <div
                  key={agent.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all
                               ${
                                 selectedAgent === agent.id
                                   ? `border-${systemColor}-500 bg-${systemColor}-500/10`
                                   : "border-slate-800 bg-slate-900/30 hover:bg-slate-800/30"
                               }`}
                  onClick={() =>
                    setSelectedAgent(
                      selectedAgent === agent.id ? null : agent.id
                    )
                  }
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-base">
                      {agent.name.replace(" Agent", "")}
                    </h3>
                    {getStatusBadge(agent.status)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {agent.description}
                  </p>

                  <div className="mt-3 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Success Rate:
                      </span>
                      <span className="font-medium">
                        {agent.successRate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-muted-foreground">
                        Response Time:
                      </span>
                      <span className="font-medium">
                        {agent.responseTime}ms
                      </span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-muted-foreground">
                        Last Active:
                      </span>
                      <span className="font-medium">{agent.lastActivity}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 flex justify-center items-center py-8">
                <p className="text-muted-foreground">No agents found</p>
              </div>
            )}
          </div>

          {/* Selected Agent Details */}
          {selectedAgentData && (
            <Card
              className={`mt-6 border-${systemColor}-500 bg-${systemColor}-500/5`}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{selectedAgentData.name}</span>
                  {getStatusBadge(selectedAgentData.status)}
                </CardTitle>
                <CardDescription>
                  {selectedAgentData.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium uppercase text-muted-foreground mb-3">
                      Performance Metrics
                    </h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg bg-slate-800/50">
                          <div className="text-xs text-muted-foreground">
                            Success Rate
                          </div>
                          <div className="text-xl font-bold mt-1">
                            {selectedAgentData.successRate.toFixed(1)}%
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-slate-800/50">
                          <div className="text-xs text-muted-foreground">
                            Response Time
                          </div>
                          <div className="text-xl font-bold mt-1">
                            {selectedAgentData.responseTime}ms
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-3 rounded-lg bg-slate-800/50">
                          <div className="text-xs text-muted-foreground">
                            Tasks Completed
                          </div>
                          <div className="text-xl font-bold mt-1">
                            {selectedAgentData.taskStats.completed}
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-slate-800/50">
                          <div className="text-xs text-muted-foreground">
                            In Progress
                          </div>
                          <div className="text-xl font-bold mt-1">
                            {selectedAgentData.taskStats.inProgress}
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-slate-800/50">
                          <div className="text-xs text-muted-foreground">
                            Failed
                          </div>
                          <div className="text-xl font-bold mt-1">
                            {selectedAgentData.taskStats.failed}
                          </div>
                        </div>
                      </div>
                    </div>

                    <h4 className="text-sm font-medium uppercase text-muted-foreground mt-6 mb-3">
                      General Information
                    </h4>
                    <div className="text-sm">
                      <div className="flex justify-between py-2 border-b border-slate-800">
                        <span className="text-muted-foreground">
                          Active Since
                        </span>
                        <span>{selectedAgentData.activeSince}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-800">
                        <span className="text-muted-foreground">
                          Last Activity
                        </span>
                        <span>{selectedAgentData.lastActivity}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-800">
                        <span className="text-muted-foreground">Agent ID</span>
                        <span className="font-mono text-xs">
                          {selectedAgentData.id}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium uppercase text-muted-foreground mb-3">
                      Error Types
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(selectedAgentData.errorTypes).length >
                      0 ? (
                        Object.entries(selectedAgentData.errorTypes)
                          .sort(([, a], [, b]) => b - a)
                          .map(([type, count]) => (
                            <div
                              key={type}
                              className="flex justify-between items-center p-2 rounded-lg bg-slate-800/50"
                            >
                              <span className="text-sm">{type}</span>
                              <Badge
                                variant="outline"
                                className="bg-red-500/10 text-red-500"
                              >
                                {count}
                              </Badge>
                            </div>
                          ))
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No errors recorded
                        </p>
                      )}
                    </div>

                    <h4 className="text-sm font-medium uppercase text-muted-foreground mt-6 mb-3">
                      Resource Usage
                    </h4>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            CPU Usage
                          </span>
                          <span>
                            {selectedAgentData.resourceUsage.cpu.toFixed(1)}%
                          </span>
                        </div>
                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-2 bg-${systemColor}-500 rounded-full`}
                            style={{
                              width: `${selectedAgentData.resourceUsage.cpu}%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Memory Usage
                          </span>
                          <span>
                            {selectedAgentData.resourceUsage.memory.toFixed(1)}%
                          </span>
                        </div>
                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-2 bg-${systemColor}-500 rounded-full`}
                            style={{
                              width: `${selectedAgentData.resourceUsage.memory}%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Token Usage
                          </span>
                          <span>
                            {selectedAgentData.resourceUsage.tokens.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentDirectory;
