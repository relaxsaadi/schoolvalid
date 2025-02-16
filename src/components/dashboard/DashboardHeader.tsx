
import { ReactNode } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  children: ReactNode;
  setSidebarOpen?: (open: boolean) => void;
  showTitle?: boolean;
}

export const DashboardHeader = ({ children, setSidebarOpen, showTitle = true }: DashboardHeaderProps) => {
  const handleOpenSidebar = () => {
    if (setSidebarOpen) {
      setSidebarOpen(true);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b">
      <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </header>
  );
};
