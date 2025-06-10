import { useState } from "react";
import { Search, MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { generateWarmLeads } from "@/data/leads-data";

const WarmLeads = ({ role }: { role: "admin" | "client" }) => {
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
    router.push(`/${role}/leadgen-system/lead/${leadId}`);
  };

  return (
    <Card className=" border-none bg-transparent">
      <CardHeader className="flex gap-4 items-center justify-between">
        <CardTitle className="font-medium text-md">
          Manage and track leads that have shown interest in your products or
          services
        </CardTitle>
        <div>
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            placeholder="Search leads..."
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 bg-transparent border-slate-800"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-slate-800">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800">
                <TableHead>
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
                  Sales Call
                </TableHead>
                <TableHead className="hidden lg:table-cell">Industry</TableHead>
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
                  <TableCell className="hidden md:table-cell">
                    {lead.salesCall}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {lead.industry}
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
