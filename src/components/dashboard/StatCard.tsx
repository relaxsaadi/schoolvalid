
import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
}

export function StatCard({ icon: Icon, label, value }: StatCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center space-x-4">
        <Icon className="h-8 w-8 text-brand-500" />
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {label}
          </p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
      </div>
    </Card>
  );
}
