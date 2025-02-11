
import { Users, Award, Bell, GraduationCap, Clock, TrendingUp, CheckCircle, ShieldCheck } from "lucide-react";
import { StudentRecord } from "@/types/records";
import { StatCard } from "./StatCard";
import { format } from "date-fns";

interface StatsCardsProps {
  records: StudentRecord[];
}

export const StatsCards = ({ records }: StatsCardsProps) => {
  // Calculate expired certificates
  const now = new Date();
  const expiredCertificates = records.filter(r => new Date(r.valid_through) < now);
  const expiredPercentage = records.length > 0 
    ? Math.round((expiredCertificates.length / records.length) * 100) 
    : 0;

  // Calculate most popular course
  const courseCounts = records.reduce((acc, record) => {
    acc[record.course_name] = (acc[record.course_name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostPopularCourse = Object.entries(courseCounts)
    .sort(([, a], [, b]) => b - a)[0]?.[0] || "N/A";

  // Calculate recent activity
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentCertificates = records.filter(r => 
    new Date(r.created_at || '') > thirtyDaysAgo
  );

  const growthRate = records.length > 0
    ? Math.round((recentCertificates.length / records.length) * 100)
    : 0;

  const stats = [
    {
      title: "Active Certificates",
      value: records.filter(r => r.status === 'active').length,
      description: "Valid and active certificates",
      icon: Award,
      trend: `${records.length - expiredCertificates.length} valid`,
      trendUp: true,
    },
    {
      title: "Expiring Soon",
      value: expiredPercentage,
      description: "Percentage of expired certificates",
      icon: Clock,
      trend: `${expiredCertificates.length} expired`,
      trendUp: false,
    },
    {
      title: "Recent Activity",
      value: recentCertificates.length,
      description: "Certificates issued in last 30 days",
      icon: TrendingUp,
      trend: `${growthRate}% growth`,
      trendUp: growthRate > 0,
    },
    {
      title: "Most Popular Course",
      value: courseCounts[mostPopularCourse] || 0,
      description: mostPopularCourse,
      icon: GraduationCap,
      trend: "Most awarded",
      trendUp: true,
    },
    {
      title: "Total Students",
      value: new Set(records.map(r => r.recipient_name)).size,
      description: "Unique certificate recipients",
      icon: Users,
      trend: "Distinct learners",
      trendUp: true,
    },
    {
      title: "Validation Rate",
      value: records.filter(r => r.blockchain_hash !== 'pending').length,
      description: "Blockchain validated certificates",
      icon: ShieldCheck,
      trend: "Verified on chain",
      trendUp: true,
    },
    {
      title: "Pending Verifications",
      value: records.filter(r => r.status === 'pending').length,
      description: "Awaiting verification",
      icon: Bell,
      trend: "In progress",
      trendUp: false,
    },
    {
      title: "Completion Rate",
      value: Math.round((records.filter(r => r.status === 'active').length / records.length) * 100) || 0,
      description: "Successfully completed certificates",
      icon: CheckCircle,
      trend: "Success rate",
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
