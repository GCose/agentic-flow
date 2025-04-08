import { useState } from "react";
import {
  Calendar,
  Clock,
  Copy,
  ExternalLink,
  MoreHorizontal,
  ArrowUpDown,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

// Sample data for content history
const contentHistoryData = [
  {
    id: "1",
    prompt: "Write a blog post about AI in healthcare",
    contentType: "Blog Post",
    platform: "Website",
    createdAt: "2023-10-15 14:32:45",
    preview:
      "Artificial Intelligence is revolutionizing healthcare in numerous ways...",
  },
  {
    id: "2",
    prompt: "Create a social media post announcing our new product",
    contentType: "Social Post",
    platform: "Facebook",
    createdAt: "2023-10-14 10:15:22",
    preview: "Exciting news! We're thrilled to announce our latest product...",
  },
  {
    id: "3",
    prompt: "Draft an email newsletter about upcoming events",
    contentType: "Email",
    platform: "Email",
    createdAt: "2023-10-13 16:45:30",
    preview: "Hello subscribers! Check out these exciting upcoming events...",
  },
  {
    id: "4",
    prompt: "Write a product description for our new software",
    contentType: "Product Description",
    platform: "Website",
    createdAt: "2023-10-12 09:20:15",
    preview:
      "Our new software offers cutting-edge features designed to streamline your workflow...",
  },
  {
    id: "5",
    prompt: "Create a tweet about industry trends",
    contentType: "Social Post",
    platform: "Twitter",
    createdAt: "2023-10-11 11:05:40",
    preview:
      "Industry trends show a 40% increase in AI adoption this year. Are you keeping up?",
  },
];

const ContentHistory = () => {
  const [sortField, setSortField] = useState<string>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [contentHistory, setContentHistory] = useState(contentHistoryData);

  const handleSort = (field: string) => {
    const newDirection =
      field === sortField && sortDirection === "desc" ? "asc" : "desc";
    setSortField(field);
    setSortDirection(newDirection);

    const sortedData = [...contentHistory].sort((a, b) => {
      if (newDirection === "asc") {
        return a[field as keyof typeof a] > b[field as keyof typeof b] ? 1 : -1;
      } else {
        return a[field as keyof typeof a] < b[field as keyof typeof b] ? 1 : -1;
      }
    });

    setContentHistory(sortedData);
  };

  return (
    <Card className="bg-transparent">
      <CardHeader>
        <CardTitle>Content History</CardTitle>
        <CardDescription>
          View and manage your previously generated content
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">
                <Button
                  variant="ghost"
                  className="p-0 h-8 font-medium"
                  onClick={() => handleSort("prompt")}
                >
                  Prompt
                  {sortField === "prompt" && (
                    <ArrowUpDown
                      className={`ml-2 h-4 w-4 ${
                        sortDirection === "asc" ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="p-0 h-8 font-medium"
                  onClick={() => handleSort("contentType")}
                >
                  Type
                  {sortField === "contentType" && (
                    <ArrowUpDown
                      className={`ml-2 h-4 w-4 ${
                        sortDirection === "asc" ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </Button>
              </TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="p-0 h-8 font-medium"
                  onClick={() => handleSort("createdAt")}
                >
                  Created
                  {sortField === "createdAt" && (
                    <ArrowUpDown
                      className={`ml-2 h-4 w-4 ${
                        sortDirection === "asc" ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </Button>
              </TableHead>
              <TableHead>Preview</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contentHistory.map((content) => (
              <TableRow key={content.id}>
                <TableCell className="font-medium truncate max-w-[300px]">
                  {content.prompt}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{content.contentType}</Badge>
                </TableCell>
                <TableCell>{content.platform}</TableCell>
                <TableCell className="whitespace-nowrap">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    {new Date(content.createdAt).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell className="truncate max-w-[200px]">
                  {content.preview}
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
                      <DropdownMenuItem>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        <span>View Full Content</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="mr-2 h-4 w-4" />
                        <span>Copy to Clipboard</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Clock className="mr-2 h-4 w-4" />
                        <span>Regenerate</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ContentHistory;
