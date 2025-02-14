
import { FileText } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { motion } from "framer-motion";

interface EmptyStateProps {
  hasRecords: boolean;
}

export const EmptyState = ({ hasRecords }: EmptyStateProps) => {
  return (
    <TableRow>
      <TableCell colSpan={5} className="h-[400px]">
        <motion.div 
          className="flex flex-col items-center justify-center h-full text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <FileText className="h-12 w-12 mb-4 text-gray-400" />
          </motion.div>
          <h3 className="text-lg font-medium mb-2">No records found</h3>
          <p className="text-sm text-center max-w-sm">
            {hasRecords 
              ? "Try adjusting your search filters or try a different search term." 
              : "Get started by adding your first record using the button above."}
          </p>
        </motion.div>
      </TableCell>
    </TableRow>
  );
};
