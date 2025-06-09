import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { FileText, Users, ShoppingBag, UserPlus } from "lucide-react";
import { fetchSystemsOverview } from "@/lib/api/agent-management-api";
import SystemCard from "@/components/agent-management/agent-system-card";
import AgentManagementHeader from "@/components/agent-management/agent-management-header";
import {
  SystemOverview,
  SystemOverviewWithVisuals,
} from "@/types/agent-systems";
import { AdminPageMeta } from "@/page-config/meta.config";

const AgentManagementPage: NextPage = () => {
  const router = useRouter();
  const [systems, setSystems] = useState<SystemOverview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [updateTime, setUpdateTime] = useState<Date>(new Date());

  // Load systems data
  useEffect(() => {
    const loadData = async (): Promise<void> => {
      setLoading(true);
      try {
        const data = await fetchSystemsOverview();
        setSystems(data);
      } catch (error) {
        console.error("Failed to fetch systems data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Simulate real-time updates
    const interval = setInterval(() => {
      loadData();
      setUpdateTime(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleSystemClick = (systemId: string): void => {
    router.push(`/admin/agent-management/${systemId}`);
  };

  const systemsWithVisuals: SystemOverviewWithVisuals[] = systems.map(
    (system) => {
      const iconMap: Record<
        string,
        React.ComponentType<{ className?: string }>
      > = {
        "content-system": FileText,
        "leadgen-system": Users,
        "sales-system": ShoppingBag,
        "onboarding-system": UserPlus,
      };

      const colorMap: Record<string, string> = {
        "content-system": "blue",
        "leadgen-system": "purple",
        "sales-system": "green",
        "onboarding-system": "orange",
      };

      return {
        ...system,
        icon: iconMap[system.id] || FileText,
        color: colorMap[system.id] || "blue",
        bgGradient: `from-${colorMap[system.id]}-500/10 to-${
          colorMap[system.id]
        }-500/5`,
        iconColor: `text-${colorMap[system.id]}-500`,
      };
    }
  );

  return (
    <DashboardLayout meta={AdminPageMeta.agentManagementPage}>
      <AgentManagementHeader />
      <div className="flex-1 space-y-6 p-8 pt-6">
        {/*==================== Agent Management Title ====================*/}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Agent Management
            </h2>
            <p className="text-muted-foreground pt-2">
              Monitor and manage your AI agent crews
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            Last updated: {updateTime.toLocaleTimeString()}
          </div>
        </div>
        {/*==================== End of Agent Management Title ====================*/}

        {/*==================== System Cards ====================*/}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 mt-8">
          {loading
            ? Array(4)
                .fill(null)
                .map((_, i) => (
                  <Card
                    key={i}
                    className="border-slate-800 bg-transparent animate-pulse"
                  >
                    <CardContent className="p-6 h-48"></CardContent>
                  </Card>
                ))
            : systemsWithVisuals.map((system) => (
                <SystemCard
                  key={system.id}
                  system={system}
                  onClick={() => handleSystemClick(system.id)}
                />
              ))}
        </div>
        {/*==================== End of System Cards ====================*/}
      </div>
    </DashboardLayout>
  );
};

export default AgentManagementPage;
