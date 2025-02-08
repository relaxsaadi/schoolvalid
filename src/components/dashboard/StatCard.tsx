
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
}

export function StatCard({ icon: Icon, label, value }: StatCardProps) {
  return (
    <div className="rounded-xl border bg-white p-6">
      <div className="flex items-center space-x-4">
        <div className="rounded-lg p-2">
          <Icon className="h-6 w-6 text-blue-500" />
        </div>
        <div>
          <p className="text-base text-gray-600">
            {label}
          </p>
          <h3 className="text-3xl font-bold">{value}</h3>
        </div>
      </div>
    </div>
  );
}
