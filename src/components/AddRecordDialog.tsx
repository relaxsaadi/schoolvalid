
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
  onAddRecord: (record: Omit<StudentRecord, "id" | "createdAt">) => void;
}

export function AddRecordDialog({ onAddRecord }: AddRecordDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newRecord = {
      studentName: formData.get("studentName") as string,
      studentId: formData.get("studentId") as string,
      course: formData.get("course") as string,
    };
    
    onAddRecord(newRecord);
    toast({
      title: "Success",
      description: "Record added successfully",
    });
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
            <Label htmlFor="studentName">Student Name</Label>
            <Input
              id="studentName"
              name="studentName"
              type="text"
              placeholder="Enter student name"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="studentId">Student ID</Label>
            <Input
              id="studentId"
              name="studentId"
              type="text"
              placeholder="Enter student ID"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="course">Course</Label>
            <Input
              id="course"
              name="course"
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
