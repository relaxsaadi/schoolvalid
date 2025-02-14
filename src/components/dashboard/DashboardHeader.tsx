
import { ReactNode } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  children: ReactNode;
  setSidebarOpen?: (open: boolean) => void;
  showTitle?: boolean;
}

export const DashboardHeader = ({ children, setSidebarOpen, showTitle = true }: DashboardHeaderProps) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          {setSidebarOpen && (
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open sidebar</span>
            </Button>
          )}
          {showTitle && <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>}
        </div>
        <div className="flex items-center gap-4">
          {children}
        </div>
      </div>
    </header>
  );
};
