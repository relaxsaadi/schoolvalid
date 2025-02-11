
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { StudentRecord } from "@/types/records";

interface UpdateRecordFormProps {
  record: StudentRecord;
  onSubmit: (formData: FormData) => Promise<void>;
  onClose: () => void;
}

export function UpdateRecordForm({ record, onSubmit, onClose }: UpdateRecordFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      await onSubmit(formData);
      onClose();
      toast({
        title: "Success",
        description: "Record updated successfully",
      });
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update record",
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
          defaultValue={record.recipient_name}
          placeholder="Enter student name"
          required
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="certificate_number">Certificate Number</Label>
        <Input
          id="certificate_number"
          name="certificate_number"
          type="text"
          defaultValue={record.certificate_number}
          disabled
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="provider">Provider Name *</Label>
        <Input
          id="provider"
          name="provider"
          type="text"
          defaultValue={record.provider}
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
          defaultValue={record.course_name}
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
          defaultValue={new Date(record.valid_through).toISOString().split('T')[0]}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="year_of_birth">Year of Birth *</Label>
        <Input
          id="year_of_birth"
          name="year_of_birth"
          type="number"
          defaultValue={record.year_of_birth}
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
          defaultValue={record.course_description || ''}
          placeholder="Enter course description"
          className="min-h-[100px]"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="provider_description">Provider Description</Label>
        <Textarea
          id="provider_description"
          name="provider_description"
          defaultValue={record.provider_description || ''}
          placeholder="Enter provider description"
          className="min-h-[100px]"
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update Record"}
        </Button>
      </div>
    </form>
  );
}
