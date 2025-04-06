import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { topAgents } from "@/mock/agents";

const TopAgents = () => {
  return (
    <div className="h-[350px] w-full overflow-y-auto pr-2 space-y-8">
      {topAgents.map((agent) => (
        <div key={agent.name} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback className={agent.color}>
              {agent.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{agent.name}</p>
            <p className="text-sm text-muted-foreground">{agent.type}</p>
          </div>
          <div className={`ml-auto font-medium ${agent.textColor}`}>
            {agent.successRate}%
          </div>
          <div className="ml-2 w-24">
            <Progress
              value={agent.successRate}
              className="h-2 bg-muted"
              indicatorClassName={agent.color}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopAgents;
