import React, { useState } from "react";
import {
  Search,
  MoreHorizontal,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Clock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Agent {
  id: string;
  name: string;
  description: string;
  status: "active" | "maintenance" | "offline" | "error";
  performanceScore: number;
  successRate: number;
  activeSince: string;
  lastActivity: string;
}

interface SystemAgentsListProps {
  agents: Agent[];
  systemColor: string;
}

const SystemAgentsList: React.FC<SystemAgentsListProps> = ({
  agents,
  systemColor,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter agents based on search term
  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <Card className="border bg-transparent">
      <CardHeader>
        <CardTitle>Agent Inventory</CardTitle>
        <CardDescription>
          All agents in this system and their current status
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
        <div className="space-y-6">
          {filteredAgents.length > 0 ? (
            filteredAgents.map((agent) => (
              <div
                key={agent.id}
                className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg border bg-transparent hover:bg-white/5 transition-colors"
              >
                <div className="sm:w-1/3">
                  <h3 className="font-medium text-base">{agent.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {agent.description}
                  </p>
                </div>

                <div className="flex-1 flex flex-col xs:flex-row xs:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-muted-foreground">
                        Performance
                      </span>
                      <span className="text-xs font-medium">
                        {agent.performanceScore}%
                      </span>
                    </div>
                    <Progress
                      value={agent.performanceScore}
                      className="h-2"
                      indicatorClassName={`bg-${systemColor}-500`}
                    />
                  </div>

                  <div className="flex flex-col xs:items-center gap-1">
                    <div className="flex items-center gap-2">
                      {getStatusBadge(agent.status)}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Last active: {agent.lastActivity}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>View Logs</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {agent.status === "active" ? (
                        <DropdownMenuItem>Pause Agent</DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem>Activate Agent</DropdownMenuItem>
                      )}
                      <DropdownMenuItem>Configure Agent</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Reset Agent</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center py-8">
              <p className="text-muted-foreground">No agents found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemAgentsList;
