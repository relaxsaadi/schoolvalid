
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
  trend: string;
  trendUp: boolean;
}

export const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendUp,
}: StatCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
      className="relative"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          />
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  delay: 0.3
                }}
                className={`flex items-center px-2.5 py-0.5 rounded text-sm font-medium ${
                  trendUp ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {trend}
              </motion.div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                {title}
              </h3>
              <div className="flex items-baseline">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-2xl font-bold"
                >
                  {typeof value === 'number' && value % 1 === 0 ? value : `${value}%`}
                </motion.div>
                <div className="ml-2 text-sm text-muted-foreground">
                  {description}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};
