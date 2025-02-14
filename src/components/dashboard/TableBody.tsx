
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { StudentRecord } from "@/types/records";
import { EmptyState } from "./EmptyState";
import { Button } from "@/components/ui/button";
import { 
  Pencil, 
  FileImage, 
  Download, 
  Mail, 
  QrCode,
  CalendarClock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { UpdateRecordDialog } from "../student-records/UpdateRecordDialog";
import { CertificateDetailsDialog } from "../student-records/CertificateDetailsDialog";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface TableBodyProps {
  records: StudentRecord[];
  filteredRecords: StudentRecord[];
  getStatusColor: (status?: string) => string;
  onUpdateRecord: (recordId: string, formData: FormData) => Promise<void>;
}

export const TableBody = ({ records, filteredRecords, getStatusColor, onUpdateRecord }: TableBodyProps) => {
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

  const getExpirationStatus = (validThrough: string) => {
    const expirationDate = new Date(validThrough);
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);

    if (expirationDate < now) {
      return { status: 'expired', icon: XCircle, color: 'text-red-500' };
    } else if (expirationDate < thirtyDaysFromNow) {
      return { status: 'expiring-soon', icon: AlertCircle, color: 'text-yellow-500' };
    }
    return { status: 'active', icon: CheckCircle2, color: 'text-green-500' };
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

    const selectedCertificates = filteredRecords.filter(r => selectedRecords.has(r.id));
    
    switch (action) {
      case 'download':
        toast({
          title: "Downloading certificates",
          description: `Preparing ${selectedRecords.size} certificates for download...`,
        });
        // Implement bulk download logic
        break;
      case 'email':
        toast({
          title: "Sending certificates",
          description: `Preparing to email ${selectedRecords.size} certificates...`,
        });
        // Implement bulk email logic
        break;
      case 'verify':
        toast({
          title: "Verifying certificates",
          description: `Verifying ${selectedRecords.size} certificates...`,
        });
        // Implement bulk verification logic
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
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b p-4 mb-4 flex items-center justify-between"
        >
          <span className="text-sm text-muted-foreground">
            {selectedRecords.size} certificate(s) selected
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction('download')}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction('email')}
            >
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction('verify')}
            >
              <QrCode className="h-4 w-4 mr-2" />
              Verify
            </Button>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        <AnimatePresence>
          {filteredRecords.map((record, index) => {
            const expirationInfo = getExpirationStatus(record.valid_through);
            const ExpirationIcon = expirationInfo.icon;

            return (
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
                className="relative group"
              >
                <div
                  className="absolute top-2 left-2 z-10"
                  onClick={(e) => toggleRecordSelection(e, record.id)}
                >
                  <Checkbox
                    checked={selectedRecords.has(record.id)}
                    className="bg-white/80 backdrop-blur-sm"
                  />
                </div>

                <Card 
                  className={cn(
                    "overflow-hidden hover:shadow-lg transition-shadow duration-200",
                    selectedRecords.has(record.id) && "ring-2 ring-primary"
                  )}
                  onClick={() => handleCardClick(record)}
                >
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
                      <div className="absolute top-2 right-2 flex gap-2">
                        <Button
                          variant="secondary"
                          size="icon"
                          onClick={(e) => handleUpdateClick(e, record)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/80 backdrop-blur-sm hover:bg-white"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="secondary"
                              size="icon"
                              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/80 backdrop-blur-sm hover:bg-white"
                            >
                              <QrCode className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              View QR Code
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              Download Certificate
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              Email Certificate
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg">{record.recipient_name}</h3>
                        <ExpirationIcon className={cn("h-5 w-5", expirationInfo.color)} />
                      </div>
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
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <CalendarClock className="h-3 w-3" />
                            <span>Expires: {format(new Date(record.valid_through), 'MMM d, yyyy')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
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
