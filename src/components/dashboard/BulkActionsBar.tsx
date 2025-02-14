
import { Mail, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface BulkActionsBarProps {
  selectedCount: number;
  onAction: (action: 'download' | 'email' | 'verify') => void;
}

export const BulkActionsBar = ({ selectedCount, onAction }: BulkActionsBarProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b p-4 mb-4 flex items-center justify-between"
    >
      <span className="text-sm text-muted-foreground">
        {selectedCount} certificate(s) selected
      </span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAction('email')}
        >
          <Mail className="h-4 w-4 mr-2" />
          Email
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAction('verify')}
        >
          <QrCode className="h-4 w-4 mr-2" />
          Verify
        </Button>
      </div>
    </motion.div>
  );
};
