import React from "react";
import { Brain, Zap, ArrowRight, Gauge, Settings } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SIMAgent {
  id: string;
  name: string;
  description: string;
  status: "active" | "maintenance" | "offline" | "error";
  performanceScore: number;
  successRate: number;
  activeSince: string;
  lastActivity: string;
  metrics: {
    agentsSupervised: number;
    improvementsSuggested: number;
    optimizationsApplied: number;
    alertsTriggered: number;
  };
}

interface SIMAgentCardProps {
  sim: SIMAgent;
  systemColor: string;
}

const SIMAgentCard: React.FC<SIMAgentCardProps> = ({ sim, systemColor }) => {
  return (
    <Card
      className={`border-none bg-gradient-to-br from-${systemColor}-500/20 to-${systemColor}-500/5`}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className={`h-5 w-5 text-${systemColor}-500`} />
          System Intelligence Manager (SIM)
          <Badge
            variant="outline"
            className={`ml-2 bg-${systemColor}-500/10 text-${systemColor}-500`}
          >
            Operational
          </Badge>
        </CardTitle>
        <CardDescription>
          The SIM oversees all agents in this system, ensuring optimal
          performance and continuous improvement
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">{sim.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {sim.description}
            </p>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-muted-foreground">
                    Efficiency Rating
                  </span>
                  <span className="text-sm">{sim.performanceScore}%</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-2 bg-${systemColor}-500 rounded-full`}
                    style={{ width: `${sim.performanceScore}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Active since</span>
                <span>{sim.activeSince}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Last activity</span>
                <span>{sim.lastActivity}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                <Gauge className="mr-2 h-4 w-4" />
                Performance
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Configure
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium uppercase text-muted-foreground">
              SIM Metrics
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <Brain className={`h-4 w-4 text-${systemColor}-500`} />
                  <span className="text-sm font-medium">Agents Supervised</span>
                </div>
                <p className="text-2xl font-bold">
                  {sim.metrics.agentsSupervised}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className={`h-4 w-4 text-${systemColor}-500`} />
                  <span className="text-sm font-medium">Improvements</span>
                </div>
                <p className="text-2xl font-bold">
                  {sim.metrics.improvementsSuggested}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <ArrowRight className={`h-4 w-4 text-${systemColor}-500`} />
                  <span className="text-sm font-medium">Optimizations</span>
                </div>
                <p className="text-2xl font-bold">
                  {sim.metrics.optimizationsApplied}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className={`h-4 w-4 text-${systemColor}-500`} />
                  <span className="text-sm font-medium">Alerts</span>
                </div>
                <p className="text-2xl font-bold">
                  {sim.metrics.alertsTriggered}
                </p>
              </div>
            </div>

            <div className="mt-4 text-sm text-muted-foreground">
              <p>Last system optimization: 12 hours ago</p>
              <p>Next scheduled review: 12 hours from now</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SIMAgentCard;
