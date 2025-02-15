
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { UserNav } from "@/components/UserNav";
import { motion } from "framer-motion";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { TableBody } from "@/components/dashboard/TableBody";
import { Button } from "@/components/ui/button";
import { Plus, FileUp } from "lucide-react";
import { StudentRecord } from "@/types/records";
import { useDashboardRecords } from "@/hooks/useDashboardRecords";
import { TableHeader } from "@/components/dashboard/TableHeader";

const Students = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { records, isLoading, error, handleAddRecord, handleUpdateRecord } = useDashboardRecords();
  
  useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <DashboardNav sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col lg:pl-64">
        <DashboardHeader setSidebarOpen={setSidebarOpen}>
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1"
            >
              <SearchBar 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search students by name, email, or ID..."
                className="w-full md:w-[400px] transition-all duration-300 focus-within:shadow-lg"
              />
            </motion.div>
          </div>
          <UserNav />
        </DashboardHeader>

        <motion.main
          className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="mb-8"
            variants={itemVariants}
          >
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Students</h1>
                <p className="text-base text-gray-500">
                  Manage your students and track their progress
                </p>
              </div>
              <div className="flex gap-2">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
                <Button variant="outline">
                  <FileUp className="h-4 w-4 mr-2" />
                  Import CSV
                </Button>
              </div>
            </div>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="mb-8"
          >
            <StatsCards records={records} />
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="mt-6"
          >
            <TableBody 
              records={records}
              filteredRecords={records}
              getStatusColor={(status) => {
                switch (status) {
                  case 'active':
                    return 'text-green-700 bg-green-50 ring-green-600/20';
                  case 'expired':
                    return 'text-red-700 bg-red-50 ring-red-600/20';
                  case 'revoked':
                    return 'text-gray-700 bg-gray-50 ring-gray-600/20';
                  default:
                    return 'text-gray-700 bg-gray-50 ring-gray-600/20';
                }
              }}
              onUpdateRecord={handleUpdateRecord}
            />
          </motion.div>
        </motion.main>
      </div>
    </div>
  );
};

export default Students;
