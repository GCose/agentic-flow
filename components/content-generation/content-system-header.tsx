import { useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import ThemeToggle from "@/components/theme-toggle";

interface ContentSystemHeaderProps {
  onSearch?: (query: string) => void;
  onFilter?: () => void;
}

const ContentSystemHeader = ({
  onSearch,
  onFilter,
}: ContentSystemHeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Call parent component's search handler if provided
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleFilterClick = () => {
    if (onFilter) {
      onFilter();
    }
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-transparent backdrop-blur-xs px-4 sm:px-6">
      <SidebarTrigger />

      <div className="flex flex-1 items-center gap-4">
        <Input
          placeholder="Search ad platforms and content..."
          className="max-w-sm"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <Button variant="outline" onClick={handleFilterClick}>
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>
    </header>
  );
};

export default ContentSystemHeader;
