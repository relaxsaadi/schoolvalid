
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DashboardFiltersProps {
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  onDateFilterChange: (date: Date | undefined) => void;
}

export const DashboardFilters = ({
  statusFilter,
  onStatusFilterChange,
  onDateFilterChange,
}: DashboardFiltersProps) => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <Select
          value={statusFilter}
          onValueChange={onStatusFilterChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1">
        <Input
          type="date"
          onChange={(e) => onDateFilterChange(e.target.value ? new Date(e.target.value) : undefined)}
          className="w-full"
        />
      </div>
    </div>
  );
};
