import { Card } from "@/components/ui/card";
import { UserNav } from "@/components/UserNav";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building, Upload, KeyRound, Bell, Moon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";

const Settings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [organizationData, setOrganizationData] = useState({
    name: "",
    description: "",
    logo_url: "",
  });
  const [profileUrl, setProfileUrl] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  const loadUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('avatar_url, email_notifications, dark_mode')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (profile?.avatar_url) {
        setProfileUrl(profile.avatar_url);
        const timestamp = new Date().getTime();
        setProfileUrl(`${profile.avatar_url}?t=${timestamp}`);
      }
      
      setEmailNotifications(profile?.email_notifications ?? true);
      setDarkMode(profile?.dark_mode ?? false);
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const loadOrganizationData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      if (!profile?.organization_id) throw new Error("No organization found");

      const { data: organization, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', profile.organization_id)
        .single();

      if (orgError) throw orgError;

      setOrganizationData({
        name: organization.name || "",
        description: organization.description || "",
        logo_url: organization.logo_url || "",
      });
    } catch (error) {
      console.error('Error loading organization:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load organization data",
      });
    }
  };

  useEffect(() => {
    loadUserProfile();
    loadOrganizationData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      if (!profile?.organization_id) throw new Error("No organization found");

      const { error } = await supabase
        .from('organizations')
        .update({
          name: organizationData.name,
          description: organizationData.description,
          logo_url: organizationData.logo_url,
        })
        .eq('id', profile.organization_id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Organization settings updated successfully",
      });
    } catch (error) {
      console.error('Error updating organization:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update organization settings",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      if (file.size > 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "File size must be less than 1MB",
        });
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Only image files are allowed",
        });
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      toast({
        title: "Uploading...",
        description: "Your profile picture is being uploaded",
      });

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { 
          upsert: true,
          contentType: file.type
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      const timestamp = new Date().getTime();
      const urlWithTimestamp = `${publicUrl}?t=${timestamp}`;
      setProfileUrl(urlWithTimestamp);

      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });

      await loadUserProfile();
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload profile picture",
      });
    }
  };

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const newPassword = (form.elements.namedItem('new-password') as HTMLInputElement).value;
    const confirmPassword = (form.elements.namedItem('confirm-password') as HTMLInputElement).value;

    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Passwords do not match",
      });
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      toast({
        title: "Success",
        description: "Password updated successfully",
      });
      form.reset();
    } catch (error) {
      console.error('Error changing password:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update password",
      });
    }
  };

  const updateUserPreferences = async (emailNotifs: boolean, isDarkMode: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "You must be logged in to update preferences",
        });
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          email_notifications: emailNotifs,
          dark_mode: isDarkMode,
        })
        .eq('id', user.id);

      if (error) throw error;

      setTheme(isDarkMode ? 'dark' : 'light');
      setDarkMode(isDarkMode);
      setEmailNotifications(emailNotifs);

      toast({
        title: "Success",
        description: "Preferences updated successfully",
      });
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update preferences",
      });
      
      setDarkMode(!isDarkMode);
      setTheme(!isDarkMode ? 'dark' : 'light');
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardNav sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 lg:pl-64">
        <DashboardHeader setSidebarOpen={setSidebarOpen} pageTitle="Settings">
          <UserNav />
        </DashboardHeader>

        <main className="p-4 sm:p-6 lg:p-8 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Profile Picture</h2>
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profileUrl} />
                <AvatarFallback>
                  {organizationData.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <Label htmlFor="picture" className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    <span>Upload new picture</span>
                  </div>
                </Label>
                <Input
                  id="picture"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleProfilePictureUpload}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Recommended: Square image, 1MB max
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Organization Settings</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Organization Name</Label>
                  <Input
                    id="name"
                    value={organizationData.name}
                    onChange={(e) => setOrganizationData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter organization name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={organizationData.description}
                    onChange={(e) => setOrganizationData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter organization description"
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logo">Logo URL</Label>
                  <Input
                    id="logo"
                    value={organizationData.logo_url}
                    onChange={(e) => setOrganizationData(prev => ({ ...prev, logo_url: e.target.value }))}
                    placeholder="Enter logo URL"
                  />
                </div>
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Change Password</h2>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  name="new-password"
                  required
                  minLength={8}
                />
              </div>
              <div>
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  name="confirm-password"
                  required
                  minLength={8}
                />
              </div>
              <Button type="submit">
                <KeyRound className="h-4 w-4 mr-2" />
                Update Password
              </Button>
            </form>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email updates about your account
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={(checked) => {
                    updateUserPreferences(checked, darkMode);
                  }}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Toggle dark mode theme
                  </p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={darkMode}
                  onCheckedChange={(checked) => {
                    updateUserPreferences(emailNotifications, checked);
                  }}
                />
              </div>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Settings;
