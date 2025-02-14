
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { TableBody as ShadcnTableBody, TableCell, TableRow } from "@/components/ui/table";
import { StudentRecord } from "@/types/records";
import { EmptyState } from "./EmptyState";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { UpdateRecordDialog } from "../student-records/UpdateRecordDialog";
import { motion, AnimatePresence } from "framer-motion";

interface TableBodyProps {
  records: StudentRecord[];
  filteredRecords: StudentRecord[];
  getStatusColor: (status?: string) => string;
  onUpdateRecord: (recordId: string, formData: FormData) => Promise<void>;
}

export const TableBody = ({ records, filteredRecords, getStatusColor, onUpdateRecord }: TableBodyProps) => {
  const [selectedRecord, setSelectedRecord] = useState<StudentRecord | null>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);

  const handleUpdateClick = (record: StudentRecord) => {
    setSelectedRecord(record);
    setUpdateDialogOpen(true);
  };

  if (filteredRecords.length === 0) {
    return (
      <ShadcnTableBody>
        <TableRow>
          <TableCell colSpan={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <EmptyState hasRecords={records.length > 0} />
            </motion.div>
          </TableCell>
        </TableRow>
      </ShadcnTableBody>
    );
  }

  return (
    <>
      <ShadcnTableBody>
        <AnimatePresence mode="wait">
          {filteredRecords.map((record, index) => (
            <motion.tr
              key={record.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ 
                opacity: 1, 
                x: 0,
                transition: {
                  delay: index * 0.1,
                  duration: 0.5,
                  ease: "easeOut"
                }
              }}
              exit={{ opacity: 0, x: 50 }}
              className="group hover:bg-gray-50/80 backdrop-blur-sm transition-all duration-200"
            >
              <TableCell className="font-medium">
                <motion.div whileHover={{ scale: 1.01 }}>
                  {record.recipient_name}
                </motion.div>
              </TableCell>
              <TableCell className="font-mono text-sm">
                {record.certificate_number}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {record.course_name}
              </TableCell>
              <TableCell>
                <motion.span 
                  whileHover={{ scale: 1.05 }}
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset",
                    getStatusColor(record.status)
                  )}
                >
                  {record.status}
                </motion.span>
              </TableCell>
              <TableCell className="hidden lg:table-cell text-muted-foreground">
                {format(new Date(record.created_at), 'MMM d, yyyy')}
              </TableCell>
              <TableCell>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ scale: 1.1 }}
                  animate={{ opacity: 1 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleUpdateClick(record)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </motion.div>
              </TableCell>
            </motion.tr>
          ))}
        </AnimatePresence>
      </ShadcnTableBody>

      {selectedRecord && (
        <UpdateRecordDialog
          record={selectedRecord}
          open={updateDialogOpen}
          onOpenChange={setUpdateDialogOpen}
          onUpdateRecord={(formData) => onUpdateRecord(selectedRecord.id, formData)}
        />
      )}
    </>
  );
};
