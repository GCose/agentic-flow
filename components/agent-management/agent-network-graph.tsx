// src/components/agent-management/agent-network-graph.tsx
import { useState, useEffect, useRef } from "react";
import { fetchAgentNetworkData } from "@/lib/api/agent-management-api";
import { useTheme } from "next-themes";

interface AgentNetworkGraphProps {
  height: number;
}

interface Node {
  id: string;
  type: string;
  system: string;
}

const AgentNetworkGraph: React.FC<AgentNetworkGraphProps> = ({ height }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    // Only run this effect once the component has mounted
    if (typeof window === "undefined") return;

    // Dynamically import d3 on the client side
    import("d3")
      .then((d3) => {
        const fetchAndRenderGraph = async () => {
          setLoading(true);
          try {
            const data = await fetchAgentNetworkData();

            if (!svgRef.current) return;

            // Clear previous graph
            d3.select(svgRef.current).selectAll("*").remove();

            const width = svgRef.current.clientWidth;

            const nodes: Node[] = [];
            const nodeMap = new Map();

            data.forEach((link) => {
              if (!nodeMap.has(link.source)) {
                const type = link.source.includes("sim") ? "sim" : "agent";
                const system = link.source.split("-")[0];
                nodes.push({ id: link.source, type, system });
                nodeMap.set(link.source, true);
              }

              if (!nodeMap.has(link.target)) {
                const type = link.target.includes("sim") ? "sim" : "agent";
                const system = link.target.split("-")[0];
                nodes.push({ id: link.target, type, system });
                nodeMap.set(link.target, true);
              }
            });

            // Color scale for systems
            const colorScale = d3
              .scaleOrdinal()
              .domain(["content", "leadgen", "sales", "onboarding"])
              .range(["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B"]);

            // Color for link types
            const linkColorScale = d3
              .scaleOrdinal()
              .domain(["data", "trigger", "feedback"])
              .range(["#6b7280", "#4ade80", "#f472b6"]);

            // Create a force simulation
            const simulation = d3
              .forceSimulation(nodes)
              .force(
                "link",
                d3
                  .forceLink(data)
                  .id((d: any) => d.id)
                  .distance(80)
              )
              .force("charge", d3.forceManyBody().strength(-100))
              .force("center", d3.forceCenter(width / 2, height / 2))
              .force("x", d3.forceX(width / 2).strength(0.05))
              .force("y", d3.forceY(height / 2).strength(0.05));

            // Draw links
            const link = d3
              .select(svgRef.current)
              .selectAll("line")
              .data(data)
              .enter()
              .append("line")
              .attr("stroke", (d: { type: string }) => linkColorScale(d.type) as string)
              .attr("stroke-opacity", 0.6)
              .attr("stroke-width", (d: any) => Math.sqrt(d.value));

            // Draw nodes
            const node = d3
              .select(svgRef.current)
              .selectAll("circle")
              .data(nodes)
              .enter()
              .append("circle")
              .attr("r", (d: Node) => (d.type === "sim" ? 8 : 5))
              .attr("fill", (d: Node) => colorScale(d.system) as string)
              .attr("stroke", theme === "dark" ? "#0f172a" : "#ffffff")
              .attr("stroke-width", 1.5)
              .call(
                d3
                  .drag()
                  .on("start", dragstarted)
                  .on("drag", dragged)
                  .on("end", dragended) as any
              );

            // Add tooltips
            node.append("title").text((d: any) => d.id);

            // Update positions
            simulation.on("tick", () => {
              link
                .attr("x1", (d: any) => (d.source as any).x)
                .attr("y1", (d: any) => (d.source as any).y)
                .attr("x2", (d: any) => (d.target as any).x)
                .attr("y2", (d: any) => (d.target as any).y);

              node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y);
            });

            // Drag functions
            function dragstarted(event: any, d: any) {
              if (!event.active) simulation.alphaTarget(0.3).restart();
              d.fx = d.x;
              d.fy = d.y;
            }

            function dragged(event: any, d: any) {
              d.fx = event.x;
              d.fy = event.y;
            }

            function dragended(event: any, d: any) {
              if (!event.active) simulation.alphaTarget(0);
              d.fx = null;
              d.fy = null;
            }

            // Add legend
            const legend = d3
              .select(svgRef.current)
              .append("g")
              .attr("transform", `translate(20, ${height - 100})`);

            // System colors
            const systems = [
              { name: "Content System", color: "#3B82F6" },
              { name: "LeadGen System", color: "#8B5CF6" },
              { name: "Sales System", color: "#10B981" },
              { name: "Onboarding System", color: "#F59E0B" },
            ];

            systems.forEach((system, i) => {
              legend
                .append("circle")
                .attr("cx", 10)
                .attr("cy", i * 20)
                .attr("r", 6)
                .attr("fill", system.color);

              legend
                .append("text")
                .attr("x", 25)
                .attr("y", i * 20 + 4)
                .text(system.name)
                .attr("font-size", "10px")
                .attr("fill", theme === "dark" ? "#e2e8f0" : "#1e293b");
            });
          } catch (error) {
            console.error("Failed to fetch or render network data:", error);
          } finally {
            setLoading(false);
          }
        };

        fetchAndRenderGraph();

        // Simulate real-time updates
        const interval = setInterval(fetchAndRenderGraph, 30000);

        return () => clearInterval(interval);
      })
      .catch((error) => {
        console.error("Failed to load d3:", error);
        setLoading(false);
      });
  }, [height, theme]);

  if (loading) {
    return (
      <div
        className="flex items-center justify-center bg-slate-800/20 rounded-lg animate-pulse"
        style={{ height }}
      >
        <span className="text-sm text-muted-foreground">
          Loading agent network...
        </span>
      </div>
    );
  }

  return (
    <svg
      ref={svgRef}
      width="100%"
      height={height}
      className="rounded-lg border border-slate-800"
    ></svg>
  );
};

export default AgentNetworkGraph;
