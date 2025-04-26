import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import ThemeToggle from "@/components/theme-toggle";

const ClientContentSystemHeader = () => {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-slate-800 rounded-bl-4xl rounded-br-4xl bg-transparent backdrop-blur-xs px-4 sm:px-6">
      <SidebarTrigger />
      <h1 className="text-lg text-white font-bold">Content System</h1>
      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>
    </header>
  );
};

export default ClientContentSystemHeader;
