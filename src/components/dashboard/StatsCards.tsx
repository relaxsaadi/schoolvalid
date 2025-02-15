
import { Users, Award, Bell, GraduationCap, Clock, TrendingUp, CheckCircle, ShieldCheck, BadgeCheck } from "lucide-react";
import { StudentRecord } from "@/types/records";
import { StatCard } from "./StatCard";
import { format } from "date-fns";
import { motion } from "framer-motion";

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

  // Calculate most popular courses with count
  const courseCounts = records.reduce((acc, record) => {
    acc[record.course_name] = (acc[record.course_name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const courseData = Object.entries(courseCounts)
    .map(([name, count]) => ({
      name: name.length > 20 ? name.substring(0, 20) + '...' : name,
      count
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8); // Top 8 courses

  const mostPopularCourse = courseData[0]?.name || "N/A";

  // Calculate recent activity
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentCertificates = records.filter(r => 
    new Date(r.created_at || '') > thirtyDaysAgo
  );

  const growthRate = records.length > 0
    ? Math.round((recentCertificates.length / records.length) * 100)
    : 0;

  // Calculate verified certificates
  const verifiedCertificates = records.filter(r => r.blockchain_hash !== 'pending');
  const verificationRate = records.length > 0
    ? Math.round((verifiedCertificates.length / records.length) * 100)
    : 0;

  const stats = [
    {
      title: "Total Students",
      value: records.length,
      description: "All registered students",
      icon: Users,
      trend: `${records.length - expiredCertificates.length} active`,
      trendUp: true,
    },
    {
      title: "Active vs Inactive",
      value: expiredPercentage,
      description: `${expiredCertificates.length} inactive students`,
      icon: Clock,
      trend: `${100 - expiredPercentage}% active`,
      trendUp: expiredPercentage < 50,
    },
    {
      title: "Recent Registrations",
      value: recentCertificates.length,
      description: "Last 30 days",
      icon: TrendingUp,
      trend: `${growthRate}% growth`,
      trendUp: growthRate > 0,
    },
    {
      title: "Average Completion",
      value: Math.round(records.reduce((acc, r) => acc + (r.completion_rate || 0), 0) / records.length) || 0,
      description: "Course completion rate",
      icon: CheckCircle,
      trend: "Overall progress",
      trendUp: true,
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid gap-6 mb-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-4"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <StatCard
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={stat.icon}
            trend={stat.trend}
            trendUp={stat.trendUp}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};
