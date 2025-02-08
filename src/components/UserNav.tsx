
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProfileDialog } from "./profile/ProfileDialog";
import { UserDropdownMenu } from "./profile/UserDropdownMenu";

export function UserNav() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    institutionName: "",
    logoUrl: "",
  });
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        setCurrentUser(session.user);
        loadProfile(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        setCurrentUser(session.user);
        loadProfile(session.user.id);
      } else {
        navigate('/sign-in');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadProfile = async (userId: string) => {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, institution_name, logo_url')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Profile error:', profileError);
        throw profileError;
      }

      if (profile) {
        console.log("Profile data loaded:", profile);
        setProfileData({
          name: profile.full_name || "",
          institutionName: profile.institution_name || "",
          logoUrl: profile.logo_url || "",
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load profile data. Please try again.",
      });
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
      
      navigate("/sign-in");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out. Please try again.",
      });
    }
  };

  const handleProfileUpdate = async () => {
    try {
      if (!session?.user) {
        throw new Error("You must be logged in to update your profile");
      }

      console.log("Updating profile with data:", {
        full_name: profileData.name,
        institution_name: profileData.institutionName,
        logo_url: profileData.logoUrl,
      });

      const { data, error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.name,
          institution_name: profileData.institutionName,
          logo_url: profileData.logoUrl,
        })
        .eq('id', session.user.id)
        .select();

      if (error) {
        console.error('Update error:', error);
        throw error;
      }

      console.log("Profile updated successfully:", data);

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
      setIsProfileOpen(false);
      
      loadProfile(session.user.id);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
      });
    }
  };

  return (
    <>
      <UserDropdownMenu
        profileData={profileData}
        onOpenProfile={() => setIsProfileOpen(true)}
        onLogout={handleLogout}
      />

      <ProfileDialog
        isOpen={isProfileOpen}
        setIsOpen={setIsProfileOpen}
        profileData={profileData}
        setProfileData={setProfileData}
        onSave={handleProfileUpdate}
      />
    </>
  );
}
