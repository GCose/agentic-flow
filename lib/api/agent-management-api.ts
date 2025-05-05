// src/lib/api/agent-management-api.ts
import {
  SystemOverview,
  SystemDetail,
  Agent,
  SIMAgent,
  AgentWorkflow,
} from "@/types/agent-systems";

// Mock data for systems overview
const systemsOverviewData: SystemOverview[] = [
  {
    id: "content-system",
    name: "Content System",
    description: "Content creation and distribution agents",
    agentCount: 10,
    activeAgentCount: 10,
    successRate: 97.2,
    metrics: {
      tasksCompleted: 423,
      responseTime: 620,
      errorRate: 2.8,
    },
  },
  {
    id: "leadgen-system",
    name: "LeadGen System",
    description: "Lead generation and qualification agents",
    agentCount: 18,
    activeAgentCount: 16,
    successRate: 94.8,
    metrics: {
      tasksCompleted: 568,
      responseTime: 875,
      errorRate: 5.2,
    },
  },
  {
    id: "sales-system",
    name: "Sales System",
    description: "Sales process and conversion agents",
    agentCount: 8,
    activeAgentCount: 7,
    successRate: 92.4,
    metrics: {
      tasksCompleted: 345,
      responseTime: 720,
      errorRate: 7.6,
    },
  },
  {
    id: "onboarding-system",
    name: "Onboarding System",
    description: "Client onboarding workflow agents",
    agentCount: 8,
    activeAgentCount: 8,
    successRate: 96.5,
    metrics: {
      tasksCompleted: 286,
      responseTime: 580,
      errorRate: 3.5,
    },
  },
];

// Simulate random fluctuations for real-time data
const addRandomVariation = (value: number, range: number): number => {
  return value + (Math.random() * range * 2 - range);
};

// Mock detailed system data
const generateSystemDetail = (systemId: string): SystemDetail => {
  const overview = systemsOverviewData.find((s) => s.id === systemId);
  if (!overview) throw new Error(`System not found: ${systemId}`);

  // Generate agent data
  const generateAgent = (index: number): Agent => {
    const statusOptions: Agent["status"][] = [
      "active",
      "maintenance",
      "offline",
      "error",
    ];
    const errorTypes: Record<string, number> = {
      "API Timeout": Math.floor(Math.random() * 10),
      "Output Validation": Math.floor(Math.random() * 8),
      "Context Overflow": Math.floor(Math.random() * 5),
      "Resource Exhaustion": Math.floor(Math.random() * 3),
      Authentication: Math.floor(Math.random() * 2),
    };

    // Generate base performance scores
    const basePerformance = 85 + Math.floor(Math.random() * 15);

    return {
      id: `${systemId}-agent-${index}`,
      name: `${
        systemId.split("-")[0].charAt(0).toUpperCase() +
        systemId.split("-")[0].slice(1)
      } Agent ${index + 1}`,
      description: `AI agent for the ${overview.name}`,
      status:
        Math.random() > 0.2
          ? "active"
          : statusOptions[Math.floor(Math.random() * statusOptions.length)],
      performanceScore: basePerformance,
      successRate: basePerformance + (Math.random() * 5 - 2.5),
      activeSince: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .split("T")[0],
      lastActivity: `${Math.floor(Math.random() * 60)} minutes ago`,
      responseTime: 500 + Math.floor(Math.random() * 1000),
      taskStats: {
        completed: Math.floor(Math.random() * 1000) + 100,
        failed: Math.floor(Math.random() * 50),
        inProgress: Math.floor(Math.random() * 10),
      },
      errorTypes,
      resourceUsage: {
        cpu: Math.random() * 100,
        memory: Math.random() * 100,
        tokens: Math.floor(Math.random() * 100000),
      },
    };
  };

  // Generate agents for this system
  const agents: Agent[] = Array.from(
    { length: overview.agentCount - 1 },
    (_, i) => generateAgent(i + 1)
  );

  // Create the SIM agent
  const sim: SIMAgent = {
    ...generateAgent(0),
    id: `${systemId}-sim`,
    name: `SIM - ${overview.name.replace(" System", "")} Intelligence Manager`,
    description: `Oversees all agents in the ${overview.name} and manages performance improvement`,
    status: "active",
    performanceScore: 97.5,
    successRate: 98.3,
    metrics: {
      agentsSupervised: overview.agentCount - 1,
      improvementsSuggested: Math.floor(Math.random() * 50) + 10,
      optimizationsApplied: Math.floor(Math.random() * 30) + 5,
      alertsTriggered: Math.floor(Math.random() * 10),
      lastOptimization: `${Math.floor(Math.random() * 24)} hours ago`,
      nextReview: `${Math.floor(Math.random() * 24)} hours from now`,
    },
  };

  // Generate mock workflow
  const mockWorkflow: AgentWorkflow = {
    id: `workflow-${systemId}`,
    name: `${overview.name} Workflow`,
    status: "active",
    currentTask: "task-3",
    tasks: [
      {
        id: "task-1",
        name:
          systemId === "content-system"
            ? "Content Topic Selection"
            : systemId === "leadgen-system"
            ? "Lead Qualification"
            : systemId === "sales-system"
            ? "Sales Call Preparation"
            : "Client Onboarding",
        status: "completed",
        startTime: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        endTime: new Date(Date.now() - 3300000).toISOString(), // 55 minutes ago
        assignedTo: agents[0].id,
        outputs: ["Topic selected: AI Agent Infrastructure"],
        nextTask: "task-2",
      },
      {
        id: "task-2",
        name:
          systemId === "content-system"
            ? "Content Research"
            : systemId === "leadgen-system"
            ? "Lead Enrichment"
            : systemId === "sales-system"
            ? "Sales Pitch Creation"
            : "Welcome Sequence",
        status: "completed",
        startTime: new Date(Date.now() - 3240000).toISOString(), // 54 minutes ago
        endTime: new Date(Date.now() - 2700000).toISOString(), // 45 minutes ago
        assignedTo: agents[1].id,
        outputs: ["Research compiled with 15 reference sources"],
        nextTask: "task-3",
      },
      {
        id: "task-3",
        name:
          systemId === "content-system"
            ? "Content Creation"
            : systemId === "leadgen-system"
            ? "Lead Strategy Development"
            : systemId === "sales-system"
            ? "Objection Handling Preparation"
            : "Asset Collection",
        status: "in-progress",
        startTime: new Date(Date.now() - 2640000).toISOString(), // 44 minutes ago
        endTime: null,
        assignedTo: agents[2].id,
        outputs: [],
        nextTask: "task-4",
      },
      {
        id: "task-4",
        name:
          systemId === "content-system"
            ? "Content Optimization"
            : systemId === "leadgen-system"
            ? "Outreach Preparation"
            : systemId === "sales-system"
            ? "Proposal Development"
            : "Project Setup",
        status: "pending",
        startTime: null,
        endTime: null,
        assignedTo: agents[3].id,
        outputs: [],
        nextTask: "task-5",
      },
      {
        id: "task-5",
        name:
          systemId === "content-system"
            ? "Content Distribution"
            : systemId === "leadgen-system"
            ? "Outreach Execution"
            : systemId === "sales-system"
            ? "Deal Closing"
            : "Kickoff Preparation",
        status: "pending",
        startTime: null,
        endTime: null,
        assignedTo: agents[4].id,
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
          from: agents[0].id,
          to: agents[1].id,
          time: new Date(Date.now() - 3300000).toISOString(),
          data: "Topic selected with keywords and objectives",
        },
        {
          from: agents[1].id,
          to: agents[2].id,
          time: new Date(Date.now() - 2700000).toISOString(),
          data: "Research data and content structure",
        },
      ],
      simInterventions: [
        {
          time: new Date(Date.now() - 3000000).toISOString(),
          agentId: agents[1].id,
          action: "Prioritized research sources",
          reason: "Detected potential quality issues",
        },
      ],
    },
  };

  // Build the system detail
  return {
    id: systemId,
    name: overview.name,
    description: overview.description,
    agents,
    sim,
    metrics: {
      totalAgents: overview.agentCount,
      activeAgents: overview.activeAgentCount,
      overallSuccessRate: overview.successRate,
      tasksCompleted: overview.metrics.tasksCompleted,
      averageResponseTime: overview.metrics.responseTime,
      lastUpdated: new Date().toISOString(),
      errorRate: overview.metrics.errorRate,
      totalCompletedTasks: agents.reduce(
        (sum, agent) => sum + agent.taskStats.completed,
        0
      ),
      currentActiveTasks: agents.reduce(
        (sum, agent) => sum + agent.taskStats.inProgress,
        0
      ),
    },
    workflows: [mockWorkflow],
  };
};

// Mock API functions with simulated network delay
export const fetchSystemsOverview = async (): Promise<SystemOverview[]> => {
  // Simulate network delay
  await new Promise((resolve) =>
    setTimeout(resolve, 300 + Math.random() * 500)
  );

  // Add some random variations to simulate real-time data
  return systemsOverviewData.map((system) => ({
    ...system,
    activeAgentCount: Math.min(
      system.agentCount,
      Math.max(
        Math.floor(
          system.activeAgentCount +
            (Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0)
        ),
        1
      )
    ),
    successRate: parseFloat(
      addRandomVariation(system.successRate, 0.5).toFixed(1)
    ),
    metrics: {
      ...system.metrics,
      tasksCompleted: Math.floor(
        addRandomVariation(system.metrics.tasksCompleted, 10)
      ),
      responseTime: Math.floor(
        addRandomVariation(system.metrics.responseTime, 50)
      ),
      errorRate: parseFloat(
        addRandomVariation(system.metrics.errorRate, 0.3).toFixed(1)
      ),
    },
  }));
};

export const fetchSystemDetail = async (
  systemId: string
): Promise<SystemDetail> => {
  // Simulate network delay
  await new Promise((resolve) =>
    setTimeout(resolve, 400 + Math.random() * 600)
  );

  return generateSystemDetail(systemId);
};
