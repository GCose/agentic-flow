import { useState } from "react";
import { AlertCircle, CheckCircle, Info, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock data for agent event log
const mockEventLog = [
  {
    id: "1",
    agentId: "content-creator-123",
    contentId: "content-456",
    type: "generation-started",
    message: "Starting content generation process",
    timestamp: "2025-04-08 14:30:12",
  },
  {
    id: "2",
    agentId: "content-creator-123",
    contentId: "content-456",
    type: "generation-completed",
    message: "Successfully generated blog content",
    timestamp: "2025-04-08 14:32:45",
  },
  {
    id: "3",
    agentId: "trend-analyzer-234",
    contentId: "content-457",
    type: "analysis-started",
    message: "Analyzing trending topics for social media",
    timestamp: "2025-04-08 12:15:22",
  },
  {
    id: "4",
    agentId: "trend-analyzer-234",
    contentId: "content-457",
    type: "analysis-completed",
    message: "Trend analysis completed with 5 identified topics",
    timestamp: "2025-04-08 12:17:35",
  },
  {
    id: "5",
    agentId: "content-optimizer-345",
    contentId: "content-458",
    type: "optimization-started",
    message: "Starting SEO optimization for blog content",
    timestamp: "2025-04-08 10:55:14",
  },
  {
    id: "6",
    agentId: "content-optimizer-345",
    contentId: "content-458",
    type: "error",
    message: "Failed to optimize content: Invalid input parameters",
    timestamp: "2025-04-08 10:56:30",
  },
  {
    id: "7",
    agentId: "email-sender-456",
    contentId: "content-459",
    type: "delivery-scheduled",
    message: "Email content scheduled for delivery at 15:00",
    timestamp: "2025-04-08 09:22:41",
  },
  {
    id: "8",
    agentId: "post-strategy-567",
    contentId: "content-460",
    type: "strategy-created",
    message: "Publishing strategy created for social media content",
    timestamp: "2025-04-07 16:45:12",
  },
];

const ContentAgentEventLog = () => {
  const [eventLog] = useState(mockEventLog);

  const getEventIcon = (type: string) => {
    if (
      type.includes("completed") ||
      type.includes("created") ||
      type.includes("scheduled")
    ) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    } else if (type.includes("started") || type.includes("analysis")) {
      return <Clock className="h-4 w-4 text-blue-500" />;
    } else if (type.includes("error")) {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    } else {
      return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getEventBadgeVariant = (type: string) => {
    if (
      type.includes("completed") ||
      type.includes("created") ||
      type.includes("scheduled")
    ) {
      return "default";
    } else if (type.includes("started") || type.includes("analysis")) {
      return "secondary";
    } else if (type.includes("error")) {
      return "destructive";
    } else {
      return "outline";
    }
  };

  return (
    <ScrollArea className="h-[700px] pr-4">
      <div className="space-y-4">
        {eventLog.map((event) => (
          <div key={event.id} className="rounded-lg border p-4">
            <div className="flex items-start gap-4">
              <div className="mt-0.5">{getEventIcon(event.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={getEventBadgeVariant(event.type)}>
                    {event.type}
                  </Badge>
                  <Badge variant="outline">{event.agentId}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {event.timestamp}
                  </span>
                </div>
                <p className="text-sm mt-2">{event.message}</p>
                {event.contentId && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Content ID: {event.contentId}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default ContentAgentEventLog;
