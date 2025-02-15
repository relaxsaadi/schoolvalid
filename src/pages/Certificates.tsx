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
import { CertificateGallery } from "@/components/certificates/CertificateGallery";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Download, Shield, AlertCircle, LayoutGrid, Table } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Certificates = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [verificationNumber, setVerificationNumber] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "gallery">("gallery");
  const { records, isLoading, error, handleAddRecord, handleUpdateRecord } = useDashboardRecords();
  const { searchQuery, handleSearch, filteredRecords } = useSearchFilter(records);
  const { toast } = useToast();
  
  useAuth();

  const handleQuickVerify = () => {
    if (!verificationNumber.trim()) {
      toast({
        title: "Verification Error",
        description: "Please enter a certificate number",
        variant: "destructive",
      });
      return;
    }
    
    const certificate = records.find(r => r.certificate_number === verificationNumber);
    if (certificate) {
      toast({
        title: "Certificate Found",
        description: `Valid certificate for ${certificate.recipient_name}`,
        variant: "default",
      });
    } else {
      toast({
        title: "Certificate Not Found",
        description: "No matching certificate found in the system",
        variant: "destructive",
      });
    }
  };

  const handleBulkExport = () => {
    const csvContent = [
      ["Certificate Number", "Recipient Name", "Course Name", "Issue Date", "Status"].join(","),
      ...records.map(record => [
        record.certificate_number,
        record.recipient_name,
        record.course_name,
        new Date(record.issue_date).toLocaleDateString(),
        record.status
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `certificates-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: `Exported ${records.length} certificates to CSV`,
    });
  };

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
            className="mb-8 flex justify-between items-center"
            variants={itemVariants}
          >
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 mb-2">Certificates</h1>
              <p className="text-base text-gray-500">
                Manage and view all certificates in your organization
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "gallery" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("gallery")}
              >
                <LayoutGrid className="h-4 w-4 mr-2" />
                Gallery
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("table")}
              >
                <Table className="h-4 w-4 mr-2" />
                Table
              </Button>
            </div>
          </motion.div>

          <div className="grid gap-6 mb-8 grid-cols-1 md:grid-cols-2">
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                <CardHeader className="bg-primary/5 border-b">
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Quick Certificate Verification
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter certificate number..."
                      value={verificationNumber}
                      onChange={(e) => setVerificationNumber(e.target.value)}
                      className="font-mono"
                    />
                    <Button onClick={handleQuickVerify} className="shrink-0">
                      <Search className="h-4 w-4 mr-2" />
                      Verify
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                <CardHeader className="bg-primary/5 border-b">
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5 text-primary" />
                    Bulk Export
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Export all certificates as CSV
                    </p>
                    <Button onClick={handleBulkExport} disabled={records.length === 0}>
                      <Download className="h-4 w-4 mr-2" />
                      Export ({records.length})
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

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
            {viewMode === "gallery" ? (
              <CertificateGallery
                records={filteredRecords}
                onUpdateRecord={handleUpdateRecord}
              />
            ) : (
              <RecordsTable
                key={searchQuery}
                records={records}
                filteredRecords={filteredRecords}
                isLoading={isLoading}
                error={error}
                getStatusColor={getStatusColor}
                onUpdateRecord={handleUpdateRecord}
              />
            )}
          </motion.div>
        </motion.main>
      </div>
    </div>
  );
};

export default Certificates;
