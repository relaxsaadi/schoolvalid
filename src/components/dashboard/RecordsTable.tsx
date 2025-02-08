
import { StudentRecord } from "@/pages/Dashboard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface RecordsTableProps {
  records: StudentRecord[];
}

export function RecordsTable({ records }: RecordsTableProps) {
  return (
    <div className="rounded-xl border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-gray-600">Student Name</TableHead>
            <TableHead className="text-gray-600">Student ID</TableHead>
            <TableHead className="text-gray-600">Course</TableHead>
            <TableHead className="text-gray-600">Date Added</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No records found
              </TableCell>
            </TableRow>
          ) : (
            records.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">{record.recipient_name}</TableCell>
                <TableCell>{record.certificate_number}</TableCell>
                <TableCell>{record.course_name}</TableCell>
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
