
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FileText, Users, GraduationCap, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface DashboardNavProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const DashboardNav = ({ sidebarOpen, setSidebarOpen }: DashboardNavProps) => {
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: FileText },
    { name: "Certificates", href: "/certificates", icon: GraduationCap },
    { name: "Students", href: "/students", icon: Users },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-50 bg-gray-900/80 lg:hidden",
          sidebarOpen ? "block" : "hidden"
        )}
        onClick={() => setSidebarOpen(false)}
      />

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex h-16 items-center justify-between px-4 border-b">
            <Link to="/" className="text-xl font-semibold">
              Your App
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Button>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center px-4 py-2 text-sm font-medium rounded-md",
                    isActive
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5",
                      isActive ? "text-gray-900" : "text-gray-400"
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
};
