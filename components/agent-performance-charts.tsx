import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const agentNames = ["AgenticGPT", "InsightBot", "FlowAgent", "VisionAI", "SummarizerX"];
const tasksCompleted = [142, 85, 101, 67, 120];
const usageCounts = [320, 198, 243, 110, 210];
const successRates = [98, 95, 99, 92, 97];
const avgResponseTimes = [1.2, 1.8, 0.9, 2.3, 1.0];

export const barData = {
  labels: agentNames,
  datasets: [
    {
      label: "Tasks Completed",
      data: tasksCompleted,
      backgroundColor: "#6366f1",
    },
    {
      label: "Usage Count",
      data: usageCounts,
      backgroundColor: "#a78bfa",
    },
  ],
};

export const successData = {
  labels: agentNames,
  datasets: [
    {
      label: "Success Rate (%)",
      data: successRates,
      backgroundColor: "#34d399",
    },
    {
      label: "Avg Response (s)",
      data: avgResponseTimes,
      backgroundColor: "#fbbf24",
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Agentic AI Metrics",
    },
  },
};

const AgentPerformanceCharts: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
    <div className="bg-white rounded-lg shadow p-4">
      <Bar data={barData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { display: true, text: "Tasks & Usage" } } }} />
    </div>
    <div className="bg-white rounded-lg shadow p-4">
      <Bar data={successData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { display: true, text: "Success Rate & Response Time" } } }} />
    </div>
  </div>
);

export default AgentPerformanceCharts;
