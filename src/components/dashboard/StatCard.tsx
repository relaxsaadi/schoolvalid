
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-2">
        <div className="absolute right-4 top-4 p-2 bg-primary/10 rounded-full">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">
          {description}
        </p>
        <div className={cn(
          "text-xs mt-2",
          trendUp ? "text-emerald-600" : "text-red-600"
        )}>
          {trend} from last month
        </div>
      </CardContent>
    </Card>
  );
};
