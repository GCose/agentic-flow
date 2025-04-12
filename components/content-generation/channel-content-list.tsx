import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ArrowUpDown,
  MoreHorizontal,
  Eye,
  MousePointer,
  ThumbsUp,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

interface ChannelContentListProps {
  channelId: string;
  onViewContent: (content: any) => void;
  isFiltered?: boolean;
}

// Mock data generator for ad content
const generateMockAdContent = (channelId: string) => {
  // Different content types based on platform
  const contentTypes = {
    facebook: ["Image Ad", "Video Ad", "Carousel Ad", "Story Ad"],
    instagram: ["Image Ad", "Reel Ad", "Carousel Ad", "Story Ad"],
    twitter: ["Image Ad", "Video Ad", "Text Ad", "Carousel Ad"],
    linkedin: ["Single Image Ad", "Video Ad", "Carousel Ad", "Text Ad"],
    youtube: ["Skippable Ad", "Non-skippable Ad", "Bumper Ad", "Overlay Ad"],
    tiktok: ["In-Feed Ad", "TopView Ad", "Branded Effect", "Branded Hashtag"],
  };

  const agents = [
    "Ad Intelligence Agent",
    "Content Creator Agent",
    "Counter Strategy Agent",
    "Trend Selector Agent",
  ];

  const statuses = ["Active", "Pending Review", "Draft", "Paused"];

  // Generate ad titles based on platform
  const getTitlePrefix = (channel: string) => {
    switch (channel) {
      case "facebook":
        return "Facebook Ad: ";
      case "instagram":
        return "Instagram Ad: ";
      case "twitter":
        return "Twitter Ad: ";
      case "linkedin":
        return "LinkedIn Ad: ";
      case "youtube":
        return "YouTube Ad: ";
      case "tiktok":
        return "TikTok Ad: ";
      default:
        return "Ad: ";
    }
  };

  const titleSuffixes = [
    "Boost Your Productivity with AI Today",
    "Transform Your Business with Machine Learning",
    "Cut Costs with Smart Automation",
    "Streamline Your Workflow Instantly",
    "10X Your Results with Our Platform",
    "Join Thousands of Satisfied Customers",
    "Don't Miss Our Limited Time Offer",
    "Discover the Future of Work",
    "Maximize Efficiency with One Click",
    "The Ultimate Solution for Your Business Needs",
    "Try Risk-Free for 30 Days",
    "See Why Experts Recommend Our Solution",
    "Revolutionary New Approach to Business Growth",
    "Unlock Your Full Potential Today",
    "The Smart Choice for Modern Businesses",
  ];

  // Generate content items
  return Array.from({ length: 20 }, (_, i) => {
    const currentDate = new Date();
    const daysAgo = Math.floor(Math.random() * 14);
    const dateCreated = new Date(currentDate);
    dateCreated.setDate(currentDate.getDate() - daysAgo);

    const impressions = Math.floor(5000 + Math.random() * 45000);
    const ctr = (1 + Math.random() * 7).toFixed(2);
    const conversions = Math.floor(
      impressions * (Number(ctr) / 100) * (0.1 + Math.random() * 0.2)
    );

    const titlePrefix = getTitlePrefix(channelId);
    const titleSuffix =
      titleSuffixes[Math.floor(Math.random() * titleSuffixes.length)];

    const types = contentTypes[channelId] || contentTypes.facebook;
    const contentType = types[Math.floor(Math.random() * types.length)];

    // Mock content payload to simulate actual ad content
    const contentPayload = {
      id: `ad-${i}`,
      title: `${titlePrefix}${titleSuffix}`,
      type: contentType,
      platform: channelId,
      headline: titleSuffix,
      copy: `Discover how our platform helps businesses like yours ${titleSuffix.toLowerCase()}. With our proven solution, you'll see results in days, not months.`,
      callToAction: "Get Started Today",
      targetAudience: "Business Professionals 25-54",
      imageUrl: `/api/placeholder/800/600?text=Ad+Creative+${i}`,
      stats: {
        impressions,
        ctr: `${ctr}%`,
        conversions,
      },
    };

    return {
      id: `ad-${i}`,
      title: `${titlePrefix}${titleSuffix}`,
      type: contentType,
      agent: agents[Math.floor(Math.random() * agents.length)],
      date: dateCreated.toLocaleDateString(),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      content: contentPayload,
      performance: {
        impressions,
        ctr: Number(ctr),
        conversions,
      },
    };
  });
};

const ChannelContentList = ({
  channelId,
  onViewContent,
  isFiltered = false,
}: ChannelContentListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [contentData, setContentData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulate data loading with useEffect
  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      const data = generateMockAdContent(channelId);
      setContentData(data);
      setLoading(false);
    }, 500);
  }, [channelId]);

  // Filter content based on search term and active filters
  const filteredContent = contentData.filter((content) => {
    // First apply search filter
    const matchesSearch =
      content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.agent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.type.toLowerCase().includes(searchTerm.toLowerCase());

    // Then apply additional filters if isFiltered is true
    if (isFiltered) {
      // Only show high-performing content (CTR > 4%)
      return matchesSearch && content.performance.ctr > 4;
    }

    return matchesSearch;
  });

  // Sort content based on sort field and direction
  const sortedContent = [...filteredContent].sort((a, b) => {
    let comparison = 0;

    if (sortField === "date") {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      comparison = dateA - dateB;
    } else if (sortField === "impressions") {
      comparison = a.performance.impressions - b.performance.impressions;
    } else if (sortField === "ctr") {
      comparison = a.performance.ctr - b.performance.ctr;
    } else if (sortField === "title") {
      comparison = a.title.localeCompare(b.title);
    }

    return sortDirection === "asc" ? comparison : -comparison;
  });

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // View content details
  const handleViewContent = (content) => {
    // Call the parent component's handler
    onViewContent(content);
  };

  // Status icon component
  const StatusIcon = ({ status }) => {
    switch (status) {
      case "Active":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "Pending Review":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "Draft":
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case "Paused":
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search ads..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant={isFiltered ? "default" : "outline"} size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {filteredContent.length} items
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <p>Loading ad content...</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30%]">
                  <Button
                    variant="ghost"
                    className="p-0 font-medium"
                    onClick={() => handleSort("title")}
                  >
                    Ad Title
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Type</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="p-0 font-medium"
                    onClick={() => handleSort("date")}
                  >
                    Created
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="p-0 font-medium"
                    onClick={() => handleSort("ctr")}
                  >
                    Performance
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedContent.map((content) => (
                <TableRow key={content.id}>
                  <TableCell className="font-medium">{content.title}</TableCell>
                  <TableCell>{content.type}</TableCell>
                  <TableCell>{content.date}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="bg-blue-500/10 text-blue-500"
                      >
                        {content.agent.replace(" Agent", "")}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <StatusIcon status={content.status} />
                      <Badge
                        variant={
                          content.status === "Active"
                            ? "default"
                            : content.status === "Pending Review"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {content.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-sm">
                        <Eye className="h-3 w-3" />
                        <span>
                          {content.performance.impressions.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <MousePointer className="h-3 w-3" />
                        <span>{content.performance.ctr}%</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <ThumbsUp className="h-3 w-3" />
                        <span>{content.performance.conversions}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => handleViewContent(content.content)}
                        >
                          View Ad Content
                        </DropdownMenuItem>
                        <DropdownMenuItem>View Analytics</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Approve</DropdownMenuItem>
                        <DropdownMenuItem>Request Changes</DropdownMenuItem>
                        {content.status === "Active" ? (
                          <DropdownMenuItem>Pause Ad</DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem>Activate Ad</DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ChannelContentList;
