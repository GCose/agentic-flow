import {
  Eye,
  ThumbsUp,
  MoreHorizontal,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Globe,
  Mail,
  MessageSquare,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Generate mock recent content data
const generateRecentContent = () => {
  const channels = [
    {
      id: "website",
      name: "Website Blog",
      icon: Globe,
      color: "text-blue-500",
    },
    {
      id: "twitter",
      name: "Twitter / X",
      icon: Twitter,
      color: "text-cyan-500",
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: Instagram,
      color: "text-pink-500",
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: Linkedin,
      color: "text-indigo-500",
    },
    { id: "youtube", name: "YouTube", icon: Youtube, color: "text-red-500" },
    {
      id: "newsletter",
      name: "Email Newsletter",
      icon: Mail,
      color: "text-amber-500",
    },
  ];

  const agents = [
    "Content Creator Agent",
    "Content Optimizer Agent",
    "Topic Selector Agent",
    "Trend Selector Agent",
  ];

  const statuses = ["Published", "Trending", "High Performing"];

  const titles = [
    "10 Ways AI is Transforming Business Operations",
    "The Ultimate Guide to Digital Transformation",
    "How to Leverage Data Analytics for Growth",
    "Building a Scalable Cloud Infrastructure",
    "Maximizing ROI with AI-Powered Marketing",
    "The Future of Work: Automation and Collaboration",
    "Security Best Practices for Modern Enterprises",
    "Customer Experience Trends for 2025",
    "Optimizing Your Sales Funnel with AI",
    "Strategies for Sustainable Business Growth",
  ];

  // Generate content items
  return Array.from({ length: 8 }, (_, i) => {
    const currentDate = new Date();
    const hoursAgo = Math.floor(Math.random() * 72);
    const dateCreated = new Date(currentDate);
    dateCreated.setHours(currentDate.getHours() - hoursAgo);

    const views = Math.floor(500 + Math.random() * 9500);
    const engagement = Math.floor(views * (0.02 + Math.random() * 0.08));
    const comments = Math.floor(engagement * (0.1 + Math.random() * 0.2));

    const channel = channels[Math.floor(Math.random() * channels.length)];

    return {
      id: `content-${i}`,
      title: titles[Math.floor(Math.random() * titles.length)],
      channel: channel,
      agent: agents[Math.floor(Math.random() * agents.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      timeAgo: `${hoursAgo} ${hoursAgo === 1 ? "hour" : "hours"} ago`,
      performance: {
        views,
        engagement,
        comments,
      },
    };
  });
};

const RecentContent = () => {
  const recentContent = generateRecentContent();

  // Function to format numbers (e.g., 1500 -> 1.5K)
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  return (
    <div className="space-y-6">
      {recentContent.map((content) => (
        <div
          key={content.id}
          className="flex items-start gap-4 p-4 rounded-lg bg-transparent hover:bg-white/10 transition-colors"
        >
          <Avatar className="h-10 w-10">
            <AvatarFallback>
              <content.channel.icon
                className={`h-5 w-5 ${content.channel.color}`}
              />
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <h4 className="text-base font-medium truncate">
                {content.title}
              </h4>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    content.status === "Trending"
                      ? "default"
                      : content.status === "High Performing"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {content.status}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {content.timeAgo}
                </span>
              </div>
            </div>

            <div className="mt-1 flex flex-col sm:flex-row sm:items-center gap-y-1 gap-x-4">
              <span className="text-sm text-muted-foreground">
                {content.channel.name}
              </span>
              <span className="text-sm text-muted-foreground">
                Created by {content.agent.replace(" Agent", "")}
              </span>
              <div className="flex items-center gap-3 sm:ml-auto">
                <div className="flex items-center gap-1 text-sm">
                  <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{formatNumber(content.performance.views)}</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <ThumbsUp className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{formatNumber(content.performance.engagement)}</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{formatNumber(content.performance.comments)}</span>
                </div>
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>View Details</DropdownMenuItem>
              <DropdownMenuItem>View Analytics</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Regenerate</DropdownMenuItem>
              <DropdownMenuItem>Edit Content</DropdownMenuItem>
              <DropdownMenuItem>Archive</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
    </div>
  );
};

export default RecentContent;
