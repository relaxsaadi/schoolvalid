
import {
  TableHead,
  TableHeader as ShadcnTableHeader,
  TableRow,
} from "@/components/ui/table";

export const TableHeader = () => {
  return (
    <ShadcnTableHeader>
      <TableRow>
        <TableHead>Student Name</TableHead>
        <TableHead>Certificate ID</TableHead>
        <TableHead className="hidden md:table-cell">Course</TableHead>
        <TableHead>Status</TableHead>
        <TableHead className="hidden lg:table-cell">Date</TableHead>
      </TableRow>
    </ShadcnTableHeader>
  );
};
