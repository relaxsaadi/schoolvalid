
import { Users, FileText, Award, Bell } from "lucide-react";
import { StatCard } from "./StatCard";
import { StudentRecord } from "@/pages/Dashboard";

interface StatsOverviewProps {
  records: StudentRecord[];
}

export function StatsOverview({ records }: StatsOverviewProps) {
  const activeRecords = records.filter(r => r.status === 'active').length;
  const pendingRecords = records.filter(r => r.status === 'pending').length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard 
        icon={Users}
        label="Total Students"
        value={records.length}
      />
      <StatCard 
        icon={FileText}
        label="Active Records"
        value={activeRecords}
      />
      <StatCard 
        icon={Award}
        label="Certificates"
        value={records.length}
      />
      <StatCard 
        icon={Bell}
        label="Pending Records"
        value={pendingRecords}
      />
    </div>
  );
}
