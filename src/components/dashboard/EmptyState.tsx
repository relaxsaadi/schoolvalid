
import { FileText } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";

interface EmptyStateProps {
  hasRecords: boolean;
}

export const EmptyState = ({ hasRecords }: EmptyStateProps) => {
  return (
    <TableRow>
      <TableCell colSpan={5} className="text-center h-32">
        <div className="flex flex-col items-center justify-center text-muted-foreground">
          <FileText className="h-8 w-8 mb-2" />
          <p>No records found</p>
          <p className="text-sm">
            {hasRecords 
              ? "Try adjusting your search filters." 
              : "Add your first record using the button above."}
          </p>
        </div>
      </TableCell>
    </TableRow>
  );
};
