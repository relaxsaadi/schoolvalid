
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
      if (sessionError || !user) {
        console.error('Session error:', sessionError);
        toast({
          title: "Authentication Error",
          description: "Please sign in again",
          variant: "destructive",
        });
        navigate('/sign-in');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .maybeSingle();

      if (!profile?.organization_id) {
        toast({
          title: "Error",
          description: "No organization found for your profile",
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
        setError("Unable to fetch records");
        return;
      }

      setRecords(certificatesData || []);
    } catch (error) {
      console.error('Fetch records error:', error);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRecord = async (newRecord: Omit<StudentRecord, "id" | "created_at">) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Not authenticated");
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .maybeSingle();

      if (!profile?.organization_id) {
        throw new Error("No organization found");
      }

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
          organization_id: profile.organization_id,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding record:', error);
        throw new Error(error.message);
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
        description: error instanceof Error ? error.message : "Failed to add record",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [navigate]);

  return {
    records,
    isLoading,
    error,
    fetchRecords,
    handleAddRecord,
  };
};
