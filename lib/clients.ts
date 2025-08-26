import { ClientData, SystemConfigs } from "@/types/clients";
import { BarChart, FileText, Users, FileInput, Calendar, Clock, AlertCircle, ArrowLeft } from "lucide-react";

export async function getClientById(clientId: string): Promise<ClientData | null> {
  try {
    const res = await fetch(`/api/clients/${clientId}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data as ClientData;
  } catch (err) {
    console.error("Error fetching client:", err);
    return null;
  }
}

export async function getSystemsConfig(): Promise<SystemConfigs> {
  try {
    const res = await fetch("/api/systems");
    if (!res.ok) return {};
    const data = await res.json();
    // Map icon string to actual imported component
    const iconMap: Record<string, any> = {
      BarChart,
      FileText,
      Users,
      FileInput,
      Calendar,
      Clock,
      AlertCircle,
      ArrowLeft,
    };
    const config: SystemConfigs = {};
    data.forEach((sys: { name: string; icon?: string; description?: string; bgGradient?: string; iconClassName?: string; color?: string }) => {
      config[sys.name] = {
        ...sys,
        icon: sys.icon && iconMap[sys.icon] ? iconMap[sys.icon] : AlertCircle,
        color: sys.color || "#2563eb", // default color if not provided
        description: sys.description || "", // default to empty string
        bgGradient: sys.bgGradient || "", // default to empty string
        iconClassName: sys.iconClassName || "", // default to empty string
      };
    });
    return config;
  } catch (err) {
    console.error("Error fetching systems config:", err);
    return {};
  }
}
