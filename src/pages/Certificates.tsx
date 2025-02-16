import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { UserNav } from "@/components/UserNav";
import { SearchBar } from "@/components/dashboard/SearchBar";

const Certificates = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  useAuth();

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardNav sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 lg:pl-64">
        <DashboardHeader setSidebarOpen={setSidebarOpen} pageTitle="Certificates">
          <SearchBar 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-[300px] lg:w-[400px]"
          />
          <UserNav />
        </DashboardHeader>

        <main className="p-4 sm:p-6 lg:p-8">
          {/* Add your Certificates page content here */}
        </main>
      </div>
    </div>
  );
};

export default Certificates;
