import { useState } from "react";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Play,
  Pause,
  Copy,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { agents } from "@/mock/agents";

const AgentList = () => {
  const [agentData, setAgentData] = useState(agents);

  const toggleAgentStatus = (id: string) => {
    setAgentData((currentAgentData) =>
      currentAgentData.map((agent) => {
        if (agent.id === id) {
          return {
            ...agent,
            status: agent.status === "active" ? "inactive" : "active",
          };
        }
        return agent;
      })
    );
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-left">Clients</TableHead>
            <TableHead className="text-left">Success Rate</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-center">Active</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {agentData.map((agent) => (
            <TableRow key={agent.id}>
              <TableCell className="font-medium">{agent.name}</TableCell>
              <TableCell>{agent.type}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    agent.status === "active"
                      ? "default"
                      : agent.status === "inactive"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {agent.status}
                </Badge>
              </TableCell>
              <TableCell className="text-left">{agent.clients}</TableCell>
              <TableCell className="text-left">{agent.successRate}%</TableCell>
              <TableCell>{agent.created}</TableCell>
              <TableCell className="text-center">
                <Switch
                  checked={agent.status === "active"}
                  onCheckedChange={() => toggleAgentStatus(agent.id)}
                />
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <Pencil className="mr-2 h-4 w-4" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="mr-2 h-4 w-4" />
                      <span>Duplicate</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      {agent.status === "active" ? (
                        <>
                          <Pause className="mr-2 h-4 w-4" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          <span>Activate</span>
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AgentList;
