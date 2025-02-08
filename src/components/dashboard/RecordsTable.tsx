
import { StudentRecord } from "@/pages/Dashboard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface RecordsTableProps {
  records: StudentRecord[];
}

export function RecordsTable({ records }: RecordsTableProps) {
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No records found
              </TableCell>
            </TableRow>
          ) : (
            records.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.recipient_name}</TableCell>
                <TableCell>{record.certificate_number}</TableCell>
                <TableCell>{record.course_name}</TableCell>
                <TableCell>
                  <span className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
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
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
