import { Card } from "@/components/ui/card";
import { UserNav } from "@/components/UserNav";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [organizationData, setOrganizationData] = useState({
    name: "",
    description: "",
    logo_url: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    loadOrganizationData();
  }, []);

  const loadOrganizationData = async () => {
    try {
      const { data: organization, error } = await supabase
        .from('organizations')
        .select('*')
        .single();

      if (error) throw error;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('organizations')
        .update({
          name: organizationData.name,
          description: organizationData.description,
          logo_url: organizationData.logo_url,
        });

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

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardNav sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 lg:pl-64">
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 border-b border-gray-200 bg-white">
          <div className="flex flex-1 justify-end px-4">
            <div className="ml-4 flex items-center md:ml-6">
              <UserNav />
            </div>
          </div>
        </div>

        <main className="p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col space-y-6">
            <div className="flex items-center space-x-2">
              <Building className="h-6 w-6" />
              <h1 className="text-2xl font-semibold tracking-tight">Organization Settings</h1>
            </div>

            <Card className="p-6">
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
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
