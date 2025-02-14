
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
      className="relative group"
    >
      <Card 
        className="overflow-hidden hover:shadow-lg transition-shadow duration-200"
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">{record.recipient_name}</h3>
              <p className="text-sm text-muted-foreground">
                Certificate: {record.certificate_number}
              </p>
              <p className="text-sm text-muted-foreground">
                Course: {record.course_name}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <ExpirationIcon className={cn("h-5 w-5", expirationInfo.color)} />
              <span className={cn(
                "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset",
                getStatusColor(record.status)
              )}>
                {record.status}
              </span>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <CalendarClock className="h-3 w-3" />
                <span>Expires: {format(new Date(record.valid_through), 'MMM d, yyyy')}</span>
              </div>
            </div>
          </div>
          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
