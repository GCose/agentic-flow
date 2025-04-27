import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { agents } from "@/mock/agents";

const AgentList = () => {
  const [agentData] = useState(agents);

  return (
    <div className="rounded-md border border-slate-800 backdrop-blur-sm">
      <Table>
        <TableHeader>
          <TableRow className="border-slate-800">
            <TableHead className="w-[250px]">Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-left">Clients</TableHead>
            <TableHead className="text-left">Success Rate</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {agentData.map((agent) => (
            <TableRow key={agent.id} className="border-none">
              <TableCell className="font-medium">{agent.name}</TableCell>
              <TableCell>{agent.type}</TableCell>
              <TableCell className="text-left">{agent.clients}</TableCell>
              <TableCell className="text-left">{agent.successRate}%</TableCell>
              <TableCell>{agent.created}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AgentList;
