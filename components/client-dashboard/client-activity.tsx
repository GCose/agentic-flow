import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const activities = [
  {
    id: 1,
    client: "Acme Corp",
    action: "Started new conversation with Customer Support Assistant",
    time: "2 minutes ago",
    color: "bg-blue-500",
  },
  {
    id: 2,
    client: "TechStart Inc",
    action: "Requested quarterly report from Data Analysis Agent",
    time: "15 minutes ago",
    color: "bg-green-500",
  },
  {
    id: 3,
    client: "Marketing Team",
    action: "Provided feedback on Content Generator output",
    time: "32 minutes ago",
    color: "bg-purple-500",
  },
  {
    id: 4,
    client: "Executive Office",
    action: "Scheduled new meeting with Meeting Scheduler",
    time: "1 hour ago",
    color: "bg-orange-500",
  },
  {
    id: 5,
    client: "Dev Team",
    action: "Submitted code review request to Code Assistant",
    time: "2 hours ago",
    color: "bg-red-500",
  },
  {
    id: 6,
    client: "Support Team",
    action: "Escalated customer issue to human support",
    time: "3 hours ago",
    color: "bg-indigo-500",
  },
];

const ClientActivity = () => {
  return (
    <Card className="border shadow-sm bg-transparent backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Recent Client Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarFallback className={activity.color}>
                  {activity.client.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {activity.client}
                </p>
                <p className="text-sm text-muted-foreground">
                  {activity.action}
                </p>
              </div>
              <div className="ml-auto text-sm text-muted-foreground">
                {activity.time}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientActivity;
