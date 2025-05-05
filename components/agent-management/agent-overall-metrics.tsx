import { Brain, Zap, CheckSquare, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const OverallAgentMetrics = () => {
  // Api simulation
  const metrics = {
    totalAgents: 44,
    activeAgents: 41,
    tasksCompleted: 1842,
    errorRate: 4.3,
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-slate-800 hover:-translate-y-2 duration-500 bg-transparent backdrop-blur-sm">
        <CardContent className="px-6 py-3">
          <div className="flex flex-row items-center justify-between space-y-4">
            <p className="text-sm font-medium text-muted-foreground">
              Total Agents
            </p>
            <Brain className="h-6 w-6 text-blue-500" />
          </div>
          <div className="text-2xl font-bold mt-2">{metrics.totalAgents}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Across all systems
          </p>
        </CardContent>
      </Card>

      <Card className="border-slate-800 hover:-translate-y-2 duration-500 bg-transparent backdrop-blur-sm">
        <CardContent className="px-6 py-3">
          <div className="flex flex-row items-center justify-between space-y-4">
            <p className="text-sm font-medium text-muted-foreground">
              Active Agents
            </p>
            <Zap className="h-6 w-6 text-green-500" />
          </div>
          <div className="text-2xl font-bold mt-2">{metrics.activeAgents}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {Math.round((metrics.activeAgents / metrics.totalAgents) * 100)}%
            operational
          </p>
        </CardContent>
      </Card>

      <Card className="border-slate-800 hover:-translate-y-2 duration-500 bg-transparent backdrop-blur-sm">
        <CardContent className="px-6 py-3">
          <div className="flex flex-row items-center justify-between space-y-4">
            <p className="text-sm font-medium text-muted-foreground">
              Tasks Completed
            </p>
            <CheckSquare className="h-6 w-6 text-purple-500" />
          </div>
          <div className="text-2xl font-bold mt-2">
            {metrics.tasksCompleted}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Last 7 days</p>
        </CardContent>
      </Card>

      <Card className="border-slate-800 hover:-translate-y-2 duration-500 bg-transparent backdrop-blur-sm">
        <CardContent className="px-6 py-3">
          <div className="flex flex-row items-center justify-between space-y-4">
            <p className="text-sm font-medium text-muted-foreground">
              Error Rate
            </p>
            <AlertCircle className="h-6 w-6 text-red-500" />
          </div>
          <div className="text-2xl font-bold mt-2">{metrics.errorRate}%</div>
          <p className="text-xs text-muted-foreground mt-1">
            Avg. across all systems
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverallAgentMetrics;
