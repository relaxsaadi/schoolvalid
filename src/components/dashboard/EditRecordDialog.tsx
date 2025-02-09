
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { StudentRecord } from "@/pages/Dashboard";

interface EditRecordDialogProps {
  record: StudentRecord | null;
  onClose: () => void;
  onSave: () => void;
  onChange: (updatedRecord: StudentRecord) => void;
}

export const EditRecordDialog = ({
  record,
  onClose,
  onSave,
  onChange,
}: EditRecordDialogProps) => {
  if (!record) return null;

  return (
    <Dialog open={!!record} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Record</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Student Name</Label>
            <Input
              id="name"
              value={record.recipient_name}
              onChange={(e) => onChange({ ...record, recipient_name: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="certificate_number">Certificate Number</Label>
            <Input
              id="certificate_number"
              value={record.certificate_number}
              onChange={(e) => onChange({ ...record, certificate_number: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="course">Course Name</Label>
            <Input
              id="course"
              value={record.course_name}
              onChange={(e) => onChange({ ...record, course_name: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="course_description">Course Description</Label>
            <Textarea
              id="course_description"
              value={record.course_description || ''}
              onChange={(e) => onChange({ ...record, course_description: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="provider_description">Provider Description</Label>
            <Textarea
              id="provider_description"
              value={record.provider_description || ''}
              onChange={(e) => onChange({ ...record, provider_description: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={record.status}
              onValueChange={(value) => onChange({ ...record, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={record.email || ''}
              onChange={(e) => onChange({ ...record, email: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="year_of_birth">Year of Birth</Label>
            <Input
              id="year_of_birth"
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              value={record.year_of_birth || ''}
              onChange={(e) => onChange({ ...record, year_of_birth: parseInt(e.target.value) })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="valid_through">Valid Through</Label>
            <Input
              id="valid_through"
              type="date"
              value={record.valid_through ? format(new Date(record.valid_through), 'yyyy-MM-dd') : ''}
              onChange={(e) => onChange({ ...record, valid_through: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="diploma_image_url">Diploma Image URL</Label>
            <Input
              id="diploma_image_url"
              type="url"
              value={record.diploma_image_url || ''}
              onChange={(e) => onChange({ ...record, diploma_image_url: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSave}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

