import { Download } from "lucide-react";
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
    toast({
      title: "Exporting records...",
      description: "Please wait while your records are being exported.",
      duration: 3000,
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6 flex flex-wrap gap-4"
    >
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <AddRecordDialog onAddRecord={onAddRecord} />
      </motion.div>
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button 
          variant="outline" 
          onClick={handleExport}
          className="transition-colors hover:bg-primary/10"
        >
          <Download className="mr-2 h-4 w-4" /> Export Records
        </Button>
      </motion.div>
    </motion.div>
  );
};
