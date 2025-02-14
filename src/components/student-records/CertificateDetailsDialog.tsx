
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil, FileImage } from "lucide-react";
import { StudentRecord } from "@/types/records";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { UpdateRecordDialog } from "./UpdateRecordDialog";

interface CertificateDetailsDialogProps {
  record: StudentRecord;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateRecord: (formData: FormData) => Promise<void>;
  getStatusColor: (status?: string) => string;
}

export function CertificateDetailsDialog({
  record,
  open,
  onOpenChange,
  onUpdateRecord,
  getStatusColor,
}: CertificateDetailsDialogProps) {
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Certificate Details</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="aspect-video relative rounded-lg overflow-hidden">
              {record.diploma_image_url ? (
                <img
                  src={record.diploma_image_url}
                  alt={`Certificate for ${record.recipient_name}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <FileImage className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-semibold mb-1">{record.recipient_name}</h3>
                <span className={cn(
                  "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset",
                  getStatusColor(record.status)
                )}>
                  {record.status}
                </span>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="text-sm font-medium text-gray-500">Certificate Number</label>
                  <p className="font-mono">{record.certificate_number}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Course</label>
                  <p>{record.course_name}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Provider</label>
                  <p>{record.provider}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Issue Date</label>
                  <p>{format(new Date(record.issue_date), 'PPP')}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Valid Through</label>
                  <p>{format(new Date(record.valid_through), 'PPP')}</p>
                </div>

                {record.course_description && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Course Description</label>
                    <p className="text-sm text-gray-600">{record.course_description}</p>
                  </div>
                )}

                {record.provider_description && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Provider Description</label>
                    <p className="text-sm text-gray-600">{record.provider_description}</p>
                  </div>
                )}
              </div>

              <div className="pt-4">
                <Button 
                  onClick={() => setUpdateDialogOpen(true)}
                  className="w-full"
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit Certificate
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <UpdateRecordDialog
        record={record}
        open={updateDialogOpen}
        onOpenChange={setUpdateDialogOpen}
        onUpdateRecord={onUpdateRecord}
      />
    </>
  );
}
