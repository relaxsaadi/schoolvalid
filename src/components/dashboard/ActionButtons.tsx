
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddRecordDialog } from "@/components/AddRecordDialog";
import { StudentRecord } from "@/types/records";

interface ActionButtonsProps {
  onAddRecord: (record: Omit<StudentRecord, "id" | "created_at">) => Promise<void>;
}

export const ActionButtons = ({ onAddRecord }: ActionButtonsProps) => {
  return (
    <div className="mb-6 flex flex-wrap gap-4">
      <AddRecordDialog onAddRecord={onAddRecord} />
      <Button variant="outline">
        <Download className="mr-2 h-4 w-4" /> Export Records
      </Button>
    </div>
  );
};
