import { useState } from "react";
import { Search, MoreHorizontal, ArrowUpDown, FileText } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/router";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WarmLead } from "@/types/leads";

// Mock data for warm leads
const generateWarmLeads = (): (WarmLead & { report?: string })[] => {
  return [
    {
      id: "wl-1",
      company: "Acme Inc.",
      leadScore: 87,
      strategy: "Direct outreach",
      salePitch: "ROI-focused solution",
      status: "qualified",
      lastContact: "2025-04-20",
      assignedTo: "John Smith",
      createdAt: "2025-04-15",
      report: "Q1 Sales Report - 95% Conversion Rate",
    },
    {
      id: "wl-2",
      company: "TechCorp",
      leadScore: 92,
      strategy: "Demo + Case study",
      salePitch: "Cost reduction focus",
      status: "contacted",
      lastContact: "2025-04-22",
      assignedTo: "Sarah Johnson",
      createdAt: "2025-04-16",
      report: "Q1 Sales Report - 87% Conversion Rate",
    },
    {
      id: "wl-3",
      company: "Global Services",
      leadScore: 76,
      strategy: "Consultative approach",
      salePitch: "Efficiency improvement",
      status: "new",
      lastContact: "2025-04-19",
      assignedTo: "Michael Brown",
      createdAt: "2025-04-14",
      report: "Monthly Sales Report - 72% Conversion Rate",
    },
    {
      id: "wl-4",
      company: "Innovative Solutions",
      leadScore: 94,
      strategy: "Product demo",
      salePitch: "Competitive advantage",
      status: "qualified",
      lastContact: "2025-04-21",
      assignedTo: "Emily Davis",
      createdAt: "2025-04-18",
      report: "Q1 Sales Report - 91% Conversion Rate",
    },
    {
      id: "wl-5",
      company: "Future Tech",
      leadScore: 81,
      strategy: "Solution presentation",
      salePitch: "Growth opportunity",
      status: "contacted",
      lastContact: "2025-04-23",
      assignedTo: "David Wilson",
      createdAt: "2025-04-17",
      report: "Monthly Sales Report - 78% Conversion Rate",
    },
  ];
};

const WarmLeads = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof WarmLead>("leadScore");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [warmLeads] = useState<(WarmLead & { report?: string })[]>(
    generateWarmLeads()
  );
  const router = useRouter();

  // Filter leads based on search term
  const filteredLeads = warmLeads.filter(
    (lead) =>
      lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.strategy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.report &&
        lead.report.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Sort leads based on sort field and direction
  const sortedLeads = [...filteredLeads].sort((a, b) => {
    if (typeof a[sortField] === "string" && typeof b[sortField] === "string") {
      const aValue = a[sortField] as string;
      const bValue = b[sortField] as string;
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else {
      const aValue = a[sortField] as number;
      const bValue = b[sortField] as number;
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }
  });

  // Handle sorting when column header is clicked
  const handleSort = (field: keyof WarmLead) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Navigate to lead details page
  const handleViewDetails = (leadId: string) => {
    router.push(`/admin/leadgen-system/lead/${leadId}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-500/10 text-blue-500";
      case "contacted":
        return "bg-yellow-500/10 text-yellow-500";
      case "qualified":
        return "bg-green-500/10 text-green-500";
      case "converted":
        return "bg-purple-500/10 text-purple-500";
      case "lost":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-slate-500/10 text-slate-500";
    }
  };

  return (
    <Card className=" border-slate-800 bg-transparent backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Warm Leads</CardTitle>
        <CardDescription>
          Manage and track leads that have shown interest in your products or
          services
        </CardDescription>

        <div className="flex flex-col sm:flex-row gap-2 pt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              placeholder="Search leads..."
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 bg-transparent border-slate-800"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border-none">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800">
                <TableHead className="w-[180px]">
                  <Button
                    variant="ghost"
                    className="font-medium"
                    onClick={() => handleSort("company")}
                  >
                    Company
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="font-medium"
                    onClick={() => handleSort("leadScore")}
                  >
                    Lead Score
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="hidden lg:table-cell">
                  Sales Report
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  Sales Strategy
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  Sales Pitch
                </TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedLeads.map((lead) => (
                <TableRow
                  key={lead.id}
                  onClick={() => handleViewDetails(lead.id)}
                  className="border-slate-800 hover:bg-white/5 cursor-pointer"
                >
                  <TableCell className="font-medium">{lead.company}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-indigo-500/10 text-indigo-500"
                    >
                      {lead.leadScore}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {lead.report && (
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{lead.report}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {lead.strategy}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {lead.salePitch}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge
                      variant="outline"
                      className={getStatusBadge(lead.status)}
                    >
                      {lead.status.charAt(0).toUpperCase() +
                        lead.status.slice(1)}
                    </Badge>
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
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleViewDetails(lead.id)}
                        >
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Delete Lead
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredLeads.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No leads found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default WarmLeads;
