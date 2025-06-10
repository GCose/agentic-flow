import { ArrowLeft, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import ThemeToggle from "@/components/theme-toggle";
import { useRouter } from "next/router";

interface DashboardHeaderProps {
  title: string;
  hasBackButton?: boolean;
  onBackClick?: () => void;
  pageId?: string;
  role?: "admin" | "client";
}

const DashboardHeader = ({
  title,
  hasBackButton = false,
  onBackClick,
  pageId,
  role,
}: DashboardHeaderProps) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
    } else if (pageId) {
      router.push(`/${role}/clients/${pageId}`);
    } else {
      router.push(`/${role}/leadgen-system`);
    }
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border border-slate-800 rounded-bl-4xl rounded-br-4xl bg-transparent backdrop-blur-xs px-4 sm:px-6">
      <SidebarTrigger />

      {hasBackButton && (
        <Button size="icon" variant="ghost" onClick={handleBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
      )}
      <h2 className="text-xl font-bold tracking-tight">{title}</h2>

      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <Button variant="outline" size="icon" className="relative rounded-full">
          <Bell className="h-4 w-4" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
            3
          </span>
        </Button>
      </div>
    </header>
  );
};

export default DashboardHeader;
