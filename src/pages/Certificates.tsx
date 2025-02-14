
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
import { motion } from "framer-motion";
import { CertificateDistributionChart } from "@/components/certificates/CertificateDistributionChart";

const Certificates = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { records, isLoading, error, handleAddRecord, handleUpdateRecord } = useDashboardRecords();
  const { searchQuery, handleSearch, filteredRecords } = useSearchFilter(records);
  
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
        <DashboardHeader setSidebarOpen={setSidebarOpen} showTitle={false}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md"
          >
            <SearchBar 
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full transition-all duration-300 focus-within:shadow-lg"
            />
          </motion.div>
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
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">Certificates</h1>
            <p className="text-base text-gray-500">
              Manage and view all certificates in your organization
            </p>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="mb-6"
          >
            <ActionButtons 
              onAddRecord={handleAddRecord} 
              records={records}
            />
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="mb-6"
          >
            <CertificateDistributionChart records={records} />
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="mt-6"
          >
            <RecordsTable
              key={searchQuery}
              records={records}
              filteredRecords={filteredRecords}
              isLoading={isLoading}
              error={error}
              getStatusColor={getStatusColor}
              onUpdateRecord={handleUpdateRecord}
            />
          </motion.div>
        </motion.main>
      </div>
    </div>
  );
};

export default Certificates;
