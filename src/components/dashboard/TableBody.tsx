
import { StudentRecord } from "@/types/records";
import { EmptyState } from "./EmptyState";
import { useState } from "react";
import { UpdateRecordDialog } from "../student-records/UpdateRecordDialog";
import { CertificateDetailsDialog } from "../student-records/CertificateDetailsDialog";
import { AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { BulkActionsBar } from "./BulkActionsBar";
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
  const [selectedRecords, setSelectedRecords] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const handleUpdateClick = (e: React.MouseEvent, record: StudentRecord) => {
    e.stopPropagation();
    setSelectedRecord(record);
    setUpdateDialogOpen(true);
  };

  const handleCardClick = (record: StudentRecord) => {
    setSelectedRecord(record);
    setDetailsDialogOpen(true);
  };

  const toggleRecordSelection = (e: React.MouseEvent, recordId: string) => {
    e.stopPropagation();
    const newSelected = new Set(selectedRecords);
    if (newSelected.has(recordId)) {
      newSelected.delete(recordId);
    } else {
      newSelected.add(recordId);
    }
    setSelectedRecords(newSelected);
  };

  const handleBulkAction = (action: 'download' | 'email' | 'verify') => {
    if (selectedRecords.size === 0) {
      toast({
        title: "No certificates selected",
        description: "Please select at least one certificate to perform this action.",
        variant: "destructive",
      });
      return;
    }

    switch (action) {
      case 'download':
        toast({
          title: "Downloading certificates",
          description: `Preparing ${selectedRecords.size} certificates for download...`,
        });
        break;
      case 'email':
        toast({
          title: "Sending certificates",
          description: `Preparing to email ${selectedRecords.size} certificates...`,
        });
        break;
      case 'verify':
        toast({
          title: "Verifying certificates",
          description: `Verifying ${selectedRecords.size} certificates...`,
        });
        break;
    }
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
      {selectedRecords.size > 0 && (
        <BulkActionsBar
          selectedCount={selectedRecords.size}
          onAction={handleBulkAction}
        />
      )}

      <div className="grid grid-cols-1 gap-4 p-4">
        <AnimatePresence>
          {filteredRecords.map((record, index) => (
            <StudentRecordCard
              key={record.id}
              record={record}
              index={index}
              isSelected={selectedRecords.has(record.id)}
              getStatusColor={getStatusColor}
              onSelect={(e) => toggleRecordSelection(e, record.id)}
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
