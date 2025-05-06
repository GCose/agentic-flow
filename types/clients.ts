export interface Client {
  id: string;
  name: string;
  description: string;
  systems: string[];
  agents: number;
  createdAt: string;
  subscriptionDuration: string;
}

// Define TypeScript interfaces
export interface ClientStats {
  agents: number;
  projects: number;
  activeUsers: number;
  successRate: number;
}

export interface ClientData {
  id: string;
  name: string;
  description: string;
  systems: string[];
  stats: ClientStats;
  activeTime: string;
  createdAt: string;
}

export interface SystemConfig {
  icon: React.ElementType;
  color: string;
  description: string;
  bgGradient: string;
  iconClassName: string;
}

export type SystemConfigs = Record<string, SystemConfig>;
