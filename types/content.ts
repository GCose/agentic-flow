export interface ContentItem {
  id: string;
  title: string;
  description: string;
  contentType: "video" | "image" | "post" | "article";
  status: "pending" | "in-progress" | "completed" | "published";
  dueDate: Date;
  assignedTo: string[];
  tags: string[];
  platform: string;
  aiInsights?: string[];
  thumbnailUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
