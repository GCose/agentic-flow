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

interface LeadsTableProps {
  title: string;
  basePath: string;
  data: any;
  isLoading?: boolean;
  error?: string | null;
  onRefresh?: () => Promise<void> | void;
}

const LeadsTable = ({
  title,
  basePath,
  data,
  isLoading = false,
  error = null,
  onRefresh,
}: LeadsTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Lead>("leadScore");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  const handleRefresh = async () => {
    if (!onRefresh) return;
    setIsRefreshing(true);
    await onRefresh();
    setIsRefreshing(false);
  };

  interface Lead {
    id: string;
    company_name: string;
    strategy: string;
    report?: string;
    leadScore: number;
    leadEntry: string;
    industry: string;
    salesCall: string;
  }

  const filteredLeads = data.filter(
    (lead: Lead) =>
      lead.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.strategy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.report &&
        lead.report.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedLeads = [...filteredLeads].sort((a, b) => {
    if (typeof a[sortField] === "string" && typeof b[sortField] === "string") {
      const aValue = a[sortField] as string | number;
      const bValue = b[sortField] as string;
      return sortDirection === "asc"
        ? (aValue as string).localeCompare(bValue as string)
        : bValue.toString().localeCompare(aValue.toString());
    } else {
      const aValue = a[sortField] as number;
      const bValue = b[sortField] as number;
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }
  });

  const handleSort = (field: keyof Lead) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handleViewDetails = (leadId: string) => {
    router.push(`${basePath}/${leadId}`);
  };

  return (
    <Card className=" border-none bg-transparent">
      <CardHeader className="flex gap-4 items-center justify-between">
        <CardTitle className="font-medium text-md">{title}</CardTitle>
        <div className="flex gap-2 items-center">
          <Input
            value={searchTerm}
            placeholder="Search leads..."
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 bg-transparent border-blue-900/30"
          />
          <Button
            size="sm"
            variant="outline"
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
                    onClick={() => handleSort("company_name")}
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
                <TableHead className="table-cell">Lead Captured</TableHead>
                <TableHead className="table-cell">Industry</TableHead>
                {filteredLeads.salesCall && (
                  <TableHead className="table-cell">Sales Call</TableHead>
                )}
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
                  <TableCell className="font-medium">
                    {lead.company_name}
                  </TableCell>
                  {lead.lead_analysis?.lead_score && (
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-green-500/10 text-green-500 font-medium text-md"
                      >
                        {lead.lead_analysis.lead_score}
                      </Badge>
                    </TableCell>
                  )}
                  {lead.report?.report_section?.audit_scorecard && (
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-blue-500/10 text-blue-500 font-medium text-md"
                      >
                        {Number(
                          lead.report.report_section.audit_scorecard[0]
                            .overall_funnel_score.score
                        )}
                      </Badge>
                    </TableCell>
                  )}
                  <TableCell className="table-cell">
                    {lead.leadEntry || lead.created_at}
                  </TableCell>
                  {lead.industry && (
                    <TableCell className="table-cell">
                      {lead.industry}
                    </TableCell>
                  )}
                  {lead.lead_analysis?.industry && (
                    <TableCell className="table-cell">
                      {lead.lead_analysis.industry}
                    </TableCell>
                  )}
                  {lead.salesCall && (
                    <TableCell className="table-cell">
                      {lead.salesCall}
                    </TableCell>
                  )}
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
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              )}
              {error && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center text-red-500"
                  >
                    Error: {error}
                  </TableCell>
                </TableRow>
              )}
              {filteredLeads.length === 0 && !isLoading && !error && (
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

export default LeadsTable;
