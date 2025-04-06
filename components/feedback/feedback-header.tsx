import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";

const FeedbackHeader = () => {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-transparent backdrop-blur-xs px-4 sm:px-6">
      <SidebarTrigger />

      <div className="flex flex-1 items-center gap-4">
        <Input placeholder="Search feedback..." className="max-w-sm" />
      </div>

      <Button variant="outline">
        <Filter className="mr-2 h-4 w-4" />
        Filter
      </Button>
    </header>
  );
};

export default FeedbackHeader;
