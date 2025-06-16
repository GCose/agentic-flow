import { useState } from "react";
import { MoreHorizontal, ArrowUpDown, RefreshCw } from "lucide-react";
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

const WarmLeads = ({
  role,
  clientId,
}: {
  role: "admin" | "client";
  clientId?: string;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof WarmLead>("leadScore");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [warmLeads, setWarmLeads] = useState<
    (WarmLead & { report?: string })[]
  >(generateWarmLeads());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setWarmLeads(generateWarmLeads());
    setIsRefreshing(false);
  };

  const filteredLeads = warmLeads.filter(
    (lead) =>
      lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.strategy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.report &&
        lead.report.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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

  const handleSort = (field: keyof WarmLead) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handleViewDetails = (leadId: string) => {
    const path =
      role === "admin"
        ? `/admin/clients/${clientId}/leadgen-system/warm-leads/${leadId}`
        : `/client/leadgen-system/warm-leads/${leadId}`;

    router.push(path);
  };

  return (
    <Card className=" border-none bg-transparent">
      <CardHeader className="flex gap-4 items-center justify-between">
        <CardTitle className="font-medium text-md">
          Manage and track leads that have shown interest in your products or
          services.
        </CardTitle>
        <div className="flex gap-2 items-center">
          <Input
            value={searchTerm}
            placeholder="Search leads..."
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 bg-transparent border-blue-900/30"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="bg-transparent border-blue-900/30 hover:bg-gradient-to-r hover:from-blue-800/30 hover:via-blue-700/20 hover:to-blue-500/25 hover:text-white hover:border-blue-600/50"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-blue-900/30 p-2">
          <Table>
            <TableHeader>
              <TableRow className="border-blue-900/30 hover:bg-transparent">
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
                <TableHead className="table-cell">Sales Call</TableHead>
                <TableHead className="table-cell">Industry</TableHead>
                <TableHead className="table-cell">Lead Captured</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedLeads.map((lead) => (
                <TableRow
                  key={lead.id}
                  onClick={() => handleViewDetails(lead.id)}
                  className="border-blue-900/30 hover:bg-blue-600/10 cursor-pointer"
                >
                  <TableCell className="font-medium">{lead.company}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-green-500/10 text-green-500 font-medium text-md"
                    >
                      {lead.leadScore}
                    </Badge>
                  </TableCell>
                  <TableCell className="table-cell">{lead.salesCall}</TableCell>
                  <TableCell className="table-cell">{lead.industry}</TableCell>
                  <TableCell className="table-cell">{lead.leadEntry}</TableCell>
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
