
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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function AddRecordDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (formData: FormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("You must be logged in to add records");
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();

      if (!profile?.organization_id) {
        throw new Error("No organization found for your profile");
      }

      const now = new Date().toISOString();
      const record = {
        recipient_name: formData.get('recipient_name') as string,
        certificate_number: formData.get('certificate_number') as string,
        course_name: formData.get('course_name') as string,
        valid_through: new Date(formData.get('valid_through') as string).toISOString(),
        status: 'active',
        email: formData.get('email') as string,
        year_of_birth: parseInt(formData.get('year_of_birth') as string),
        course_description: formData.get('course_description') as string || null,
        provider_description: formData.get('provider_description') as string || null,
        diploma_image_url: null,
        organization_id: profile.organization_id,
        blockchain_hash: 'pending',
        blockchain_timestamp: now,
        issue_date: now,
        provider: 'Default Provider'
      };

      const { error } = await supabase
        .from('certificates')
        .insert([record]);

      if (error) throw error;
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
}
