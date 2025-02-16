
import { ReactNode } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  children: ReactNode;
  setSidebarOpen?: (open: boolean) => void;
  pageTitle: string;
}

export const DashboardHeader = ({ children, setSidebarOpen, pageTitle }: DashboardHeaderProps) => {
  const handleOpenSidebar = () => {
    if (setSidebarOpen) {
      setSidebarOpen(true);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b">
      <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <div className="flex-1 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={handleOpenSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">{pageTitle}</h1>
        </div>
        <div className="flex items-center gap-4">
          {children}
        </div>
      </div>
    </header>
  );
};
