
import { Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddRecordDialog } from "@/components/AddRecordDialog";
import { NewStudentRecord, StudentRecord } from "@/types/records";
import { FC } from "react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface ActionButtonsProps {
  onAddRecord: (record: NewStudentRecord) => Promise<void>;
  records?: StudentRecord[];
}

export const ActionButtons: FC<ActionButtonsProps> = ({ onAddRecord, records = [] }) => {
  const { toast } = useToast();

  const handleExport = () => {
    // Create CSV content
    const headers = ["Recipient Name", "Certificate Number", "Course Name", "Status", "Issue Date"];
    const csvContent = records.map(record => [
      record.recipient_name,
      record.certificate_number,
      record.course_name,
      record.status,
      new Date(record.created_at).toLocaleDateString()
    ].join(",")).join("\n");

    const csv = [headers.join(","), csvContent].join("\n");
    
    // Create and trigger download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `certificates-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export successful",
      description: "Your certificates have been exported to CSV",
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-wrap items-center gap-4"
    >
      <motion.div 
        whileHover={{ scale: 1.02 }} 
        whileTap={{ scale: 0.98 }}
        className="relative"
      >
        <AddRecordDialog onAddRecord={onAddRecord}>
          <Button className="relative overflow-hidden">
            <Plus className="mr-2 h-4 w-4" />
            Add Certificate
          </Button>
        </AddRecordDialog>
      </motion.div>

      <motion.div 
        whileHover={{ scale: 1.02 }} 
        whileTap={{ scale: 0.98 }}
      >
        <Button 
          variant="outline" 
          onClick={handleExport}
          className="relative overflow-hidden"
          disabled={records.length === 0}
        >
          <Download className="mr-2 h-4 w-4" />
          Export Certificates
        </Button>
      </motion.div>
    </motion.div>
  );
};
