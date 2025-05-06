import { SidebarTrigger } from "@/components/ui/sidebar";
import ThemeToggle from "../theme-toggle";

const AgentManagementHeader = () => {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-slate-800 rounded-br-4xl rounded-bl-4xl gap-4 border-b bg-transparent backdrop-blur-xs px-4 sm:px-6">
      <SidebarTrigger />
      <ThemeToggle />
    </header>
  );
};

export default AgentManagementHeader;
