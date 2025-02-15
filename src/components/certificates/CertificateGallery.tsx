
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { StudentRecord } from "@/types/records";
import { FileImage, Download, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface CertificateGalleryProps {
  records: StudentRecord[];
  onUpdateRecord: (recordId: string, formData: FormData) => Promise<void>;
}

export const CertificateGallery = ({ records }: CertificateGalleryProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {records.map((record, index) => (
        <motion.div
          key={record.id}
          variants={itemVariants}
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="aspect-[4/3] relative bg-gray-100 overflow-hidden">
              {record.diploma_image_url ? (
                <img
                  src={record.diploma_image_url}
                  alt={`Certificate for ${record.recipient_name}`}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FileImage className="h-16 w-16 text-gray-400" />
                </div>
              )}
              <div className="absolute top-2 right-2">
                {record.status === 'active' ? (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-500" />
                )}
              </div>
            </div>
            <CardContent className="p-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg truncate">{record.recipient_name}</h3>
                <p className="text-sm text-muted-foreground truncate">{record.course_name}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Issued: {format(new Date(record.issue_date), 'MMM d, yyyy')}</span>
                  <Button variant="ghost" size="sm" className="hover:bg-primary/5">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};
