
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddRecordDialog } from "@/components/AddRecordDialog";
import { StudentRecord } from "@/pages/Dashboard";

interface DashboardHeaderProps {
  onAddRecord: (newRecord: Omit<StudentRecord, "id" | "created_at">) => Promise<void>;
}

export function DashboardHeader({ onAddRecord }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between space-y-2">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      <div className="flex items-center space-x-2">
        <AddRecordDialog onAddRecord={onAddRecord} />
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" /> Export
        </Button>
      </div>
    </div>
  );
}
