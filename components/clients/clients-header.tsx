import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface ClientDashboardHeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const ClientDashboardHeader = ({
  searchTerm,
  setSearchTerm,
}: ClientDashboardHeaderProps) => {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border border-slate-800 rounded-bl-4xl rounded-br-4xl bg-transparent backdrop-blur-xs px-4 sm:px-6">
      <SidebarTrigger />

      <div className="relative w-full md:w-72">
        <Input
          value={searchTerm}
          placeholder="Search clients..."
          className="w-full border-slate-800"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </header>
  );
};

export default ClientDashboardHeader;
