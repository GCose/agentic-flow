import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SystemCardProps } from "@/types/agent-systems";

const SystemCard: React.FC<SystemCardProps> = ({ system, onClick }) => {
  const {
    name,
    description,
    icon: Icon,
    agentCount,
    activeAgentCount,
    successRate,
    bgGradient,
    iconColor,
  } = system;

  return (
    <Card
      onClick={onClick}
      className={`border-none bg-gradient-to-br ${bgGradient} cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-1`}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div
            className={`rounded-lg ${iconColor.replace("text-", "bg-")}/10 p-3`}
          >
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
          <Badge
            variant="outline"
            className={`${iconColor} ${iconColor.replace("text-", "bg-")}/10`}
          >
            {activeAgentCount}/{agentCount} Active
          </Badge>
        </div>

        <h3 className="text-lg font-bold mt-4">{name}</h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>

        <div className="mt-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm text-muted-foreground">System Status</span>
            <Badge
              variant="outline"
              className={
                successRate > 95
                  ? "bg-green-500/10 text-green-500"
                  : successRate > 90
                  ? "bg-yellow-500/10 text-yellow-500"
                  : "bg-red-500/10 text-red-500"
              }
            >
              {successRate > 95
                ? "Healthy"
                : successRate > 90
                ? "Warning"
                : "Critical"}
            </Badge>
          </div>

          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>Success Rate: {successRate.toFixed(1)}%</span>
            <span>{system.metrics.tasksCompleted} Tasks</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemCard;
