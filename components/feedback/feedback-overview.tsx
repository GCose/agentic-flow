import { ThumbsUp, ThumbsDown, MessageSquare, Lightbulb } from "lucide-react";
import StatCard from "../ui/stat-card";

const FeedbackOverview = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        value="78%"
        color="green"
        icon={ThumbsUp}
        title="Positive Feedback"
        change="+2% from last month"
      />
      <StatCard
        value="22%"
        color="red"
        icon={ThumbsDown}
        title="Negative Feedback"
        change="-2% from last month"
      />
      <StatCard
        value="1,284"
        color="blue"
        icon={MessageSquare}
        title="Total Feedback"
        change="+156 from last month"
      />
      <StatCard
        value="24"
        color="purple"
        icon={Lightbulb}
        title="Optimization Ideas"
        change="+5 new suggestions"
      />
    </div>
  );
};

export default FeedbackOverview;
