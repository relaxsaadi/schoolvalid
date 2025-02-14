
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StudentRecord } from "@/types/records";
import { TableBody } from "./TableBody";

interface RecordsTableProps {
  records: StudentRecord[];
  filteredRecords: StudentRecord[];
  isLoading: boolean;
  error: string | null;
  getStatusColor: (status?: string) => string;
  onUpdateRecord: (recordId: string, formData: FormData) => Promise<void>;
}

export const RecordsTable = ({
  records,
  filteredRecords,
  isLoading,
  error,
  getStatusColor,
  onUpdateRecord,
}: RecordsTableProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden">
        <CardHeader>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <CardTitle>Certificates Gallery</CardTitle>
            <CardDescription>
              View and manage student certificates
              {filteredRecords.length !== records.length && (
                ` (${filteredRecords.length} results)`
              )}
            </CardDescription>
          </motion.div>
        </CardHeader>
        <CardContent>
          {error ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 text-center"
            >
              <p className="text-red-500 mb-4">{error}</p>
            </motion.div>
          ) : isLoading ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-8 text-center text-muted-foreground"
            >
              <div className="flex items-center justify-center space-x-2">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent"
                />
                <span>Loading certificates...</span>
              </div>
            </motion.div>
          ) : (
            <TableBody 
              records={records}
              filteredRecords={filteredRecords}
              getStatusColor={getStatusColor}
              onUpdateRecord={onUpdateRecord}
            />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
