import {
  MoreHorizontal,
  ExternalLink,
  MessageSquare,
  BarChart,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const clients = [
  {
    id: "1",
    name: "Acme Corp",
    status: "active",
    agents: 3,
    interactions: 1245,
    lastActive: "2 minutes ago",
  },
  {
    id: "2",
    name: "TechStart Inc",
    status: "active",
    agents: 2,
    interactions: 876,
    lastActive: "15 minutes ago",
  },
  {
    id: "3",
    name: "Global Services Ltd",
    status: "inactive",
    agents: 1,
    interactions: 432,
    lastActive: "3 days ago",
  },
  {
    id: "4",
    name: "Innovative Solutions",
    status: "active",
    agents: 4,
    interactions: 1893,
    lastActive: "Just now",
  },
  {
    id: "5",
    name: "Future Tech",
    status: "active",
    agents: 2,
    interactions: 765,
    lastActive: "1 hour ago",
  },
];

const ClientList = () => {
  return (
    <Card className="border bg-transparent backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Active Clients</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Client</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Agents</TableHead>
              <TableHead className="text-right">Interactions</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      client.status === "active" ? "default" : "secondary"
                    }
                  >
                    {client.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{client.agents}</TableCell>
                <TableCell className="text-right">
                  {client.interactions}
                </TableCell>
                <TableCell>{client.lastActive}</TableCell>
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
                        <ExternalLink className="mr-2 h-4 w-4" />
                        <span>View Details</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        <span>View Conversations</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <BarChart className="mr-2 h-4 w-4" />
                        <span>View Analytics</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ClientList;
