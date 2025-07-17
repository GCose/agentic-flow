import { useState, useEffect } from "react"; 
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
import axios from "axios"; // Import axios for API requests
// import { generateWarmLeads } from "@/data/leads-data"; // Not needed

const AiroLeads = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof WarmLead>("leadScore");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const [warmLeads, setWarmLeads] = useState<
    (WarmLead & { report?: string; strategy?: string })[]
  >([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://178.63.40.80:5500/api/leads/");

      const data =  response.data

      console.log("Fetched leads:", data); 

      const mappedLeads = data.map((item: any) => ({
        id: item.id,
        company: item.company_name,
        leadScore: item.lead_analysis?.lead_score * 2 || 0,
        salesCall: "",
        industry: "",
        leadEntry: item.created_at,
        strategy: item.lead_analysis?.buyer_profile ?? "",
        report: item.lead_analysis?.summary ?? "",
      }));
      setWarmLeads(mappedLeads);

      console.log("Mapped leads:",); // Log the mapped leads
    } catch (error) {
      console.error("Error fetching leads:", error);
      setWarmLeads([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchLeads();
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
    router.push(`/client/sales-system/airo/${leadId}`);
  };

  return (
    <Card className="bg-transparent border-none ">
      <CardHeader className="flex items-center justify-between gap-4">
        <CardTitle className="font-medium text-md">
          Manage and track leads that have shown interest in your products or
          services.
        </CardTitle>
        <div className="flex items-center gap-2">
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
        <div className="p-2 border rounded-md border-blue-900/30">
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
                    <ArrowUpDown className="w-4 h-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="font-medium"
                    onClick={() => handleSort("leadScore")}
                  >
                    Lead Score
                    <ArrowUpDown className="w-4 h-4" />
                  </Button>
                </TableHead>
                <TableHead className="table-cell">Lead Captured</TableHead>
                <TableHead className="table-cell">Industry</TableHead>
                <TableHead className="table-cell">Sales Call</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedLeads.map((lead) => (
                <TableRow
                  key={lead.id}
                  onClick={() => handleViewDetails(lead.id)}
                  className="cursor-pointer border-blue-900/30 hover:bg-blue-600/10"
                >
                  <TableCell className="font-medium">{lead.company}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="font-medium text-green-500 bg-green-500/10 text-md"
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
                        <Button variant="ghost" className="w-8 h-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="w-4 h-4" />
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

export default AiroLeads;