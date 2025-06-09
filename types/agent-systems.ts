// src/types/agent-systems.ts
export interface Agent {
  id: string;
  name: string;
  description: string;
  status: "active" | "maintenance" | "offline" | "error";
  performanceScore: number;
  successRate: number;
  activeSince: string;
  lastActivity: string;
  responseTime: number;
  taskStats: {
    completed: number;
    failed: number;
    inProgress: number;
  };
  errorTypes: Record<string, number>;
  resourceUsage: {
    cpu: number;
    memory: number;
    tokens: number;
  };
}

export interface SIMAgent extends Agent {
  metrics: {
    agentsSupervised: number;
    improvementsSuggested: number;
    optimizationsApplied: number;
    alertsTriggered: number;
    lastOptimization: string;
    nextReview: string;
  };
}

export interface SystemOverview {
  id: string;
  name: string;
  description: string;
  agentCount: number;
  activeAgentCount: number;
  successRate: number;
  metrics: {
    tasksCompleted: number;
    responseTime: number;
    errorRate: number;
  };
}

export interface SystemMetrics {
  totalAgents: number;
  activeAgents: number;
  overallSuccessRate: number;
  tasksCompleted: number;
  averageResponseTime: number;
  lastUpdated: string;
  errorRate: number;
  totalCompletedTasks: number;
  currentActiveTasks: number;
}

export interface SystemDetail {
  id: string;
  name: string;
  description: string;
  agents: Agent[];
  sim: SIMAgent;
  metrics: SystemMetrics;
  workflows: AgentWorkflow[];
}

export interface AgentTask {
  id: string;
  name: string;
  status: "pending" | "in-progress" | "completed" | "error";
  startTime: string | null;
  endTime: string | null;
  assignedTo: string;
  outputs: string[];
  nextTask: string | null;
}

export interface AgentHandoff {
  from: string;
  to: string;
  time: string;
  data: string;
}

export interface SimIntervention {
  time: string;
  agentId: string;
  action: string;
  reason: string;
}

export interface TaskExecution {
  startTime: string;
  estimatedEndTime: string;
  progress: number;
  agentHandoffs: AgentHandoff[];
  simInterventions: SimIntervention[];
}

export interface AgentWorkflow {
  id: string;
  name: string;
  status: "pending" | "active" | "completed" | "error";
  currentTask: string;
  tasks: AgentTask[];
  execution: TaskExecution;
}

export interface WorkflowNode {
  id: string;
  name: string;
  type: "agent" | "sim" | "data";
  status: "idle" | "processing" | "completed" | "error";
  position: number;
}

export interface WorkflowConnection {
  source: string;
  target: string;
  status: "active" | "inactive" | "error";
  dataType: "trigger" | "data" | "result";
}

export interface SystemCardProps {
  system: SystemOverviewWithVisuals;
  onClick: () => void;
}

export interface SystemOverviewWithVisuals extends SystemOverview {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgGradient: string;
  iconColor: string;
}
