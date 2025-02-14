
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
import { motion, AnimatePresence } from "framer-motion";

const Certificates = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { records, isLoading, error, handleAddRecord, handleUpdateRecord } = useDashboardRecords();
  const { searchQuery, handleSearch, filteredRecords } = useSearchFilter(records);
  const { toast } = useToast();
  
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
    <div className="flex h-screen bg-gray-50">
      <DashboardNav sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 lg:pl-64">
        <DashboardHeader>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SearchBar 
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full md:w-[300px] lg:w-[400px]"
            />
          </motion.div>
          <UserNav />
        </DashboardHeader>

        <motion.main
          className="p-4 sm:p-6 lg:p-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="mb-6" variants={itemVariants}>
            <h1 className="text-2xl font-semibold text-gray-900">Certificates</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage and view all certificates in your organization
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <ActionButtons 
              onAddRecord={handleAddRecord} 
              records={records}
            />
          </motion.div>

          <motion.div 
            className="mt-6"
            variants={itemVariants}
          >
            <AnimatePresence mode="wait">
              <RecordsTable
                records={records}
                filteredRecords={filteredRecords}
                isLoading={isLoading}
                error={error}
                getStatusColor={getStatusColor}
                onUpdateRecord={handleUpdateRecord}
              />
            </AnimatePresence>
          </motion.div>
        </motion.main>
      </div>
    </div>
  );
};

export default Certificates;
