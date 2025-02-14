
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useDashboardRecords } from "@/hooks/useDashboardRecords";
import { useSearchFilter } from "@/hooks/useSearchFilter";
import { getStatusColor } from "@/utils/statusColors";
import { UserNav } from "@/components/UserNav";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { RecordsTable } from "@/components/dashboard/RecordsTable";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { ActionButtons } from "@/components/dashboard/ActionButtons";
import { useToast } from "@/hooks/use-toast";

const Certificates = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { records, isLoading, error, handleAddRecord, handleUpdateRecord } = useDashboardRecords();
  const { searchQuery, handleSearch, filteredRecords } = useSearchFilter(records);
  const { toast } = useToast();
  
  useAuth();

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardNav sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 lg:pl-64">
        <DashboardHeader>
          <SearchBar 
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full md:w-[300px] lg:w-[400px]"
          />
          <UserNav />
        </DashboardHeader>

        <main className="p-4 sm:p-6 lg:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Certificates</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage and view all certificates in your organization
            </p>
          </div>

          <ActionButtons onAddRecord={handleAddRecord} />
          <div className="mt-6">
            <RecordsTable
              records={records}
              filteredRecords={filteredRecords}
              isLoading={isLoading}
              error={error}
              getStatusColor={getStatusColor}
              onUpdateRecord={handleUpdateRecord}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Certificates;
