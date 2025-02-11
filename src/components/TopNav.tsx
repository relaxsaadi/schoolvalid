
import { Bell, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { UserNav } from "./UserNav";

interface TopNavProps {
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
}

export function TopNav({ searchQuery, onSearchChange }: TopNavProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="w-full flex items-center gap-4 max-w-lg">
            {onSearchChange && (
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search records..."
                  className="w-full pl-10"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                />
              </div>
            )}
            <UserNav />
          </div>
        </div>
      </div>
    </header>
  );
}
