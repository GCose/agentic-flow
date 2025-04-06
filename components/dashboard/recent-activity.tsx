import { activities } from "@/mock/activities";
import ActivityStatusIcon from "../ui/activity-status-icon";

const RecentActivity = () => {
  return (
    <div className="space-y-6">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-white/5"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
            <ActivityStatusIcon status={activity.status} />
          </div>
          <div className="space-y-1 flex-1">
            <p className="text-sm font-medium leading-none">
              {activity.agent} <span className="text-muted-foreground">→</span>{" "}
              {activity.client}
            </p>
            <p className="text-sm text-muted-foreground">{activity.action}</p>
          </div>
          <div className="text-sm text-muted-foreground whitespace-nowrap">
            {activity.time}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentActivity;
