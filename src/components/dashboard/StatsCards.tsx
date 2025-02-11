
import { Users, Award, Bell, GraduationCap } from "lucide-react";
import { StudentRecord } from "@/pages/Dashboard";
import { StatCard } from "./StatCard";

interface StatsCardsProps {
  records: StudentRecord[];
}

export const StatsCards = ({ records }: StatsCardsProps) => {
  const stats = [
    {
      title: "Total Students",
      value: records.length,
      description: "Active enrollments",
      icon: Users,
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Active Certificates",
      value: records.filter(r => r.status === 'active').length,
      description: "Valid certificates",
      icon: Award,
      trend: "+8%",
      trendUp: true,
    },
    {
      title: "Pending Verifications",
      value: records.filter(r => r.status === 'pending').length,
      description: "Awaiting verification",
      icon: Bell,
      trend: "-2%",
      trendUp: false,
    },
    {
      title: "Total Courses",
      value: new Set(records.map(r => r.course_name)).size,
      description: "Unique courses",
      icon: GraduationCap,
      trend: "+15%",
      trendUp: true,
    },
  ];

  return (
    <div className="grid gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          description={stat.description}
          icon={stat.icon}
          trend={stat.trend}
          trendUp={stat.trendUp}
        />
      ))}
    </div>
  );
};
