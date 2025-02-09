
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StudentRecord } from "@/pages/Dashboard";
import { StudentIdGenerator } from "./StudentIdGenerator";

interface AddRecordFormProps {
  generatedId: string;
  onGenerateNewId: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  organizationId: string | null;
}

export function AddRecordForm({ 
  generatedId, 
  onGenerateNewId, 
  onSubmit,
  organizationId 
}: AddRecordFormProps) {
  if (!organizationId) {
    return (
      <div className="py-4 text-center text-red-500">
        Organization not found. Please try logging out and back in.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 py-4">
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
      
      <StudentIdGenerator 
        generatedId={generatedId} 
        onRegenerate={onGenerateNewId}
      />

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
        <Label htmlFor="status">Status *</Label>
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
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter email"
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
  );
}
