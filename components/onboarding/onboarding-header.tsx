import { SidebarTrigger } from "@/components/ui/sidebar";

const OnboardingHeader = () => {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-transparent backdrop-blur-xs px-4 sm:px-6">
      <SidebarTrigger />
    </header>
  );
};

export default OnboardingHeader;
