
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { StudentRecord } from "@/types/records";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Pencil, 
  QrCode,
  CalendarClock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface StudentRecordCardProps {
  record: StudentRecord;
  index: number;
  getStatusColor: (status?: string) => string;
  onClick: () => void;
  onUpdate: (e: React.MouseEvent) => void;
}

export const getExpirationStatus = (validThrough: string) => {
  const expirationDate = new Date(validThrough);
  const now = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(now.getDate() + 30);

  if (expirationDate < now) {
    return { status: 'expired', icon: XCircle, color: 'text-red-500' };
  } else if (expirationDate < thirtyDaysFromNow) {
    return { status: 'expiring-soon', icon: AlertCircle, color: 'text-yellow-500' };
  }
  return { status: 'active', icon: CheckCircle2, color: 'text-green-500' };
};

export const StudentRecordCard = ({
  record,
  index,
  getStatusColor,
  onClick,
  onUpdate
}: StudentRecordCardProps) => {
  const expirationInfo = getExpirationStatus(record.valid_through);
  const ExpirationIcon = expirationInfo.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        transition: {
          delay: index * 0.1,
          duration: 0.5
        }
      }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className="relative group"
    >
      <Card 
        className="overflow-hidden hover:shadow-lg transition-all duration-300"
        onClick={onClick}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <h3 className="font-semibold text-lg text-primary">
                {record.recipient_name}
              </h3>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="font-medium text-foreground">Certificate:</span>
                  <span className="font-mono">{record.certificate_number}</span>
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="font-medium text-foreground">Course:</span>
                  <span>{record.course_name}</span>
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <ExpirationIcon className={cn("h-5 w-5", expirationInfo.color)} />
              </motion.div>
              <motion.span 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
                  getStatusColor(record.status)
                )}
              >
                {record.status}
              </motion.span>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-1 text-xs text-muted-foreground"
              >
                <CalendarClock className="h-3 w-3" />
                <span>Expires: {format(new Date(record.valid_through), 'MMM d, yyyy')}</span>
              </motion.div>
            </div>
          </div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute top-2 right-2 flex gap-2"
          >
            <Button
              variant="secondary"
              size="icon"
              onClick={onUpdate}
              className="bg-white/80 backdrop-blur-sm hover:bg-white"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="bg-white/80 backdrop-blur-sm hover:bg-white"
                >
                  <QrCode className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  View QR Code
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Email Certificate
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
