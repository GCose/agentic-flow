import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import ThemeToggle from "@/components/theme-toggle";

const DashboardHeader = () => {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border border-slate-800 rounded-bl-4xl rounded-br-4xl bg-transparent backdrop-blur-xs px-4 sm:px-6">
      <SidebarTrigger />

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
