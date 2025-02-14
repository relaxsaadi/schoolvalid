
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UpdateRecordForm } from "./UpdateRecordForm";
import { StudentRecord } from "@/types/records";

interface UpdateRecordDialogProps {
  record: StudentRecord;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateRecord: (formData: FormData) => Promise<void>;
}

export function UpdateRecordDialog({ record, open, onOpenChange, onUpdateRecord }: UpdateRecordDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Certificate</DialogTitle>
        </DialogHeader>
        <UpdateRecordForm
          record={record}
          onSubmit={onUpdateRecord}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
