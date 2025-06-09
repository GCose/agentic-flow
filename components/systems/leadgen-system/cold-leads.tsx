// components/leadgen-system/cold-leads.tsx
import { useState } from "react";
import { Search, MoreHorizontal, ArrowUpDown, Mail } from "lucide-react";
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
import { ColdLead } from "@/types/leads";

// Mock data for cold leads
const generateColdLeads = (): ColdLead[] => {
  return [
    {
      id: "cl-1",
      company: "Quantum Systems",
      leadScore: 45,
      email: "contact@quantumsystems.com",
      personalized: true,
      outreachStage: "Initial",
      lastOutreach: null,
      status: "new",
      createdAt: "2025-04-15",
    },
    {
      id: "cl-2",
      company: "Peak Innovations",
      leadScore: 63,
      email: "info@peakinnovations.com",
      personalized: true,
      outreachStage: "Follow-up 1",
      lastOutreach: "2025-04-18",
      status: "contacted",
      createdAt: "2025-04-12",
    },
    {
      id: "cl-3",
      company: "Horizon Media",
      leadScore: 38,
      email: "sales@horizonmedia.com",
      personalized: false,
      outreachStage: "Initial",
      lastOutreach: null,
      status: "new",
      createdAt: "2025-04-14",
    },
    {
      id: "cl-4",
      company: "Vertex Analytics",
      leadScore: 71,
      email: "partnerships@vertexanalytics.com",
      personalized: true,
      outreachStage: "Follow-up 2",
      lastOutreach: "2025-04-21",
      status: "contacted",
      createdAt: "2025-04-10",
    },
    {
      id: "cl-5",
      company: "Fusion Technologies",
      leadScore: 52,
      email: "business@fusiontechnologies.com",
      personalized: false,
      outreachStage: "Initial",
      lastOutreach: "2025-04-16",
      status: "contacted",
      createdAt: "2025-04-13",
    },
  ];
};

const ColdLeads = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof ColdLead>("leadScore");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [coldLeads] = useState<ColdLead[]>(generateColdLeads());

  // Filter leads based on search term
  const filteredLeads = coldLeads.filter(
    (lead) =>
      lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase())
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
  const handleSort = (field: keyof ColdLead) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  return (
    <Card className="border border-slate-800 bg-transparent ">
      <CardHeader>
        <CardTitle>Cold Leads</CardTitle>
        <CardDescription>
          Potential leads gathered through research and scraping to initiate
          outreach
        </CardDescription>

        <div className="flex flex-col sm:flex-row gap-2 pt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search cold leads..."
              className="pl-8 bg-transparent border-slate-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button>Scrape New Leads</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border-none">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800">
                <TableHead className="w-[200px]">
                  <Button
                    variant="ghost"
                    className="p-0 font-medium"
                    onClick={() => handleSort("company")}
                  >
                    Company
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="p-0 font-medium"
                    onClick={() => handleSort("leadScore")}
                  >
                    Lead Score
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden sm:table-cell">Stage</TableHead>
                <TableHead className="hidden md:table-cell">
                  Personalized
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedLeads.map((lead) => (
                <TableRow
                  key={lead.id}
                  className="border-slate-800 hover:bg-white/5"
                >
                  <TableCell className="font-medium">{lead.company}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-cyan-500/10 text-cyan-500"
                    >
                      {lead.leadScore}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center">
                      <Mail className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                      {lead.email}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {lead.outreachStage}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant={lead.personalized ? "default" : "outline"}>
                      {lead.personalized ? "Yes" : "No"}
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
                        <DropdownMenuItem>Send Outreach</DropdownMenuItem>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Convert to Warm</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Edit Lead</DropdownMenuItem>
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
                  <TableCell colSpan={6} className="h-24 text-center">
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

export default ColdLeads;
