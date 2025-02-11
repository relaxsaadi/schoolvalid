
import { format } from "date-fns";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StudentRecord } from "@/pages/Dashboard";

interface RecordsTableProps {
  records: StudentRecord[];
  filteredRecords: StudentRecord[];
  isLoading: boolean;
  error: string | null;
  getStatusColor: (status?: string) => string;
}

export const RecordsTable = ({
  records,
  filteredRecords,
  isLoading,
  error,
  getStatusColor,
}: RecordsTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Records</CardTitle>
        <CardDescription>
          View and manage student certificates
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="p-8 text-center">
            <p className="text-red-500 mb-4">{error}</p>
          </div>
        ) : isLoading ? (
          <div className="p-8 text-center text-muted-foreground">
            Loading records...
          </div>
        ) : (
          <div className="relative overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Certificate ID</TableHead>
                  <TableHead className="hidden md:table-cell">Course</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-32">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <FileText className="h-8 w-8 mb-2" />
                        <p>No records found</p>
                        <p className="text-sm">
                          {records.length === 0 
                            ? "Add your first record using the button above." 
                            : "Try adjusting your search filters."}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRecords.map((record) => (
                    <TableRow key={record.id} className="group">
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
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
