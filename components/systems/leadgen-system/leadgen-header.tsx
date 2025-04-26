import { ArrowLeft, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import ThemeToggle from "@/components/theme-toggle";
import { useRouter } from "next/router";

interface LeadGenHeaderProps {
  title: string;
  hasBackButton?: boolean;
  clientId?: string;
  role?: "admin" | "client";
}

const LeadGenHeader = ({
  title,
  hasBackButton = false,
  clientId,
  role = "admin", // Default to admin for backward compatibility
}: LeadGenHeaderProps) => {
  const router = useRouter();

  const handleBack = () => {
    // Check if we're in client or admin role
    if (role === "client") {
      // Client role navigation goes back to client paths
      router.push("/client/leadgen-system");
    } else {
      // Admin role navigation
      if (clientId) {
        router.push(`/admin/clients/${clientId}`);
      } else {
        router.push("/admin/leadgen-system");
      }
    }
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-slate-800 rounded-bl-4xl rounded-br-4xl bg-transparent backdrop-blur-xs px-4 sm:px-6">
      <SidebarTrigger />

      {hasBackButton && (
        <Button size="icon" variant="ghost" onClick={handleBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
      )}

      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
    </header>
  );
};

export default LeadGenHeader;
