
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  // Get color based on trend
  const getTrendColor = (trendUp: boolean) => {
    return trendUp ? "text-emerald-600" : "text-red-600";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className="h-full"
    >
      <Card className="relative overflow-hidden h-full transition-colors hover:bg-accent/5">
        <CardHeader className="pb-2">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute right-4 top-4 p-2 bg-primary/10 rounded-full"
          >
            <Icon className="h-4 w-4 text-primary" />
          </motion.div>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-2xl font-bold"
          >
            {value}
          </motion.div>
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
          <div className={cn(
            "text-xs mt-2 flex items-center gap-1",
            getTrendColor(trendUp)
          )}>
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: trendUp ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              ↑
            </motion.div>
            {trend}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
