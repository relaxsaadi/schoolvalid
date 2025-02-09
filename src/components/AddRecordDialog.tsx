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
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { StudentRecord } from "@/pages/Dashboard";
import { supabase } from "@/integrations/supabase/client";
import { Organization } from "@/types/organization";

interface AddRecordDialogProps {
  onAddRecord: (record: Omit<StudentRecord, "id" | "created_at">) => void;
}

export function AddRecordDialog({ onAddRecord }: AddRecordDialogProps) {
  const [open, setOpen] = useState(false);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrganization = async () => {
      if (!open) return;
      
      setIsLoading(true);
      try {
        console.log('Fetching user data...');
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error('Error fetching user:', userError);
          toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "Please sign in again.",
          });
          return;
        }
        
        if (!user) {
          console.error('No user found');
          toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "Please sign in to continue.",
          });
          return;
        }

        console.log('Fetching profile data for user:', user.id);
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('organization_id')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not fetch user profile. Please try again.",
          });
          return;
        }

        if (!profileData?.organization_id) {
          console.error('No organization_id found in profile');
          toast({
            variant: "destructive",
            title: "Error",
            description: "No organization assigned to your profile. Please contact support.",
          });
          return;
        }

        console.log('Fetching organization data for org ID:', profileData.organization_id);
        const { data: orgData, error: orgError } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', profileData.organization_id)
          .single();
        
        if (orgError) {
          console.error('Error fetching organization:', orgError);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not fetch organization details. Please try again.",
          });
          return;
        }

        if (!orgData) {
          console.error('No organization data found');
          toast({
            variant: "destructive",
            title: "Error",
            description: "Organization not found. Please contact support.",
          });
          return;
        }

        console.log('Organization fetched successfully:', orgData);
        setOrganization(orgData);
      } catch (error) {
        console.error('Unexpected error:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganization();
  }, [open, toast]);
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!organization) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No organization found. Please try again.",
      });
      return;
    }

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
      organization_id: organization.id
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
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : !organization ? (
          <div className="py-8 text-center text-red-600">
            No organization found. Please try again or contact support.
          </div>
        ) : (
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
        )}
      </DialogContent>
    </Dialog>
  );
}
