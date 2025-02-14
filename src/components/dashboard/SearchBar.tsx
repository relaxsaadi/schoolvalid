
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { StudentRecord } from "@/types/records";

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SearchBar = ({ className, value, onChange, ...props }: SearchBarProps) => {
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [filterDateRange, setFilterDateRange] = useState<string>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      (e.target as HTMLInputElement).value = '';
      onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <motion.div 
      className={cn("flex items-center gap-2", className)}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.form 
        onSubmit={handleSubmit} 
        className="relative group flex-1"
      >
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 pointer-events-none transition-colors duration-200" />
        <Input
          type="search"
          placeholder="Search certificates, recipients..."
          className={cn(
            "pl-9 w-full transition-all duration-200",
            "border-gray-200 focus:border-primary",
            "shadow-sm hover:shadow focus:shadow-md"
          )}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          {...props}
        />
      </motion.form>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Filter Certificates</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            Status: Active
          </DropdownMenuItem>
          <DropdownMenuItem>
            Status: Expiring Soon
          </DropdownMenuItem>
          <DropdownMenuItem>
            Status: Expired
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            Date: Last 30 days
          </DropdownMenuItem>
          <DropdownMenuItem>
            Date: Last 90 days
          </DropdownMenuItem>
          <DropdownMenuItem>
            Date: All time
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
};
