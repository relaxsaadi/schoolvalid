
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { AddRecordForm } from "./student-records/AddRecordForm";
import { NewStudentRecord } from "@/types/records";
import { FC } from "react";

interface AddRecordDialogProps {
  onAddRecord: (record: NewStudentRecord) => Promise<void>;
}

export const AddRecordDialog: FC<AddRecordDialogProps> = ({ onAddRecord }) => {
  const [open, setOpen] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    try {
      const record: NewStudentRecord = {
        recipient_name: formData.get('recipient_name') as string,
        certificate_number: formData.get('certificate_number') as string,
        course_name: formData.get('course_name') as string,
        valid_through: new Date(formData.get('valid_through') as string).toISOString(),
        status: 'active',
        year_of_birth: parseInt(formData.get('year_of_birth') as string),
        course_description: formData.get('course_description') as string || null,
        provider_description: formData.get('provider_description') as string || null,
        organization_id: '', // This will be set by the handler
        blockchain_hash: 'pending',
        blockchain_timestamp: new Date().toISOString(),
        issue_date: new Date().toISOString(),
        provider: formData.get('provider') as string,
        email: formData.get('email') as string,
        diploma_image_url: formData.get('diploma_image_url') as string || null
      };

      await onAddRecord(record);
      setOpen(false);
    } catch (error) {
      console.error('Error adding record:', error);
      throw error;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Record
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Record</DialogTitle>
        </DialogHeader>
        <AddRecordForm
          onSubmit={handleSubmit}
          onClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

