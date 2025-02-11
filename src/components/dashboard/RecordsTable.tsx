
import { Table } from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StudentRecord } from "@/types/records";
import { TableHeader } from "./TableHeader";
import { TableBody } from "./TableBody";

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
              <TableHeader />
              <TableBody 
                records={records}
                filteredRecords={filteredRecords}
                getStatusColor={getStatusColor}
              />
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
