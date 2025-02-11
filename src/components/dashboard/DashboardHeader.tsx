
import { ReactNode } from "react";

interface DashboardHeaderProps {
  children: ReactNode;
}

export const DashboardHeader = ({ children }: DashboardHeaderProps) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <div className="flex items-center gap-4">
          {children}
        </div>
      </div>
    </header>
  );
};
