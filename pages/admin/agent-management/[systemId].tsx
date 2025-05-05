// src/pages/admin/agent-management/[systemId].tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { ArrowLeft, BrainCircuit, Activity } from "lucide-react";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import AgentErrorAnalysis from "@/components/agent-management/agent-error-analysis";
import AgentPerformanceMatrix from "@/components/agent-management/agent-performance-matrix";
import AgentResponseTimes from "@/components/agent-management/agent-response-time";
import AgentTaskDistribution from "@/components/agent-management/agent-task-distribution";
import SIMAgentDashboard from "@/components/agent-management/sim-agent-dashboard";
import { fetchSystemDetail } from "@/lib/api/agent-management-api";
import { SystemDetail } from "@/types/agent-systems";

const SystemAgentManagementPage = ()   => {
  const router = useRouter();
  const { systemId } = router.query;
  const [activeTab, setActiveTab] = useState("dashboard");
  const [system, setSystem] = useState<SystemDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    if (systemId && typeof systemId === "string") {
      const loadSystemData = async () => {
        setLoading(true);
        try {
          // In a real app, this would be an API call
          const data = await fetchSystemDetail(systemId);
          setSystem(data);
        } catch (error) {
          console.error("Failed to fetch system data:", error);
        } finally {
          setLoading(false);
        }
      };

      loadSystemData();

      // Simulate real-time updates
      const interval = setInterval(() => {
        loadSystemData();
        setLastUpdate(new Date());
      }, 15000); // Update every 15 seconds

      return () => clearInterval(interval);
    }
  }, [systemId]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex-1 p-8 space-y-6">
          <Skeleton className="h-12 w-1/4" />
          <Skeleton className="h-60 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      </DashboardLayout>
    );
  }

  if (!system) {
    return (
      <DashboardLayout>
        <div className="flex-1 p-8 flex items-center justify-center">
          <p>System not found</p>
        </div>
      </DashboardLayout>
    );
  }

  const getSystemColor = () => {
    const colorMap: Record<string, string> = {
      "content-system": "blue",
      "leadgen-system": "purple",
      "sales-system": "green",
      "onboarding-system": "orange",
    };
    return colorMap[system.id] || "blue";
  };

  const systemColor = getSystemColor();

  return (
    <>
      <Head>
        <title>Agentic Flow | {system.name} System</title>
        <meta
          name="description"
          content={`Real-time monitoring of the ${system.name}`}
        />
      </Head>
      <DashboardLayout>
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-transparent backdrop-blur-xs px-4 sm:px-6">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => router.push("/admin/agent-management")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className={`rounded-full bg-${systemColor}-500/10 p-1.5`}>
              <BrainCircuit className={`h-5 w-5 text-${systemColor}-500`} />
            </div>
            <h2 className="text-xl font-semibold">{system.name}</h2>
          </div>
          <div className="ml-auto text-sm text-muted-foreground">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
        </header>

        <div className="flex-1 space-y-6 p-8">
          {/* System Intelligence Manager Dashboard */}
          <SIMAgentDashboard sim={system.sim} systemColor={systemColor} />

          {/* Tabs for different views */}
          <Tabs
            value={activeTab}
            className="space-y-4"
            onValueChange={setActiveTab}
          >
            <TabsList className="grid grid-cols-4 bg-slate-800/30">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="tasks">Task Distribution</TabsTrigger>
              <TabsTrigger value="errors">Error Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-4">
              <Card className="border bg-transparent">
                <CardHeader>
                  <CardTitle>Agent Performance Matrix</CardTitle>
                </CardHeader>
                <CardContent>
                  <AgentPerformanceMatrix
                    agents={system.agents}
                    systemColor={systemColor}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <Card className="border bg-transparent">
                <CardHeader>
                  <CardTitle>Agent Response Times</CardTitle>
                </CardHeader>
                <CardContent>
                  <AgentResponseTimes
                    agents={system.agents}
                    systemColor={systemColor}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tasks" className="space-y-4">
              <Card className="border bg-transparent">
                <CardHeader>
                  <CardTitle>Task Distribution & Completion Rates</CardTitle>
                </CardHeader>
                <CardContent>
                  <AgentTaskDistribution
                    agents={system.agents}
                    systemColor={systemColor}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="errors" className="space-y-4">
              <Card className="border bg-transparent">
                <CardHeader>
                  <CardTitle>Error Frequency & Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <AgentErrorAnalysis
                    agents={system.agents}
                    systemColor={systemColor}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Agent Activity Timeline */}
          <Card className="border bg-transparent">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Real-Time Agent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] relative overflow-hidden">
                {system.agents.map((agent, index) => (
                  <div
                    key={agent.id}
                    className={`absolute left-0 right-0 py-2 px-4 rounded-md bg-${systemColor}-500/10 flex items-center justify-between`}
                    style={{
                      top: `${index * 40}px`,
                      opacity: Math.random() > 0.3 ? 1 : 0.5,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-3 w-3 rounded-full bg-${systemColor}-500 animate-pulse`}
                      ></div>
                      <span className="font-medium">{agent.name}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {
                        [
                          "Processing request",
                          "Analyzing data",
                          "Generating content",
                          "Waiting for input",
                          "Executing task",
                        ][Math.floor(Math.random() * 5)]
                      }
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {Math.floor(Math.random() * 59) + 1}s ago
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </>
  );
};

export default SystemAgentManagementPage;
