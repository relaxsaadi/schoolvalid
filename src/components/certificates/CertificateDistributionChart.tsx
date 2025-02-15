import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartBar } from "lucide-react";
import { StudentRecord } from "@/types/records";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from "framer-motion";
interface CertificateDistributionChartProps {
  records: StudentRecord[];
}
export const CertificateDistributionChart = ({
  records
}: CertificateDistributionChartProps) => {
  const courseCounts = records.reduce((acc, record) => {
    acc[record.course_name] = (acc[record.course_name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const courseData = Object.entries(courseCounts).map(([name, count]) => ({
    name: name.length > 20 ? name.substring(0, 20) + '...' : name,
    count
  })).sort((a, b) => b.count - a.count).slice(0, 8);
  const getBarColor = (index: number) => {
    const colors = ['#22c55e', '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899'];
    return colors[index % colors.length];
  };
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    delay: 0.3
  }} className="mb-8">
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
        
        
      </Card>
    </motion.div>;
};