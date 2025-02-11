
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { StudentRecord, NewStudentRecord } from "@/types/records";

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

      // First get the user's organization_id
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Profile error:', profileError);
        setError("Unable to fetch organization data");
        return;
      }

      if (!profile?.organization_id) {
        console.log('No organization found, triggering organization creation');
        // Update profile to trigger organization creation
        const { error: updateError } = await supabase
          .from('profiles')
          .upsert({ 
            id: user.id,
            organization_id: null 
          });

        if (updateError) {
          console.error('Error triggering organization creation:', updateError);
          setError("Unable to create organization");
          return;
        }

        // Fetch the profile again after organization creation
        const { data: updatedProfile, error: updatedProfileError } = await supabase
          .from('profiles')
          .select('organization_id')
          .eq('id', user.id)
          .maybeSingle();

        if (updatedProfileError || !updatedProfile?.organization_id) {
          console.error('Error fetching updated profile:', updatedProfileError);
          setError("Unable to fetch organization data");
          return;
        }

        // Use the newly created organization
        const { data: certificates, error: certificatesError } = await supabase
          .from('certificates')
          .select('*')
          .eq('organization_id', updatedProfile.organization_id)
          .order('created_at', { ascending: false });

        if (certificatesError) {
          console.error('Certificates error:', certificatesError);
          setError("Unable to fetch records");
          return;
        }

        setRecords(certificates || []);
        return;
      }

      // Then fetch certificates for this organization
      const { data: certificates, error: certificatesError } = await supabase
        .from('certificates')
        .select('*')
        .eq('organization_id', profile.organization_id)
        .order('created_at', { ascending: false });

      if (certificatesError) {
        console.error('Certificates error:', certificatesError);
        setError("Unable to fetch records");
        return;
      }

      setRecords(certificates || []);
    } catch (error) {
      console.error('Fetch records error:', error);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRecord = async (newRecord: NewStudentRecord) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Not authenticated");
      }

      // Get user's organization_id
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) {
        throw new Error("Error fetching organization");
      }

      if (!profile?.organization_id) {
        throw new Error("No organization found");
      }

      const { data, error } = await supabase
        .from('certificates')
        .insert([{
          ...newRecord,
          organization_id: profile.organization_id,
          status: newRecord.status || 'active',
          blockchain_hash: newRecord.blockchain_hash || 'pending',
          blockchain_timestamp: newRecord.blockchain_timestamp || new Date().toISOString(),
          issue_date: newRecord.issue_date || new Date().toISOString(),
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
