
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { StudentRecord } from "@/pages/Dashboard";
import { supabase } from "@/integrations/supabase/client";
import { AddRecordForm } from "./student-records/AddRecordForm";

interface AddRecordDialogProps {
  onAddRecord: (record: Omit<StudentRecord, "id" | "created_at">) => void;
}

export function AddRecordDialog({ onAddRecord }: AddRecordDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [generatedId, setGeneratedId] = useState("");
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const generateNewId = () => {
    const timestamp = new Date().getTime().toString().slice(-6);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    setGeneratedId(`STU${timestamp}${random}`);
  };

  useEffect(() => {
    async function fetchUserOrganization() {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error("Not authenticated");
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('organization_id')
          .eq('id', user.id)
          .single();
        
        if (profileError) {
          throw new Error(profileError.message);
        }
        
        if (!profile?.organization_id) {
          throw new Error("Organization not found");
        }
        
        setOrganizationId(profile.organization_id);
      } catch (error) {
        console.error('Error fetching organization:', error);
        toast({
          title: "Error",
          description: "Failed to fetch organization. Please try logging out and back in.",
          variant: "destructive",
        });
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }
    
    if (open) {
      fetchUserOrganization();
      generateNewId();
    }
  }, [open, toast]);
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      if (!organizationId) {
        throw new Error("Organization not found. Please try logging out and back in.");
      }

      const newRecord = {
        recipient_name: formData.get("recipient_name") as string,
        certificate_number: generatedId,
        course_name: formData.get("course_name") as string,
        valid_through: formData.get("valid_through") as string,
        status: formData.get("status") as string || 'active',
        email: formData.get("email") as string,
        year_of_birth: parseInt(formData.get("year_of_birth") as string),
        course_description: formData.get("course_description") as string || '',
        diploma_image_url: formData.get("diploma_image_url") as string || null,
        provider_description: formData.get("provider_description") as string || '',
        organization_id: organizationId,
      };

      if (!newRecord.recipient_name || !newRecord.certificate_number || 
          !newRecord.course_name || !newRecord.valid_through || 
          !newRecord.email || !newRecord.year_of_birth) {
        throw new Error("Please fill in all required fields");
      }

      onAddRecord(newRecord);
      setOpen(false);
      (e.target as HTMLFormElement).reset();
      
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add record",
        variant: "destructive",
      });
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
        {loading ? (
          <div className="py-4 text-center text-gray-500">
            Loading organization details...
          </div>
        ) : (
          <AddRecordForm
            generatedId={generatedId}
            onGenerateNewId={generateNewId}
            onSubmit={handleSubmit}
            organizationId={organizationId}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
