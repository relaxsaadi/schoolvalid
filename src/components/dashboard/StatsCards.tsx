
import { Users, Award, Bell, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StudentRecord } from "@/pages/Dashboard";

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
        <Card key={stat.title} className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <div className="absolute right-4 top-4 p-2 bg-primary/10 rounded-full">
              <stat.icon className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.description}
            </p>
            <div className={cn(
              "text-xs mt-2",
              stat.trendUp ? "text-emerald-600" : "text-red-600"
            )}>
              {stat.trend} from last month
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
