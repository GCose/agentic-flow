// src/components/agent-management/agent-crew-workflow.tsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SystemDetail, AgentWorkflow } from "@/types/agent-systems";

interface AgentCrewWorkflowProps {
  system: SystemDetail;
  systemColor: string;
}

// Clear type definitions for workflow visualization
interface WorkflowNode {
  id: string;
  name: string;
  type: "agent" | "sim" | "data";
  status: "idle" | "processing" | "completed" | "error";
  position: number;
}

interface WorkflowConnection {
  source: string;
  target: string;
  status: "active" | "inactive" | "error";
  dataType: "trigger" | "data" | "result";
}

const AgentCrewWorkflow: React.FC<AgentCrewWorkflowProps> = ({
  system,
  systemColor,
}) => {
  const [workflowData, setWorkflowData] = useState<AgentWorkflow | null>(null);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [currentWorkflow, setCurrentWorkflow] = useState<{
    nodes: WorkflowNode[];
    connections: WorkflowConnection[];
  }>({
    nodes: [],
    connections: [],
  });

  // Load workflow data - this would come from an API in a real implementation
  useEffect(() => {
    // Simulated API call to get workflow data
    const loadWorkflowData = async (): Promise<void> => {
      try {
        // This would be a real API call in production
        const response = await fetch(
          `/api/agent-systems/${system.id}/workflow`
        );
        if (!response.ok) throw new Error("Failed to fetch workflow data");

        // For demo purposes, generate mock workflow data instead
        const mockWorkflow: AgentWorkflow = {
          id: `workflow-${system.id}`,
          name: `${system.name} Workflow`,
          status: "active",
          currentTask: "task-3",
          tasks: [
            {
              id: "task-1",
              name:
                system.id === "content-system"
                  ? "Content Topic Selection"
                  : system.id === "leadgen-system"
                  ? "Lead Qualification"
                  : system.id === "sales-system"
                  ? "Sales Call Preparation"
                  : "Client Onboarding",
              status: "completed",
              startTime: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
              endTime: new Date(Date.now() - 3300000).toISOString(), // 55 minutes ago
              assignedTo: system.agents[0].id,
              outputs: ["Topic selected: AI Agent Infrastructure"],
              nextTask: "task-2",
            },
            {
              id: "task-2",
              name:
                system.id === "content-system"
                  ? "Content Research"
                  : system.id === "leadgen-system"
                  ? "Lead Enrichment"
                  : system.id === "sales-system"
                  ? "Sales Pitch Creation"
                  : "Welcome Sequence",
              status: "completed",
              startTime: new Date(Date.now() - 3240000).toISOString(), // 54 minutes ago
              endTime: new Date(Date.now() - 2700000).toISOString(), // 45 minutes ago
              assignedTo: system.agents[1].id,
              outputs: ["Research compiled with 15 reference sources"],
              nextTask: "task-3",
            },
            {
              id: "task-3",
              name:
                system.id === "content-system"
                  ? "Content Creation"
                  : system.id === "leadgen-system"
                  ? "Lead Strategy Development"
                  : system.id === "sales-system"
                  ? "Objection Handling Preparation"
                  : "Asset Collection",
              status: "in-progress",
              startTime: new Date(Date.now() - 2640000).toISOString(), // 44 minutes ago
              endTime: null,
              assignedTo: system.agents[2].id,
              outputs: [],
              nextTask: "task-4",
            },
            {
              id: "task-4",
              name:
                system.id === "content-system"
                  ? "Content Optimization"
                  : system.id === "leadgen-system"
                  ? "Outreach Preparation"
                  : system.id === "sales-system"
                  ? "Proposal Development"
                  : "Project Setup",
              status: "pending",
              startTime: null,
              endTime: null,
              assignedTo: system.agents[3].id,
              outputs: [],
              nextTask: "task-5",
            },
            {
              id: "task-5",
              name:
                system.id === "content-system"
                  ? "Content Distribution"
                  : system.id === "leadgen-system"
                  ? "Outreach Execution"
                  : system.id === "sales-system"
                  ? "Deal Closing"
                  : "Kickoff Preparation",
              status: "pending",
              startTime: null,
              endTime: null,
              assignedTo: system.agents[4].id,
              outputs: [],
              nextTask: null,
            },
          ],
          execution: {
            startTime: new Date(Date.now() - 3600000).toISOString(),
            estimatedEndTime: new Date(Date.now() + 3600000).toISOString(),
            progress: 45,
            agentHandoffs: [
              {
                from: system.agents[0].id,
                to: system.agents[1].id,
                time: new Date(Date.now() - 3300000).toISOString(),
                data: "Topic selected with keywords and objectives",
              },
              {
                from: system.agents[1].id,
                to: system.agents[2].id,
                time: new Date(Date.now() - 2700000).toISOString(),
                data: "Research data and content structure",
              },
            ],
            simInterventions: [
              {
                time: new Date(Date.now() - 3000000).toISOString(),
                agentId: system.agents[1].id,
                action: "Prioritized research sources",
                reason: "Detected potential quality issues",
              },
            ],
          },
        };

        setWorkflowData(mockWorkflow);

        // Build visual workflow nodes and connections
        const nodes: WorkflowNode[] = [];
        const connections: WorkflowConnection[] = [];

        // Add SIM node
        nodes.push({
          id: system.sim.id,
          name: "System Intelligence Manager",
          type: "sim",
          status: "processing",
          position: 0,
        });

        // Add agent nodes based on tasks
        mockWorkflow.tasks.forEach((task, index) => {
          const agent = system.agents.find((a) => a.id === task.assignedTo);
          if (agent) {
            nodes.push({
              id: agent.id,
              name: agent.name,
              type: "agent",
              status:
                task.status === "completed"
                  ? "completed"
                  : task.status === "in-progress"
                  ? "processing"
                  : "idle",
              position: index + 1,
            });

            // Connect SIM to all agents
            connections.push({
              source: system.sim.id,
              target: agent.id,
              status: "active",
              dataType: "trigger",
            });

            // Connect agents in sequence
            if (index > 0) {
              const prevAgent = system.agents.find(
                (a) => a.id === mockWorkflow.tasks[index - 1].assignedTo
              );
              if (prevAgent) {
                connections.push({
                  source: prevAgent.id,
                  target: agent.id,
                  status: task.status === "pending" ? "inactive" : "active",
                  dataType: "data",
                });
              }
            }
          }
        });

        setCurrentWorkflow({ nodes, connections });
      } catch (error) {
        console.error("Failed to load workflow data:", error);
      }
    };

    loadWorkflowData();

    // Update workflow simulation every 10 seconds
    const interval = setInterval(() => {
      if (!workflowData) return;

      // Simulate progress in the workflow
      setWorkflowData((prev) => {
        if (!prev) return prev;

        const updated = { ...prev };

        // Update current in-progress task
        const inProgressTaskIndex = updated.tasks.findIndex(
          (t) => t.status === "in-progress"
        );
        if (inProgressTaskIndex >= 0) {
          // 10% chance to complete the task
          if (Math.random() < 0.1) {
            updated.tasks[inProgressTaskIndex].status = "completed";
            updated.tasks[inProgressTaskIndex].endTime =
              new Date().toISOString();

            // Start the next task
            if (inProgressTaskIndex < updated.tasks.length - 1) {
              updated.tasks[inProgressTaskIndex + 1].status = "in-progress";
              updated.tasks[inProgressTaskIndex + 1].startTime =
                new Date().toISOString();
              updated.currentTask = updated.tasks[inProgressTaskIndex + 1].id;

              // Add handoff
              updated.execution.agentHandoffs.push({
                from: updated.tasks[inProgressTaskIndex].assignedTo,
                to: updated.tasks[inProgressTaskIndex + 1].assignedTo,
                time: new Date().toISOString(),
                data: `Completed ${
                  updated.tasks[inProgressTaskIndex].name
                } and handed off to ${
                  updated.tasks[inProgressTaskIndex + 1].name
                }`,
              });
            }
          } else {
            // Add some output to the in-progress task
            if (
              Math.random() < 0.3 &&
              updated.tasks[inProgressTaskIndex].outputs.length < 3
            ) {
              const outputs = [
                "Processed 15 new data points",
                "Extracted key insights from sources",
                "Generated initial draft section",
                "Optimized content structure",
                "Applied NLP enhancements to text",
              ];
              updated.tasks[inProgressTaskIndex].outputs.push(
                outputs[Math.floor(Math.random() * outputs.length)]
              );
            }
          }
        }

        // Occasional SIM interventions
        if (Math.random() < 0.05) {
          const activeAgentId = updated.tasks.find(
            (t) => t.status === "in-progress"
          )?.assignedTo;
          if (activeAgentId) {
            const interventions = [
              "Optimized processing parameters",
              "Enhanced resource allocation",
              "Provided additional context",
              "Corrected potential error in workflow",
            ];
            updated.execution.simInterventions.push({
              time: new Date().toISOString(),
              agentId: activeAgentId,
              action:
                interventions[Math.floor(Math.random() * interventions.length)],
              reason: "Proactive optimization",
            });
          }
        }

        // Update progress
        const completedTasks = updated.tasks.filter(
          (t) => t.status === "completed"
        ).length;
        updated.execution.progress = Math.round(
          (completedTasks / updated.tasks.length) * 100
        );

        return updated;
      });

      // Update visual workflow
      setCurrentWorkflow((prev) => {
        if (!workflowData) return prev;

        const updatedNodes = prev.nodes.map((node) => {
          // Update node status based on task status
          const relatedTask = workflowData.tasks.find(
            (t) => t.assignedTo === node.id
          );
          if (relatedTask) {
            const status: "completed" | "processing" | "idle" =
              relatedTask.status === "completed"
                ? "completed"
                : relatedTask.status === "in-progress"
                ? "processing"
                : "idle";
            return {
              ...node,
              status,
            };
          }
          return node;
        });

        // Update connections based on task progression
        const updatedConnections = prev.connections.map((conn) => {
          const sourceNode = updatedNodes.find((n) => n.id === conn.source);
          const targetNode = updatedNodes.find((n) => n.id === conn.target);

          if (sourceNode && targetNode) {
            if (    
              sourceNode.status === "completed" &&
              targetNode.status === "processing"
            ) {
              return { ...conn, status: "active" as const };
            } else if (
              sourceNode.status === "processing" &&
              targetNode.status === "idle"
            ) {
              return { ...conn, status: "inactive" as const };
            }
          }

          return { ...conn, status: conn.status as "active" | "inactive" | "error" };
        });

        return {
          nodes: updatedNodes,
          connections: updatedConnections,
        };
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [system.id, system.name, system.agents, system.sim.id, workflowData]);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in-progress":
        return "bg-blue-500";
      case "error":
        return "bg-red-500";
      case "pending":
        return "bg-slate-500";
      default:
        return "bg-slate-500";
    }
  };

  const formatTime = (isoString: string | null): string => {
    if (!isoString) return "Not started";

    const date = new Date(isoString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getTimeDifference = (
    start: string | null,
    end: string | null
  ): string => {
    if (!start || !end) return "N/A";

    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMs = endDate.getTime() - startDate.getTime();
    const diffSec = Math.floor(diffMs / 1000);

    if (diffSec < 60) return `${diffSec}s`;
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ${diffSec % 60}s`;
    return `${Math.floor(diffSec / 3600)}h ${Math.floor(
      (diffSec % 3600) / 60
    )}m`;
  };

  if (!workflowData) {
    return (
      <div className="flex items-center justify-center h-64">
        Loading workflow data...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Workflow Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">{workflowData.name}</h2>
          <p className="text-sm text-muted-foreground">
            Started: {formatTime(workflowData.execution.startTime)} • Est.
            Completion: {formatTime(workflowData.execution.estimatedEndTime)}
          </p>
        </div>
        <Badge
          className={`${getStatusColor(
            workflowData.status
          )}/20 text-${systemColor}-500`}
        >
          {workflowData.status.charAt(0).toUpperCase() +
            workflowData.status.slice(1)}
        </Badge>
      </div>

      {/* Workflow Progress */}
      <Card className="border-slate-800 bg-slate-900/50">
        <CardHeader>
          <CardTitle className="text-lg">
            Workflow Progress: {workflowData.execution.progress}%
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Visual workflow diagram */}
          <div className="relative h-40 mb-8">
            {/* Draw nodes */}
            {currentWorkflow.nodes.map((node, index) => (
              <div
                key={node.id}
                className={`absolute w-32 h-12 rounded-md flex items-center justify-center text-center text-xs
                           ${
                             node.type === "sim"
                               ? "border-purple-500 border-2 bg-purple-500/10"
                               : node.type === "agent"
                               ? `border-${systemColor}-500 border bg-${systemColor}-500/10`
                               : "border-slate-500 bg-slate-500/10"
                           }`}
                style={{
                  left: `${index * 20}%`,
                  top: node.type === "sim" ? "0" : "80px",
                }}
              >
                <div className="relative">
                  <span className="block font-medium truncate w-28">
                    {node.name.replace(" Agent", "")}
                  </span>
                  {/* Status indicator */}
                  <div
                    className={`absolute -top-1 -right-1 w-3 h-3 rounded-full
                                ${
                                  node.status === "processing"
                                    ? "bg-blue-500 animate-pulse"
                                    : node.status === "completed"
                                    ? "bg-green-500"
                                    : node.status === "error"
                                    ? "bg-red-500"
                                    : "bg-slate-500"
                                }`}
                  ></div>
                </div>
              </div>
            ))}

            {/* Draw connections */}
            {currentWorkflow.connections.map((conn) => {
              const sourceNode = currentWorkflow.nodes.find(
                (n) => n.id === conn.source
              );
              const targetNode = currentWorkflow.nodes.find(
                (n) => n.id === conn.target
              );

              if (!sourceNode || !targetNode) return null;

              const sourcePos = sourceNode.position * 20;
              const targetPos = targetNode.position * 20;
              const sourceY = sourceNode.type === "sim" ? 12 : 92;
              const targetY = targetNode.type === "sim" ? 12 : 92;

              // For SIM to agent connections (vertical)
              if (sourceNode.type === "sim" && targetNode.type === "agent") {
                return (
                  <svg
                    key={`${conn.source}-${conn.target}`}
                    className="absolute top-0 left-0 w-full h-full pointer-events-none"
                  >
                    <line
                      x1={`${sourcePos + 8}%`}
                      y1={sourceY}
                      x2={`${targetPos + 8}%`}
                      y2={targetY - 12}
                      stroke={
                        conn.status === "active"
                          ? conn.dataType === "trigger"
                            ? "#8b5cf6"
                            : "#3b82f6"
                          : conn.status === "error"
                          ? "#ef4444"
                          : "#6b7280"
                      }
                      strokeWidth="2"
                      strokeDasharray={
                        conn.status === "inactive" ? "4 2" : "none"
                      }
                    />
                    {/* Animated dot for active connections */}
                    {conn.status === "active" && (
                      <circle
                        cx={`${sourcePos + 8}%`}
                        cy={sourceY + 10}
                        r="3"
                        fill={
                          conn.dataType === "trigger" ? "#8b5cf6" : "#3b82f6"
                        }
                        className="animate-pulse"
                      >
                        <animateMotion
                          path={`M0,0 L${targetPos - sourcePos},${
                            targetY - sourceY - 12
                          }`}
                          dur="1.5s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}
                  </svg>
                );
              }

              // For agent to agent connections (horizontal)
              return (
                <svg
                  key={`${conn.source}-${conn.target}`}
                  className="absolute top-0 left-0 w-full h-full pointer-events-none"
                >
                  <line
                    x1={`${sourcePos + 16}%`}
                    y1={sourceY}
                    x2={`${targetPos}%`}
                    y2={targetY}
                    stroke={
                      conn.status === "active"
                        ? "#3b82f6"
                        : conn.status === "error"
                        ? "#ef4444"
                        : "#6b7280"
                    }
                    strokeWidth="2"
                    strokeDasharray={
                      conn.status === "inactive" ? "4 2" : "none"
                    }
                  />
                  {/* Animated dot for active connections */}
                  {conn.status === "active" && (
                    <circle
                      cx={`${sourcePos + 16}%`}
                      cy={sourceY}
                      r="3"
                      fill="#3b82f6"
                    >
                      <animateMotion
                        path={`M0,0 L${targetPos - sourcePos - 16},0`}
                        dur="1.5s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                </svg>
              );
            })}
          </div>

          {/* Task timeline */}
          <div className="mt-8 space-y-3">
            <h3 className="text-lg font-medium">Task Timeline</h3>
            <div className="space-y-4">
              {workflowData.tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-lg border border-slate-800 
                             ${
                               task.id === selectedTask
                                 ? `bg-${systemColor}-500/10`
                                 : "bg-slate-900/50"
                             }
                             cursor-pointer transition-colors`}
                  onClick={() =>
                    setSelectedTask(task.id === selectedTask ? null : task.id)
                  }
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${getStatusColor(
                          task.status
                        )}`}
                      ></div>
                      <h4 className="font-medium">{task.name}</h4>
                    </div>
                    <Badge variant="outline">
                      {task.status === "completed"
                        ? "Completed"
                        : task.status === "in-progress"
                        ? "In Progress"
                        : task.status === "error"
                        ? "Error"
                        : "Pending"}
                    </Badge>
                  </div>

                  {(task.id === selectedTask ||
                    task.status === "in-progress") && (
                    <div className="mt-3 pl-5 border-l-2 border-slate-800 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Assigned To:
                        </span>
                        <span>
                          {system.agents
                            .find((a) => a.id === task.assignedTo)
                            ?.name.replace(" Agent", "")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Start Time:
                        </span>
                        <span>{formatTime(task.startTime)}</span>
                      </div>
                      {task.endTime && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              End Time:
                            </span>
                            <span>{formatTime(task.endTime)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Duration:
                            </span>
                            <span>
                              {getTimeDifference(task.startTime, task.endTime)}
                            </span>
                          </div>
                        </>
                      )}

                      {task.outputs.length > 0 && (
                        <div className="mt-3">
                          <span className="text-muted-foreground block mb-1">
                            Outputs:
                          </span>
                          <ul className="space-y-1">
                            {task.outputs.map((output, idx) => (
                              <li
                                key={idx}
                                className="text-xs bg-slate-800 rounded p-2"
                              >
                                {output}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Agent Handoffs */}
          {workflowData.execution.agentHandoffs.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-3">Agent Handoffs</h3>
              <div className="space-y-3">
                {workflowData.execution.agentHandoffs.map((handoff, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50"
                  >
                    <div className="text-blue-500 mt-1">→</div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <span className="font-medium">
                            {system.agents
                              .find((a) => a.id === handoff.from)
                              ?.name.replace(" Agent", "")}
                          </span>
                          <span className="mx-2 text-muted-foreground">to</span>
                          <span className="font-medium">
                            {system.agents
                              .find((a) => a.id === handoff.to)
                              ?.name.replace(" Agent", "")}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(handoff.time)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {handoff.data}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SIM Interventions */}
          {workflowData.execution.simInterventions.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-3">SIM Interventions</h3>
              <div className="space-y-3">
                {workflowData.execution.simInterventions.map(
                  (intervention, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20"
                    >
                      <div className="text-purple-500 mt-1">⚡</div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <span className="font-medium">SIM</span>
                            <span className="mx-2 text-muted-foreground">
                              →
                            </span>
                            <span className="font-medium">
                              {system.agents
                                .find((a) => a.id === intervention.agentId)
                                ?.name.replace(" Agent", "")}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(intervention.time)}
                          </span>
                        </div>
                        <p className="text-sm mt-1">{intervention.action}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Reason: {intervention.reason}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentCrewWorkflow;
