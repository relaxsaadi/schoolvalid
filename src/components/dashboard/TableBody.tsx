
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { TableBody as ShadcnTableBody, TableCell, TableRow } from "@/components/ui/table";
import { StudentRecord } from "@/types/records";
import { EmptyState } from "./EmptyState";
import { Button } from "@/components/ui/button";
import { Pencil, FileImage } from "lucide-react";
import { useState } from "react";
import { UpdateRecordDialog } from "../student-records/UpdateRecordDialog";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

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
            <EmptyState hasRecords={records.length > 0} />
          </TableCell>
        </TableRow>
      </ShadcnTableBody>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        <AnimatePresence>
          {filteredRecords.map((record, index) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: {
                  delay: index * 0.1,
                  duration: 0.5
                }
              }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-0">
                  <div className="aspect-video relative">
                    {record.diploma_image_url ? (
                      <img
                        src={record.diploma_image_url}
                        alt={`Certificate for ${record.recipient_name}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <FileImage className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => handleUpdateClick(record)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/80 backdrop-blur-sm hover:bg-white"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{record.recipient_name}</h3>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Certificate: {record.certificate_number}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Course: {record.course_name}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className={cn(
                          "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset",
                          getStatusColor(record.status)
                        )}>
                          {record.status}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(record.created_at), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

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
