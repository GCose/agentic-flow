import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";

const AgentManagementHeader = () => {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-transparent backdrop-blur-xs px-4 sm:px-6">
      <SidebarTrigger />

      <div className="flex flex-1 items-center gap-4">
        <Input placeholder="Search agents..." className="max-w-sm" />
      </div>

      <Button className="ml-auto">
        <PlusCircle className="mr-2 h-4 w-4" />
        New Agent
      </Button>
    </header>
  );
};

export default AgentManagementHeader;
