
import { Search, SlidersHorizontal, CheckCircle2, AlertCircle, XCircle, Calendar } from "lucide-react";
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
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

  const toggleStatus = (status: string) => {
    setFilterStatus(current =>
      current.includes(status)
        ? current.filter(s => s !== status)
        : [...current, status]
    );
  };

  return (
    <div className="space-y-4">
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
            <Button 
              variant="outline" 
              className={cn(
                "flex items-center gap-2",
                (filterStatus.length > 0 || filterDateRange !== 'all') && "bg-primary/5 border-primary/20"
              )}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filter</span>
              {(filterStatus.length > 0 || filterDateRange !== 'all') && (
                <Badge 
                  variant="secondary" 
                  className="ml-1 bg-primary/10 text-primary hover:bg-primary/20"
                >
                  {filterStatus.length + (filterDateRange !== 'all' ? 1 : 0)}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-72"
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <span className="font-semibold">Filter Certificates</span>
                <span className="text-xs text-muted-foreground">
                  Select filters to refine your certificate view
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <div className="p-2">
              <div className="space-y-2">
                <h4 className="text-sm font-medium leading-none pl-2">Status</h4>
                <div className="grid gap-1">
                  <DropdownMenuCheckboxItem
                    checked={filterStatus.includes('active')}
                    onCheckedChange={() => toggleStatus('active')}
                    className="rounded-md"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Active</span>
                    </div>
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filterStatus.includes('expiring')}
                    onCheckedChange={() => toggleStatus('expiring')}
                    className="rounded-md"
                  >
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                      <span>Expiring Soon</span>
                    </div>
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filterStatus.includes('expired')}
                    onCheckedChange={() => toggleStatus('expired')}
                    className="rounded-md"
                  >
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span>Expired</span>
                    </div>
                  </DropdownMenuCheckboxItem>
                </div>
              </div>

              <DropdownMenuSeparator className="my-2" />
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium leading-none pl-2">Time Period</h4>
                <div className="grid gap-1">
                  <DropdownMenuCheckboxItem
                    checked={filterDateRange === '30days'}
                    onCheckedChange={() => setFilterDateRange('30days')}
                    className="rounded-md"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>Last 30 days</span>
                    </div>
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filterDateRange === '90days'}
                    onCheckedChange={() => setFilterDateRange('90days')}
                    className="rounded-md"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>Last 90 days</span>
                    </div>
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filterDateRange === 'all'}
                    onCheckedChange={() => setFilterDateRange('all')}
                    className="rounded-md"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>All time</span>
                    </div>
                  </DropdownMenuCheckboxItem>
                </div>
              </div>

              <DropdownMenuSeparator className="my-2" />
              
              <div className="flex items-center justify-between pt-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setFilterStatus([]);
                    setFilterDateRange('all');
                  }}
                  className="text-xs"
                >
                  Reset filters
                </Button>
                <Button 
                  size="sm"
                  onClick={() => document.body.click()} // Close dropdown
                >
                  Apply filters
                </Button>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>

      {(filterStatus.length > 0 || filterDateRange !== 'all') && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2"
        >
          {filterStatus.map(status => (
            <Badge
              key={status}
              variant="secondary"
              className="bg-primary/5 text-primary hover:bg-primary/10 cursor-pointer"
              onClick={() => toggleStatus(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              <XCircle className="h-3 w-3 ml-1" />
            </Badge>
          ))}
          {filterDateRange !== 'all' && (
            <Badge
              variant="secondary"
              className="bg-primary/5 text-primary hover:bg-primary/10 cursor-pointer"
              onClick={() => setFilterDateRange('all')}
            >
              {filterDateRange === '30days' ? 'Last 30 days' : 'Last 90 days'}
              <XCircle className="h-3 w-3 ml-1" />
            </Badge>
          )}
        </motion.div>
      )}
    </div>
  );
};
