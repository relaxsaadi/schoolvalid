
import { Users, Award, Bell, GraduationCap, Clock, TrendingUp, CheckCircle, ShieldCheck, BadgeCheck, ChartBar } from "lucide-react";
import { StudentRecord } from "@/types/records";
import { StatCard } from "./StatCard";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      title: "Total Certificates",
      value: records.length,
      description: "All issued certificates",
      icon: Award,
      trend: `${records.length - expiredCertificates.length} active`,
      trendUp: true,
    },
    {
      title: "Active vs Expired",
      value: expiredPercentage,
      description: `${expiredCertificates.length} expired certificates`,
      icon: Clock,
      trend: `${100 - expiredPercentage}% active`,
      trendUp: expiredPercentage < 50,
    },
    {
      title: "Recent Activity",
      value: recentCertificates.length,
      description: "Last 30 days",
      icon: TrendingUp,
      trend: `${growthRate}% growth`,
      trendUp: growthRate > 0,
    },
    {
      title: "Verification Rate",
      value: verificationRate,
      description: `${verifiedCertificates.length} verified`,
      icon: ShieldCheck,
      trend: "On blockchain",
      trendUp: true,
    },
    {
      title: "Unique Students",
      value: new Set(records.map(r => r.recipient_name)).size,
      description: "Individual learners",
      icon: Users,
      trend: "Distinct recipients",
      trendUp: true,
    },
    {
      title: "Course Coverage",
      value: Object.keys(courseCounts).length,
      description: "Different courses",
      icon: GraduationCap,
      trend: "Unique courses",
      trendUp: true,
    },
    {
      title: "Pending Verifications",
      value: records.filter(r => r.blockchain_hash === 'pending').length,
      description: "Awaiting verification",
      icon: Bell,
      trend: "To be verified",
      trendUp: false,
    },
    {
      title: "Success Rate",
      value: Math.round((records.filter(r => r.status === 'active').length / records.length) * 100) || 0,
      description: "Completion rate",
      icon: BadgeCheck,
      trend: "Success rate",
      trendUp: true,
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const getBarColor = (index: number) => {
    const colors = ['#22c55e', '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899'];
    return colors[index % colors.length];
  };

  return (
    <>
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat, index) => (
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
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChartBar className="h-5 w-5 text-muted-foreground" />
              Certificate Distribution by Course
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={courseData} layout="vertical">
                  <XAxis type="number" />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    width={150}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value} certificates`, "Count"]}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {courseData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={getBarColor(index)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};
