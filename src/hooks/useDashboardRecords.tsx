
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { StudentRecord } from "@/types/records";

export const useDashboardRecords = () => {
  const [records, setRecords] = useState<StudentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchRecords = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data: { user }, error: sessionError } = await supabase.auth.getUser();
      if (sessionError) {
        console.error('Session error:', sessionError);
        toast({
          title: "Authentication Error",
          description: "Please sign in again",
          variant: "destructive",
        });
        navigate('/sign-in');
        return;
      }

      if (!user) {
        navigate('/sign-in');
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Profile error:', profileError);
        toast({
          title: "Error",
          description: "Unable to fetch your profile. Please try signing out and back in.",
          variant: "destructive",
        });
        return;
      }

      if (!profile?.organization_id) {
        toast({
          title: "Error",
          description: "No organization found for your profile. Please contact support.",
          variant: "destructive",
        });
        return;
      }

      const { data: certificatesData, error: certificatesError } = await supabase
        .from('certificates')
        .select('*')
        .eq('organization_id', profile.organization_id)
        .order('created_at', { ascending: false });

      if (certificatesError) {
        console.error('Certificates error:', certificatesError);
        toast({
          title: "Error",
          description: "Unable to fetch records. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setRecords(certificatesData || []);
    } catch (error) {
      console.error('Fetch records error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRecord = async (newRecord: Omit<StudentRecord, "id" | "created_at">) => {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .insert([{
          recipient_name: newRecord.recipient_name,
          certificate_number: newRecord.certificate_number,
          course_name: newRecord.course_name,
          status: newRecord.status || 'active',
          blockchain_hash: 'pending',
          blockchain_timestamp: new Date().toISOString(),
          issue_date: new Date().toISOString(),
          valid_through: newRecord.valid_through,
          year_of_birth: newRecord.year_of_birth,
          email: newRecord.email,
          course_description: newRecord.course_description,
          diploma_image_url: newRecord.diploma_image_url,
          provider_description: newRecord.provider_description,
          provider: 'Default Provider',
          organization_id: newRecord.organization_id,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding record:', error);
        toast({
          title: "Error",
          description: "Failed to add record: " + error.message,
          variant: "destructive",
        });
        return;
      }

      setRecords((prev) => [data, ...prev]);
      toast({
        title: "Success",
        description: "Record added successfully",
      });
    } catch (error) {
      console.error('Add record error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while adding the record",
        variant: "destructive",
      });
    }
  };

  return {
    records,
    isLoading,
    error,
    fetchRecords,
    handleAddRecord,
  };
};
