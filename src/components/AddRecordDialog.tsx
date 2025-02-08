
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
import { StudentRecord, Course } from "@/pages/Dashboard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddRecordDialogProps {
  onAddRecord: (record: Omit<StudentRecord, "id" | "created_at">) => void;
  courses: Course[];
}

export function AddRecordDialog({ onAddRecord, courses }: AddRecordDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (!selectedCourse) {
      toast({
        title: "Error",
        description: "Please select a course",
        variant: "destructive",
      });
      return;
    }

    const newRecord = {
      recipient_name: formData.get("recipient_name") as string,
      certificate_number: formData.get("certificate_number") as string,
      course_name: selectedCourse.name,
      course_id: selectedCourse.id,
      valid_through: formData.get("valid_through") as string,
      status: formData.get("status") as string,
      email: formData.get("email") as string,
      year_of_birth: parseInt(formData.get("year_of_birth") as string),
      course_description: formData.get("course_description") as string,
      diploma_image_url: formData.get("diploma_image_url") as string || null,
    };
    
    onAddRecord(newRecord);
    setOpen(false);
    (e.target as HTMLFormElement).reset();
    setSelectedCourse(null);
  };

  const handleCourseSelect = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (course) {
      setSelectedCourse(course);
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
            <Label htmlFor="course">Course</Label>
            <Select
              value={selectedCourse?.id || undefined}
              onValueChange={handleCourseSelect}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  course.id ? (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name}
                    </SelectItem>
                  ) : null
                ))}
              </SelectContent>
            </Select>
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
