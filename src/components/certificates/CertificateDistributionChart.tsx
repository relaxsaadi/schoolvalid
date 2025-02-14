
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartBar } from "lucide-react";
import { StudentRecord } from "@/types/records";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from "framer-motion";

interface CertificateDistributionChartProps {
  records: StudentRecord[];
}

export const CertificateDistributionChart = ({ records }: CertificateDistributionChartProps) => {
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
    .slice(0, 8);

  const getBarColor = (index: number) => {
    const colors = ['#22c55e', '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899'];
    return colors[index % colors.length];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mb-8"
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
        <CardHeader className="border-b bg-muted/50">
          <CardTitle className="flex items-center gap-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <ChartBar className="h-5 w-5 text-primary" />
            </motion.div>
            Certificate Distribution by Course
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <motion.div 
            className="h-[300px] mt-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={courseData} layout="vertical">
                <XAxis 
                  type="number"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={150}
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  formatter={(value) => [`${value} certificates`, "Count"]}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Bar 
                  dataKey="count" 
                  radius={[4, 4, 4, 4]}
                  animationBegin={800}
                  animationDuration={1000}
                >
                  {courseData.map((_, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={getBarColor(index)}
                      className="hover:opacity-80 transition-opacity duration-200"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
