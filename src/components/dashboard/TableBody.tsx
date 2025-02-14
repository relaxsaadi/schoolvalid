
import { StudentRecord } from "@/types/records";
import { EmptyState } from "./EmptyState";
import { useState } from "react";
import { UpdateRecordDialog } from "../student-records/UpdateRecordDialog";
import { CertificateDetailsDialog } from "../student-records/CertificateDetailsDialog";
import { AnimatePresence } from "framer-motion";
import { StudentRecordCard } from "./StudentRecordCard";

interface TableBodyProps {
  records: StudentRecord[];
  filteredRecords: StudentRecord[];
  getStatusColor: (status?: string) => string;
  onUpdateRecord: (recordId: string, formData: FormData) => Promise<void>;
}

export const TableBody = ({ 
  records, 
  filteredRecords, 
  getStatusColor, 
  onUpdateRecord 
}: TableBodyProps) => {
  const [selectedRecord, setSelectedRecord] = useState<StudentRecord | null>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const handleUpdateClick = (e: React.MouseEvent, record: StudentRecord) => {
    e.stopPropagation();
    setSelectedRecord(record);
    setUpdateDialogOpen(true);
  };

  const handleCardClick = (record: StudentRecord) => {
    setSelectedRecord(record);
    setDetailsDialogOpen(true);
  };

  if (filteredRecords.length === 0) {
    return (
      <div className="p-8">
        <EmptyState hasRecords={records.length > 0} />
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 p-4">
        <AnimatePresence>
          {filteredRecords.map((record, index) => (
            <StudentRecordCard
              key={record.id}
              record={record}
              index={index}
              getStatusColor={getStatusColor}
              onClick={() => handleCardClick(record)}
              onUpdate={(e) => handleUpdateClick(e, record)}
            />
          ))}
        </AnimatePresence>
      </div>

      {selectedRecord && (
        <>
          <UpdateRecordDialog
            record={selectedRecord}
            open={updateDialogOpen}
            onOpenChange={setUpdateDialogOpen}
            onUpdateRecord={(formData) => onUpdateRecord(selectedRecord.id, formData)}
          />
          <CertificateDetailsDialog
            record={selectedRecord}
            open={detailsDialogOpen}
            onOpenChange={setDetailsDialogOpen}
            onUpdateRecord={(formData) => onUpdateRecord(selectedRecord.id, formData)}
            getStatusColor={getStatusColor}
          />
        </>
      )}
    </>
  );
};
