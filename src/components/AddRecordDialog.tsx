
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { StudentRecord } from "@/pages/Dashboard";

interface AddRecordDialogProps {
  onAddRecord: (record: Omit<StudentRecord, "id" | "created_at">) => void;
}

export function AddRecordDialog({ onAddRecord }: AddRecordDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newRecord = {
      recipient_name: formData.get("recipient_name") as string,
      certificate_number: formData.get("certificate_number") as string,
      course_name: formData.get("course_name") as string,
    };
    
    onAddRecord(newRecord);
    setOpen(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Record
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Record</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="recipient_name">Student Name</Label>
            <Input
              id="recipient_name"
              name="recipient_name"
              type="text"
              placeholder="Enter student name"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="certificate_number">Student ID</Label>
            <Input
              id="certificate_number"
              name="certificate_number"
              type="text"
              placeholder="Enter student ID"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="course_name">Course</Label>
            <Input
              id="course_name"
              name="course_name"
              type="text"
              placeholder="Enter course name"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Add Record
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
