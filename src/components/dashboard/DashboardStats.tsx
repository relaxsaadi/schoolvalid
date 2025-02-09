
import { Card } from "@/components/ui/card";
import { Users, FileText, Award, Bell } from "lucide-react";
import { StudentRecord } from "@/pages/Dashboard";

interface DashboardStatsProps {
  records: StudentRecord[];
}

export const DashboardStats = ({ records }: DashboardStatsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-center space-x-4">
          <Users className="h-8 w-8 text-brand-500" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Total Students
            </p>
            <h3 className="text-2xl font-bold">{records.length}</h3>
          </div>
        </div>
      </Card>
      <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-center space-x-4">
          <FileText className="h-8 w-8 text-brand-500" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Active Records
            </p>
            <h3 className="text-2xl font-bold">
              {records.filter(r => r.status === 'active').length}
            </h3>
          </div>
        </div>
      </Card>
      <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-center space-x-4">
          <Award className="h-8 w-8 text-brand-500" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Certificates
            </p>
            <h3 className="text-2xl font-bold">{records.length}</h3>
          </div>
        </div>
      </Card>
      <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-center space-x-4">
          <Bell className="h-8 w-8 text-brand-500" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Pending Records
            </p>
            <h3 className="text-2xl font-bold">
              {records.filter(r => r.status === 'pending').length}
            </h3>
          </div>
        </div>
      </Card>
    </div>
  );
};

