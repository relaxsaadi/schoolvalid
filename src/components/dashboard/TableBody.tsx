
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { TableBody as ShadcnTableBody, TableCell, TableRow } from "@/components/ui/table";
import { StudentRecord } from "@/pages/Dashboard";
import { EmptyState } from "./EmptyState";

interface TableBodyProps {
  records: StudentRecord[];
  filteredRecords: StudentRecord[];
  getStatusColor: (status?: string) => string;
}

export const TableBody = ({ records, filteredRecords, getStatusColor }: TableBodyProps) => {
  if (filteredRecords.length === 0) {
    return (
      <ShadcnTableBody>
        <EmptyState hasRecords={records.length > 0} />
      </ShadcnTableBody>
    );
  }

  return (
    <ShadcnTableBody>
      {filteredRecords.map((record) => (
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
      ))}
    </ShadcnTableBody>
  );
};
