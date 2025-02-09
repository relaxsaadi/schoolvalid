
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
import { Textarea } from "@/components/ui/textarea";
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
      valid_through: formData.get("valid_through") as string,
      status: formData.get("status") as string,
      email: formData.get("email") as string,
      year_of_birth: parseInt(formData.get("year_of_birth") as string),
      course_description: formData.get("course_description") as string,
      diploma_image_url: formData.get("diploma_image_url") as string || null,
      provider_description: formData.get("provider_description") as string || '',
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
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
          <div className="grid gap-2">
            <Label htmlFor="valid_through">Valid Through</Label>
            <Input
              id="valid_through"
              name="valid_through"
              type="date"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Input
              id="status"
              name="status"
              type="text"
              placeholder="Enter status"
              defaultValue="active"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter email"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="year_of_birth">Year of Birth</Label>
            <Input
              id="year_of_birth"
              name="year_of_birth"
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              placeholder="Enter year of birth"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="course_description">Course Description</Label>
            <Textarea
              id="course_description"
              name="course_description"
              placeholder="Enter course description"
              className="min-h-[100px]"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="provider_description">Provider Description</Label>
            <Textarea
              id="provider_description"
              name="provider_description"
              placeholder="Enter provider description"
              className="min-h-[100px]"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="diploma_image_url">Diploma Image URL</Label>
            <Input
              id="diploma_image_url"
              name="diploma_image_url"
              type="url"
              placeholder="Enter diploma image URL"
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
