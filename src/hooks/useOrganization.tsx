
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useOrganization = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

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

    return organization;
  };

  const updateUserProfile = async (userId: string, organizationId: string) => {
    const { error: updateError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        organization_id: organizationId,
        full_name: userId.split('@')[0] || 'User'
      });

    if (updateError) {
      console.error('Error updating profile:', updateError);
      throw new Error("Unable to update profile");
    }
  };

  const getUserOrganization = async () => {
    const { data: { user }, error: sessionError } = await supabase.auth.getUser();
    if (sessionError || !user) {
      console.error('Session error:', sessionError);
      toast({
        title: "Authentication Error",
        description: "Please sign in again",
        variant: "destructive",
      });
      navigate('/sign-in');
      return null;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError) {
      console.error('Profile error:', profileError);
      throw new Error("Unable to fetch organization data");
    }

    if (!profile?.organization_id) {
      const organization = await createOrganization(user);
      await updateUserProfile(user.id, organization.id);
      return organization.id;
    }

    return profile.organization_id;
  };

  return {
    getUserOrganization,
    createOrganization,
    updateUserProfile,
  };
};
