
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { StudentRecord, NewStudentRecord } from "@/types/records";
import { useOrganization } from "./useOrganization";
import { useCertificates } from "./useCertificates";

export const useDashboardRecords = () => {
  const [records, setRecords] = useState<StudentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { createOrganization, getUserOrganization } = useOrganization();
  const { fetchOrganizationCertificates, addCertificate, updateCertificate } = useCertificates();

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

      let profile = await getUserOrganization(user.id);

      if (!profile?.organization_id) {
        const organization = await createOrganization(user);
        const certificates = await fetchOrganizationCertificates(organization.id);
        setRecords(certificates);
        return;
      }

      const certificates = await fetchOrganizationCertificates(profile.organization_id);
      setRecords(certificates);
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

      const profile = await getUserOrganization(user.id);
      if (!profile?.organization_id) {
        throw new Error("No organization found");
      }

      const data = await addCertificate(newRecord, profile.organization_id);
      setRecords(prev => [data, ...prev]);
      
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

  const handleUpdateRecord = async (recordId: string, formData: FormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Not authenticated");
      }

      const data = await updateCertificate(recordId, formData);
      setRecords(prev => prev.map(record => 
        record.id === recordId ? { ...record, ...data } : record
      ));

      toast({
        title: "Success",
        description: "Record updated successfully",
      });
    } catch (error) {
      console.error('Update record error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update record",
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
    handleUpdateRecord,
  };
};
