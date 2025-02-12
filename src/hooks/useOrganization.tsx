
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useOrganization = () => {
  const { toast } = useToast();

  const createOrganization = async (user: any) => {
    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name: `${user.email}'s Organization`,
        slug: user.email?.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-') || 'default-org',
        description: 'Default organization'
      })
      .select()
      .single();

    if (orgError) {
      console.error('Error creating organization:', orgError);
      throw new Error("Unable to create organization");
    }

    // Update profile with new organization
    const { error: updateError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        organization_id: organization.id,
        full_name: user.email?.split('@')[0] || 'User'
      });

    if (updateError) {
      console.error('Error updating profile:', updateError);
      throw new Error("Unable to update profile");
    }

    return organization;
  };

  const getUserOrganization = async (userId: string) => {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', userId)
      .maybeSingle();

    if (profileError) {
      console.error('Profile error:', profileError);
      throw new Error("Unable to fetch organization data");
    }

    return profile;
  };

  return {
    createOrganization,
    getUserOrganization,
  };
};
