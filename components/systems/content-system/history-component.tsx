import { useState } from "react";
import { Eye, MoreHorizontal, Copy, Download, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock data for content history
const mockContentHistory = [
  {
    id: "1",
    prompt:
      "Create a blog post about AI automation benefits for small businesses",
    type: "blog-post",
    platform: "website",
    timestamp: "2025-04-08 14:32:45",
    status: "completed",
  },
  {
    id: "2",
    prompt: "Write a LinkedIn post announcing our new AI service",
    type: "social-post",
    platform: "linkedin",
    timestamp: "2025-04-07 11:15:22",
    status: "completed",
  },
  {
    id: "3",
    prompt: "Create an email newsletter about upcoming AI webinars",
    type: "email",
    platform: "email",
    timestamp: "2025-04-06 16:45:12",
    status: "completed",
  },
  {
    id: "4",
    prompt: "Write ad copy for our new lead generation tool",
    type: "ad-copy",
    platform: "facebook",
    timestamp: "2025-04-05 09:22:31",
    status: "completed",
  },
  {
    id: "5",
    prompt: "Create a Twitter thread about AI ethics in business",
    type: "social-post",
    platform: "twitter",
    timestamp: "2025-04-04 15:10:54",
    status: "failed",
  },
  {
    id: "6",
    prompt: "Write an Instagram post about our company culture",
    type: "social-post",
    platform: "instagram",
    timestamp: "2025-04-03 13:20:17",
    status: "completed",
  },
];

const ContentHistory = () => {
  const [contentHistory] = useState(mockContentHistory);

  return (
    <ScrollArea className="h-[700px] pr-4">
      <div className="space-y-4">
        {contentHistory.map((content) => (
          <div
            key={content.id}
            className="rounded-lg border p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant={
                      content.status === "completed" ? "default" : "destructive"
                    }
                  >
                    {content.status}
                  </Badge>
                  <Badge variant="outline">{content.type}</Badge>
                  {content.platform && (
                    <Badge variant="secondary">{content.platform}</Badge>
                  )}
                </div>
                <p className="text-sm font-medium line-clamp-2">
                  {content.prompt}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {content.timestamp}
                </p>
              </div>
              <div className="flex shrink-0 gap-2 ml-4">
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Eye className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <Copy className="mr-2 h-4 w-4" />
                      <span>Copy to clipboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="mr-2 h-4 w-4" />
                      <span>Download</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default ContentHistory;
