
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StudentIdGenerator } from "./StudentIdGenerator";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface AddRecordFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
  onClose: () => void;
}

export function AddRecordForm({ onSubmit, onClose }: AddRecordFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [generatedId, setGeneratedId] = useState(() => {
    const timestamp = new Date().getTime().toString().slice(-6);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `STU${timestamp}${random}`;
  });

  const generateNewId = () => {
    const timestamp = new Date().getTime().toString().slice(-6);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    setGeneratedId(`STU${timestamp}${random}`);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      
      // Validate email format
      const email = formData.get('email') as string;
      if (!email || !email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      await onSubmit(formData);
      onClose();
      toast({
        title: "Success",
        description: "Record added successfully",
      });
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add record",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="recipient_name">Student Name *</Label>
        <Input
          id="recipient_name"
          name="recipient_name"
          type="text"
          placeholder="Enter student name"
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email">Student Email *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter student email"
          required
        />
      </div>
      
      <StudentIdGenerator 
        generatedId={generatedId} 
        onRegenerate={generateNewId}
      />

      <div className="grid gap-2">
        <Label htmlFor="provider">Provider Name *</Label>
        <Input
          id="provider"
          name="provider"
          type="text"
          placeholder="Enter provider name"
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="course_name">Course *</Label>
        <Input
          id="course_name"
          name="course_name"
          type="text"
          placeholder="Enter course name"
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="valid_through">Valid Through *</Label>
        <Input
          id="valid_through"
          name="valid_through"
          type="date"
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="year_of_birth">Year of Birth *</Label>
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

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Record"}
        </Button>
      </div>
    </form>
  );
}
