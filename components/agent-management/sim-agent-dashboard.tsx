import React from "react";
import { Brain, Zap, ArrowRight, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SIMAgent } from "@/types/agent-systems";

interface SIMAgentDashboardProps {
  sim: SIMAgent;
  systemColor: string;
}

const SIMAgentDashboard: React.FC<SIMAgentDashboardProps> = ({
  sim,
  systemColor,
}) => {
  return (
    <Card
      className={`border bg-gradient-to-br from-${systemColor}-500/10 to-transparent`}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className={`h-5 w-5 text-${systemColor}-500`} />
          System Intelligence Manager (SIM)
          <Badge
            variant="outline"
            className={`ml-2 bg-${systemColor}-500/10 text-${systemColor}-500`}
          >
            {sim.status === "active" ? "Operational" : sim.status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-lg font-medium">{sim.name}</h3>
            <p className="text-sm text-muted-foreground">{sim.description}</p>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Brain className={`h-4 w-4 text-${systemColor}-500`} />
                  <span className="text-sm font-medium">Agents Supervised</span>
                </div>
                <p className="text-2xl font-bold">
                  {sim.metrics.agentsSupervised}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ArrowRight className={`h-4 w-4 text-${systemColor}-500`} />
                  <span className="text-sm font-medium">Optimizations</span>
                </div>
                <p className="text-2xl font-bold">
                  {sim.metrics.optimizationsApplied}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Zap className={`h-4 w-4 text-${systemColor}-500`} />
                  <span className="text-sm font-medium">Improvements</span>
                </div>
                <p className="text-2xl font-bold">
                  {sim.metrics.improvementsSuggested}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className={`h-4 w-4 text-${systemColor}-500`} />
                  <span className="text-sm font-medium">Alerts</span>
                </div>
                <p className="text-2xl font-bold">
                  {sim.metrics.alertsTriggered}
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-1 text-sm text-muted-foreground">
              <p>Last optimization: {sim.metrics.lastOptimization}</p>
              <p>Next scheduled review: {sim.metrics.nextReview}</p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="p-4 border-l-2 border-slate-700 ml-3">
              <p className="text-sm mb-4">
                The SIM (System Intelligence Manager) oversees and optimizes all
                agents in this system. It coordinates workflows, handles
                exceptions, and continuously improves performance.
              </p>

              <h4 className="text-sm font-medium mb-2">Current Tasks:</h4>
              <ul className="space-y-2">
                <li className="flex items-center text-sm">
                  <div
                    className={`h-2 w-2 rounded-full bg-${systemColor}-500 mr-2`}
                  ></div>
                  <span>Monitoring agent performance metrics</span>
                </li>
                <li className="flex items-center text-sm">
                  <div
                    className={`h-2 w-2 rounded-full bg-${systemColor}-500 mr-2`}
                  ></div>
                  <span>Coordinating inter-agent task handoffs</span>
                </li>
                <li className="flex items-center text-sm">
                  <div
                    className={`h-2 w-2 rounded-full bg-${systemColor}-500 mr-2`}
                  ></div>
                  <span>Analyzing workflow patterns for optimization</span>
                </li>
                <li className="flex items-center text-sm">
                  <div
                    className={`h-2 w-2 rounded-full bg-${systemColor}-500 mr-2`}
                  ></div>
                  <span>Scheduling routine system health checks</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SIMAgentDashboard;
