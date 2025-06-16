import { useState, useEffect } from "react";
import { Search, Filter, Calendar, Tag, Briefcase, AtSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ContentItem } from "@/types/content";
import { UserRole } from "@/types/user";
import Image from "next/image";

// Sample data Simulation
const sampleContentItems: ContentItem[] = [
  {
    id: "content-1",
    title: "10 AI Trends for 2025",
    description:
      "A comprehensive look at emerging AI technologies and their business impact.",
    contentType: "article",
    status: "pending",
    dueDate: new Date(2025, 4, 20),
    assignedTo: ["designer"],
    tags: ["AI", "Technology", "Trends"],
    platform: "LinkedIn",
    aiInsights: [
      "Include statistics on AI adoption rates",
      "Focus on practical business applications",
      "Use charts to visualize AI growth",
      "Compare with 2023 predictions",
    ],
    createdAt: new Date(2025, 4, 10),
    updatedAt: new Date(2025, 4, 10),
  },
  {
    id: "content-2",
    title: "Product Demo: New Dashboard Features",
    description:
      "Video showcase of the latest product features with walkthrough.",
    contentType: "video",
    status: "in-progress",
    dueDate: new Date(2025, 4, 25),
    assignedTo: ["videographer"],
    tags: ["Product", "Demo", "Features"],
    platform: "YouTube",
    thumbnailUrl: "/images/Icon.png",
    aiInsights: [
      "Focus on the analytics dashboard improvements",
      "Include testimonial from beta users",
      "Show before/after comparison",
      "Keep video under 5 minutes for optimal engagement",
    ],
    createdAt: new Date(2025, 4, 15),
    updatedAt: new Date(2025, 4, 16),
  },
  {
    id: "content-3",
    title: "Success Story: Enterprise Implementation",
    description:
      "Case study of how ClientX achieved 300% ROI with our solution.",
    contentType: "post",
    status: "completed",
    dueDate: new Date(2025, 4, 18),
    assignedTo: ["designer", "videographer"],
    tags: ["Case Study", "Success Story", "Enterprise"],
    platform: "Instagram",
    aiInsights: [
      "Use bright colors to highlight key metrics",
      "Include a quote from the client CEO",
      "Create a carousel format with 5 slides",
      "End with a clear call-to-action",
    ],
    createdAt: new Date(2025, 4, 5),
    updatedAt: new Date(2025, 4, 17),
  },
  {
    id: "content-4",
    title: "2025 Market Report Infographic",
    description:
      "Visual representation of market trends and statistics for our industry.",
    contentType: "image",
    status: "published",
    dueDate: new Date(2025, 4, 12),
    assignedTo: ["designer"],
    tags: ["Infographic", "Market", "Data"],
    platform: "Twitter",
    thumbnailUrl: "/images/Icon.png",
    aiInsights: [
      "Use a dark theme with high contrast",
      "Include no more than 5 key statistics",
      "Add company branding in the corner",
      "Create vertical format for better mobile viewing",
    ],
    createdAt: new Date(2025, 4, 1),
    updatedAt: new Date(2025, 4, 12),
  },
];

interface ContentLibraryProps {
  userRole: UserRole;
}

const ContentLibrary = ({ userRole }: ContentLibraryProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);

  useEffect(() => {
    // Filter content based on user role in a real application
    // Here we're just filtering the sample data
    let filtered = [...sampleContentItems];

    if (userRole !== "admin") {
      filtered = filtered.filter((item) => item.assignedTo.includes(userRole));
    }

    setContentItems(filtered);
  }, [userRole]);

  const filteredContent = contentItems.filter((item) => {
    const matchesSearch =
      !searchTerm ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" && item.status === "pending") ||
      (activeTab === "in-progress" && item.status === "in-progress") ||
      (activeTab === "completed" && item.status === "completed") ||
      (activeTab === "published" && item.status === "published");

    return matchesSearch && matchesTab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-500";
      case "in-progress":
        return "bg-blue-500/20 text-blue-500";
      case "completed":
        return "bg-green-500/20 text-green-500";
      case "published":
        return "bg-purple-500/20 text-purple-500";
      default:
        return "bg-slate-500/20 text-slate-500";
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="border bg-transparent ">
      <CardHeader>
        <CardTitle>Content Library</CardTitle>
        <div className="flex items-center gap-2 pt-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search content..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/30">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab} className="pt-4">
            <ScrollArea className="h-[800px] pr-4">
              <div className="space-y-4">
                {filteredContent.length > 0 ? (
                  filteredContent.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-lg border p-4 hover:bg-slate-800/20 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium text-lg">
                              {item.title}
                            </h3>
                            <Badge className={getStatusColor(item.status)}>
                              {item.status.charAt(0).toUpperCase() +
                                item.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {item.description}
                          </p>

                          <div className="flex flex-wrap gap-2 mb-3">
                            {item.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="bg-slate-800/30"
                              >
                                <Tag className="h-3 w-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                            <Badge
                              variant="outline"
                              className="bg-slate-800/30"
                            >
                              <AtSign className="h-3 w-3 mr-1" />
                              {item.platform}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="bg-slate-800/30"
                            >
                              <Briefcase className="h-3 w-3 mr-1" />
                              {item.contentType}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="bg-slate-800/30"
                            >
                              <Calendar className="h-3 w-3 mr-1" />
                              Due: {formatDate(item.dueDate)}
                            </Badge>
                          </div>

                          {item.aiInsights && item.aiInsights.length > 0 && (
                            <div className="mt-4">
                              <h4 className="text-sm font-medium mb-2">
                                AI Insights & Requirements
                              </h4>
                              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                {item.aiInsights.map((insight, index) => (
                                  <li key={index}>{insight}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        {item.thumbnailUrl && (
                          <div className="ml-4 flex-shrink-0">
                            <Image
                              width={150}
                              height={150}
                              alt={item.title}
                              src={item.thumbnailUrl}
                              className="w-24 h-24 object-cover rounded-md"
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between items-center mt-4 pt-2 border-t border-blue-900/30/30 text-xs text-muted-foreground">
                        <div>Created: {formatDate(item.createdAt)}</div>
                        <div>Updated: {formatDate(item.updatedAt)}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <p className="text-muted-foreground mb-2">
                      No content items found
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Try adjusting your search or filters
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ContentLibrary;
