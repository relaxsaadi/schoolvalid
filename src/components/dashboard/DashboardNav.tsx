
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, LayoutDashboard, ScrollText, GraduationCap, Users, Settings } from "lucide-react";

const navigationItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: ScrollText, label: "Certificates" },
  { icon: GraduationCap, label: "Courses" },
  { icon: Users, label: "Students" },
  { icon: Settings, label: "Settings" },
];

interface DashboardNavProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const DashboardNav = ({ sidebarOpen, setSidebarOpen }: DashboardNavProps) => {
  return (
    <>
      {/* Mobile Navigation */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden fixed top-4 left-4 z-50">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-16 items-center border-b px-6">
            <img
              className="h-8 w-auto"
              src="/placeholder.svg"
              alt="Company Logo"
            />
          </div>
          <nav className="flex flex-col gap-1 p-4">
            {navigationItems.map((item) => (
              <Button
                key={item.label}
                variant={item.active ? "secondary" : "ghost"}
                className="justify-start w-full"
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r">
        <div className="flex h-16 items-center border-b px-6">
          <img
            className="h-8 w-auto"
            src="/placeholder.svg"
            alt="Company Logo"
          />
        </div>
        <nav className="flex flex-col gap-1 p-4 flex-1">
          {navigationItems.map((item) => (
            <Button
              key={item.label}
              variant={item.active ? "secondary" : "ghost"}
              className="justify-start w-full"
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </nav>
      </div>
    </>
  );
};
