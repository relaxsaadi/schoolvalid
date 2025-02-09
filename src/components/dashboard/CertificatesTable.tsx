
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { StudentRecord } from "@/pages/Dashboard";

interface CertificatesTableProps {
  records: StudentRecord[];
  onEditRecord: (record: StudentRecord) => void;
}

export const CertificatesTable = ({ records, onEditRecord }: CertificatesTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student Name</TableHead>
            <TableHead>Student ID</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date Added</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No records found
              </TableCell>
            </TableRow>
          ) : (
            records.map((record) => (
              <TableRow
                key={record.id}
                className="transition-colors hover:bg-muted/50 animate-fade-in"
              >
                <TableCell>{record.recipient_name}</TableCell>
                <TableCell>{record.certificate_number}</TableCell>
                <TableCell>{record.course_name}</TableCell>
                <TableCell>
                  <span className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
                    record.status === 'active' && "bg-green-100 text-green-800",
                    record.status === 'pending' && "bg-yellow-100 text-yellow-800",
                    record.status === 'expired' && "bg-red-100 text-red-800"
                  )}>
                    {record.status}
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(record.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:text-blue-500 hover:scale-110 transition-all"
                          onClick={() => onEditRecord(record)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit Record</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

