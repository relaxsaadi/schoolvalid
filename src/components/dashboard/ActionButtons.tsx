
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddRecordDialog } from "@/components/AddRecordDialog";
import { NewStudentRecord } from "@/types/records";
import { FC } from "react";

interface ActionButtonsProps {
  onAddRecord: (record: NewStudentRecord) => Promise<void>;
}

export const ActionButtons: FC<ActionButtonsProps> = ({ onAddRecord }) => {
  return (
    <div className="mb-6 flex flex-wrap gap-4">
      <AddRecordDialog onAddRecord={onAddRecord} />
      <Button variant="outline">
        <Download className="mr-2 h-4 w-4" /> Export Records
      </Button>
    </div>
  );
};
