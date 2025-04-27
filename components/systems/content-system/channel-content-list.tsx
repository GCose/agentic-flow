import { useState, useEffect } from "react";
import {
  Search,
  ArrowUpDown,
  MoreHorizontal,
  Eye,
  MousePointer,
  ThumbsUp,
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

// Define the channel ID type
type ChannelId =
  | "facebook"
  | "instagram"
  | "twitter"
  | "linkedin"
  | "youtube"
  | "tiktok";

// Define the content data interface
interface ContentData {
  id: string;
  title: string;
  type: string;
  platform: string;
  headline: string;
  copy: string;
  callToAction: string;
  targetAudience: string;
  imageUrl: string;
  stats: {
    impressions: number;
    ctr: string;
    conversions: number;
  };
}

// Define the content item interface for the table
interface ContentItem {
  id: string;
  title: string;
  type: string;
  agent: string;
  date: string;
  status: string;
  content: ContentData;
  performance: {
    impressions: number;
    ctr: number;
    conversions: number;
  };
}

interface ChannelContentListProps {
  channelId: ChannelId;
  onViewContent: (content: ContentData) => void;
  isFiltered?: boolean;
}

// Type-safe content types
const contentTypes: Record<ChannelId, string[]> = {
  facebook: ["Image Post", "Video Post", "Carousel Post", "Story Post"],
  instagram: ["Image Post", "Reel Post", "Carousel Post", "Story Post"],
  twitter: ["Image Post", "Video Post", "Text Post", "Carousel Post"],
  linkedin: ["Single Image Post", "Video Post", "Carousel Post", "Text Post"],
  youtube: ["Short Video", "Standard Video", "Live Stream", "Community Post"],
  tiktok: ["TikTok Video", "Duet", "Stitch", "Trending Challenge"],
};

// Function to check if a string is a valid channel ID
function isValidChannelId(id: string): id is ChannelId {
  return Object.keys(contentTypes).includes(id as ChannelId);
}

// Mock data generator for content
const generateMockContentData = (channelId: string): ContentItem[] => {
  // Use the channel ID safely by first checking if it's valid
  const validChannelId = isValidChannelId(channelId) ? channelId : "facebook";

  const agents = [
    "Content Creator Agent",
    "Content Optimizer Agent",
    "Topic Selector Agent",
    "Trend Selector Agent",
  ];

  const statuses = ["Published", "Pending Review", "Draft", "Paused"];

  // Generate post titles based on platform
  const getTitlePrefix = (channel: ChannelId): string => {
    switch (channel) {
      case "facebook":
        return "Facebook Post: ";
      case "instagram":
        return "Instagram Post: ";
      case "twitter":
        return "Twitter Post: ";
      case "linkedin":
        return "LinkedIn Post: ";
      case "youtube":
        return "YouTube Post: ";
      case "tiktok":
        return "TikTok Post: ";
      default:
        return "Post: ";
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

  // Get the appropriate content types for this channel
  const types = contentTypes[validChannelId];

  // Generate content items
  return Array.from({ length: 20 }, (_, i): ContentItem => {
    const currentDate = new Date();
    const daysAgo = Math.floor(Math.random() * 14);
    const dateCreated = new Date(currentDate);
    dateCreated.setDate(currentDate.getDate() - daysAgo);

    const impressions = Math.floor(5000 + Math.random() * 45000);
    const ctr = Number((1 + Math.random() * 7).toFixed(2));
    const conversions = Math.floor(
      impressions * (ctr / 100) * (0.1 + Math.random() * 0.2)
    );

    const titlePrefix = getTitlePrefix(validChannelId);
    const titleSuffix =
      titleSuffixes[Math.floor(Math.random() * titleSuffixes.length)];

    const contentType = types[Math.floor(Math.random() * types.length)];

    // Mock content payload
    const contentPayload: ContentData = {
      id: `post-${i}`,
      title: `${titlePrefix}${titleSuffix}`,
      type: contentType,
      platform: validChannelId,
      headline: titleSuffix,
      copy: `Discover how our platform helps businesses like yours ${titleSuffix.toLowerCase()}. With our proven solution, you'll see results in days, not months.`,
      callToAction: "Get Started Today",
      targetAudience: "Business Professionals 25-54",
      imageUrl: `/api/placeholder/800/600?text=Post+Creative+${i}`,
      stats: {
        impressions,
        ctr: `${ctr}%`,
        conversions,
      },
    };

    return {
      id: `post-${i}`,
      title: `${titlePrefix}${titleSuffix}`,
      type: contentType,
      agent: agents[Math.floor(Math.random() * agents.length)],
      date: dateCreated.toLocaleDateString(),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      content: contentPayload,
      performance: {
        impressions,
        ctr,
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
  const [contentData, setContentData] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Simulating data loading
  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      const data = generateMockContentData(channelId);
      setContentData(data);
      setLoading(false);
    }, 500);
  }, [channelId]);

  // Filter content based on search term and active filters
  const filteredContent = contentData.filter((content) => {
    // Applying search filter first
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
  const handleViewContent = (content: ContentData) => {
    // Call the parent component's handler
    onViewContent(content);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-8"
              value={searchTerm}
              placeholder="Search posts..."
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {filteredContent.length} items
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <p>Loading content...</p>
        </div>
      ) : (
        <div className="rounded-md border-none pt-5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30%] border-t border-slate-800">
                  <Button
                    variant="ghost"
                    className="p-0 font-medium"
                    onClick={() => handleSort("title")}
                  >
                    Post Title
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="border-t border-slate-800">
                  Type
                </TableHead>
                <TableHead className="border-t border-slate-800">
                  <Button
                    variant="ghost"
                    className="p-0 font-medium"
                    onClick={() => handleSort("date")}
                  >
                    Created
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="border-t border-slate-800">
                  Agent
                </TableHead>
                <TableHead className="border-t border-slate-800">
                  <Button
                    variant="ghost"
                    className="p-0 font-medium"
                    onClick={() => handleSort("ctr")}
                  >
                    Performance
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right border-t border-slate-800">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedContent.map((content) => (
                <TableRow key={content.id} className="border-none">
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
                  <TableCell className="text-right border-b-0">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleViewContent(content.content)}
                        >
                          Edit Content
                        </DropdownMenuItem>
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
