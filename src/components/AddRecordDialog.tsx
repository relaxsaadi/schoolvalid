
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

export function AddRecordDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here we'll add the actual record submission logic later
    toast({
      title: "Success",
      description: "Record added successfully",
    });
    setOpen(false);
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
              type="text"
              placeholder="Enter student name"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="studentId">Student ID</Label>
            <Input
              id="studentId"
              type="text"
              placeholder="Enter student ID"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="course">Course</Label>
            <Input
              id="course"
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
