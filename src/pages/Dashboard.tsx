
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useDashboardRecords } from "@/hooks/useDashboardRecords";
import { useSearchFilter } from "@/hooks/useSearchFilter";
import { getStatusColor } from "@/utils/statusColors";
import { UserNav } from "@/components/UserNav";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { RecordsTable } from "@/components/dashboard/RecordsTable";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { ActionButtons } from "@/components/dashboard/ActionButtons";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { records, isLoading, error, handleAddRecord, handleUpdateRecord } = useDashboardRecords();
  const { searchQuery, handleSearch, filteredRecords } = useSearchFilter(records);
  const { toast } = useToast();
  
  useAuth();

  useEffect(() => {
    const checkOrganization = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('organization_id')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError) throw profileError;

        if (!profile?.organization_id) {
          toast({
            title: "Welcome!",
            description: "Please create an organization to get started.",
          });
        }
      } catch (error) {
        console.error('Error checking organization:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to verify organization status",
        });
      }
    };

    checkOrganization();
  }, [toast]);

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardNav sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 lg:pl-64">
        <DashboardHeader>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold hidden md:block">Certificates</h1>
          </div>
          <div className="flex items-center gap-4">
            <SearchBar 
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full md:w-[300px] lg:w-[400px]"
            />
            <UserNav />
          </div>
        </DashboardHeader>

        <main className="p-4 sm:p-6 lg:p-8">
          <ActionButtons onAddRecord={handleAddRecord} />
          <StatsCards records={records} />
          <RecordsTable
            records={records}
            filteredRecords={filteredRecords}
            isLoading={isLoading}
            error={error}
            getStatusColor={getStatusColor}
            onUpdateRecord={handleUpdateRecord}
          />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
