
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

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { records, isLoading, error, handleAddRecord } = useDashboardRecords();
  const { searchQuery, setSearchQuery, filteredRecords } = useSearchFilter(records);
  const { toast } = useToast();
  
  useAuth();

  useEffect(() => {
    const checkOrganization = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile } = await supabase
          .from('profiles')
          .select('organization_id')
          .eq('id', user.id)
          .maybeSingle();

        if (!profile?.organization_id) {
          // Trigger the organization creation
          await supabase
            .from('profiles')
            .update({ organization_id: null }) // This will trigger our new function
            .eq('id', user.id);

          toast({
            title: "Organization Created",
            description: "A default organization has been created for your account.",
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
          <SearchBar value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <UserNav />
        </DashboardHeader>

        <main className="p-4 sm:p-6 lg:p-8">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="md:hidden mb-6"
          />

          <ActionButtons onAddRecord={handleAddRecord} />
          <StatsCards records={records} />
          <RecordsTable
            records={records}
            filteredRecords={filteredRecords}
            isLoading={isLoading}
            error={error}
            getStatusColor={getStatusColor}
          />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
