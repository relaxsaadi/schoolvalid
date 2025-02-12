
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { StudentRecord, NewStudentRecord } from "@/types/records";
import { useToast } from "@/hooks/use-toast";

export const useCertificates = () => {
  const { toast } = useToast();

  const fetchOrganizationCertificates = async (organizationId: string) => {
    const { data: certificates, error: certificatesError } = await supabase
      .from('certificates')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (certificatesError) {
      console.error('Certificates error:', certificatesError);
      throw new Error("Unable to fetch records");
    }

    return certificates || [];
  };

  const addCertificate = async (newRecord: NewStudentRecord, organizationId: string) => {
    const { data, error } = await supabase
      .from('certificates')
      .insert({
        ...newRecord,
        organization_id: organizationId,
        status: 'active',
        blockchain_hash: newRecord.blockchain_hash || 'pending',
        blockchain_timestamp: newRecord.blockchain_timestamp || new Date().toISOString(),
        issue_date: newRecord.issue_date || new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding record:', error);
      throw new Error(error.message);
    }

    return data;
  };

  const updateCertificate = async (recordId: string, formData: FormData) => {
    const updateData = {
      recipient_name: formData.get('recipient_name') as string,
      provider: formData.get('provider') as string,
      course_name: formData.get('course_name') as string,
      valid_through: new Date(formData.get('valid_through') as string).toISOString(),
      year_of_birth: parseInt(formData.get('year_of_birth') as string),
      course_description: formData.get('course_description') as string || null,
      provider_description: formData.get('provider_description') as string || null,
    };

    const { data, error } = await supabase
      .from('certificates')
      .update(updateData)
      .eq('id', recordId)
      .select()
      .single();

    if (error) {
      console.error('Error updating record:', error);
      throw new Error(error.message);
    }

    return data;
  };

  return {
    fetchOrganizationCertificates,
    addCertificate,
    updateCertificate,
  };
};
