import React from "react";

export interface AgentPerformance {
  id: number;
  name: string;
  type: string;
  tasksCompleted: number;
  usageCount: number;
  lastActive: string;
  status: "active" | "idle" | "offline";
  successRate: number;
  avgResponseTime: number;
}

const staticAgents: AgentPerformance[] = [
  {
    id: 1,
    name: "AgenticGPT",
    type: "Text Generation",
    tasksCompleted: 142,
    usageCount: 320,
    lastActive: "2025-08-24 14:32",
    status: "active",
    successRate: 98,
    avgResponseTime: 1.2,
  },
  {
    id: 2,
    name: "InsightBot",
    type: "Data Analysis",
    tasksCompleted: 85,
    usageCount: 198,
    lastActive: "2025-08-25 09:10",
    status: "idle",
    successRate: 95,
    avgResponseTime: 1.8,
  },
  {
    id: 3,
    name: "FlowAgent",
    type: "Workflow Automation",
    tasksCompleted: 101,
    usageCount: 243,
    lastActive: "2025-08-25 11:05",
    status: "active",
    successRate: 99,
    avgResponseTime: 0.9,
  },
  {
    id: 4,
    name: "VisionAI",
    type: "Image Recognition",
    tasksCompleted: 67,
    usageCount: 110,
    lastActive: "2025-08-25 10:45",
    status: "offline",
    successRate: 92,
    avgResponseTime: 2.3,
  },
  {
    id: 5,
    name: "SummarizerX",
    type: "Document Summarization",
    tasksCompleted: 120,
    usageCount: 210,
    lastActive: "2025-08-25 12:00",
    status: "active",
    successRate: 97,
    avgResponseTime: 1.0,
  },
];

const statusColor = {
  active: "bg-green-200 text-green-800",
  idle: "bg-yellow-100 text-yellow-800",
  offline: "bg-red-100 text-red-800",
};

const AgentPerformanceTable: React.FC = () => (
  <div className="overflow-x-auto rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg p-4">
    <table className="min-w-full border border-gray-300 rounded-lg">
      <thead className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
        <tr>
          <th className="px-4 py-2 border-b">Agent Name</th>
          <th className="px-4 py-2 border-b">Type</th>
          <th className="px-4 py-2 border-b">Status</th>
          <th className="px-4 py-2 border-b">Tasks Completed</th>
          <th className="px-4 py-2 border-b">Usage Count</th>
          <th className="px-4 py-2 border-b">Success Rate</th>
          <th className="px-4 py-2 border-b">Avg Response (s)</th>
          <th className="px-4 py-2 border-b">Last Active</th>
        </tr>
      </thead>
      <tbody>
        {staticAgents.map((agent) => (
          <tr key={agent.id} className="hover:bg-purple-50 transition text-white">
            <td className="px-4 py-2 border-b font-semibold text-white">{agent.name}</td>
            <td className="px-4 py-2 border-b text-white">{agent.type}</td>
            <td className={`px-4 py-2 border-b text-center rounded-sm font-bold ${statusColor[agent.status]}`}>{agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}</td>
            <td className="px-4 py-2 border-b text-center">{agent.tasksCompleted}</td>
            <td className="px-4 py-2 border-b text-center">{agent.usageCount}</td>
            <td className="px-4 py-2 border-b text-center">{agent.successRate}%</td>
            <td className="px-4 py-2 border-b text-center">{agent.avgResponseTime}</td>
            <td className="px-4 py-2 border-b">{agent.lastActive}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default AgentPerformanceTable;
