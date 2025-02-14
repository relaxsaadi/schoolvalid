
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

  const tableRowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3
      }
    }),
    exit: { opacity: 0, x: 20 }
  };

  if (filteredRecords.length === 0) {
    return (
      <ShadcnTableBody>
        <TableRow>
          <TableCell colSpan={6}>
            <EmptyState hasRecords={records.length > 0} />
          </TableCell>
        </TableRow>
      </ShadcnTableBody>
    );
  }

  return (
    <>
      <ShadcnTableBody>
        <AnimatePresence>
          {filteredRecords.map((record, index) => (
            <motion.tr
              key={record.id}
              custom={index}
              variants={tableRowVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="group"
            >
              <TableCell className="font-medium">
                {record.recipient_name}
              </TableCell>
              <TableCell className="font-mono text-sm">
                {record.certificate_number}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {record.course_name}
              </TableCell>
              <TableCell>
                <span className={cn(
                  "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset",
                  getStatusColor(record.status)
                )}>
                  {record.status}
                </span>
              </TableCell>
              <TableCell className="hidden lg:table-cell text-muted-foreground">
                {format(new Date(record.created_at), 'MMM d, yyyy')}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleUpdateClick(record)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
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
