import { SidebarTrigger } from "@/components/ui/sidebar";
import ThemeToggle from "../theme-toggle";

const AgentManagementHeader = () => {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center border-slate-800 rounded-br-4xl rounded-bl-4xl gap-4 border-b bg-transparent backdrop-blur-xs px-4 sm:px-6">
      <SidebarTrigger />
      <div className="w-full flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Agent Management</h2>

        <ThemeToggle />
      </div>
    </header>
  );
};

export default AgentManagementHeader;
