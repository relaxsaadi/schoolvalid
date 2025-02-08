
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

interface AddCourseDialogProps {
  onAddCourse: (course: { name: string; description?: string }) => void;
}

export function AddCourseDialog({ onAddCourse }: AddCourseDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newCourse = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
    };
    
    onAddCourse(newCourse);
    setOpen(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" /> Add Course
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Course</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Course Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Enter course name"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Course Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter course description"
              className="min-h-[100px]"
            />
          </div>
          <Button type="submit" className="w-full">
            Add Course
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
