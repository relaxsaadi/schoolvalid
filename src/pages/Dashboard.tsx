
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddRecordDialog } from "@/components/AddRecordDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserNav } from "@/components/UserNav";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { RecordsTable } from "@/components/dashboard/RecordsTable";

export interface StudentRecord {
  id: string;
  recipient_name: string;
  certificate_number: string;
  course_name: string;
  created_at: string;
  valid_through?: string;
  status?: string;
  email?: string;
  year_of_birth?: number;
  course_description?: string;
  diploma_image_url?: string | null;
  provider_description?: string | null;
  organization_id: string;
}

const Dashboard = () => {
  const [records, setRecords] = useState<StudentRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { user }, error: sessionError } = await supabase.auth.getUser();
      
      if (sessionError || !user) {
        navigate('/sign-in');
        return;
      }
    };

    checkSession();
  }, [navigate]);

  const fetchRecords = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data: { user }, error: sessionError } = await supabase.auth.getUser();
      if (sessionError) {
        console.error('Session error:', sessionError);
        toast({
          title: "Authentication Error",
          description: "Please sign in again",
          variant: "destructive",
        });
        navigate('/sign-in');
        return;
      }

      if (!user) {
        navigate('/sign-in');
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Profile error:', profileError);
        toast({
          title: "Error",
          description: "Unable to fetch your profile. Please try signing out and back in.",
          variant: "destructive",
        });
        return;
      }

      if (!profile?.organization_id) {
        toast({
          title: "Error",
          description: "No organization found for your profile. Please contact support.",
          variant: "destructive",
        });
        return;
      }

      const { data: certificatesData, error: certificatesError } = await supabase
        .from('certificates')
        .select('*')
        .eq('organization_id', profile.organization_id)
        .order('created_at', { ascending: false });

      if (certificatesError) {
        console.error('Certificates error:', certificatesError);
        toast({
          title: "Error",
          description: "Unable to fetch records. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setRecords(certificatesData || []);
    } catch (error) {
      console.error('Fetch records error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleAddRecord = async (newRecord: Omit<StudentRecord, "id" | "created_at">) => {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .insert([{
          recipient_name: newRecord.recipient_name,
          certificate_number: newRecord.certificate_number,
          course_name: newRecord.course_name,
          status: newRecord.status || 'active',
          blockchain_hash: 'pending',
          blockchain_timestamp: new Date().toISOString(),
          issue_date: new Date().toISOString(),
          valid_through: newRecord.valid_through,
          year_of_birth: newRecord.year_of_birth,
          email: newRecord.email,
          course_description: newRecord.course_description,
          diploma_image_url: newRecord.diploma_image_url,
          provider_description: newRecord.provider_description,
          provider: 'Default Provider',
          organization_id: newRecord.organization_id,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding record:', error);
        toast({
          title: "Error",
          description: "Failed to add record: " + error.message,
          variant: "destructive",
        });
        return;
      }

      setRecords((prev) => [data, ...prev]);
      toast({
        title: "Success",
        description: "Record added successfully",
      });
    } catch (error) {
      console.error('Add record error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while adding the record",
        variant: "destructive",
      });
    }
  };

  const filteredRecords = records.filter((record) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      record.recipient_name.toLowerCase().includes(searchTerm) ||
      record.certificate_number.toLowerCase().includes(searchTerm) ||
      record.course_name.toLowerCase().includes(searchTerm)
    );
  });

  const getStatusColor = (status: string = 'active') => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20';
      case 'pending':
        return 'bg-yellow-50 text-yellow-800 ring-yellow-600/20';
      case 'expired':
        return 'bg-red-50 text-red-700 ring-red-600/20';
      default:
        return 'bg-gray-50 text-gray-700 ring-gray-600/20';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardNav sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 lg:pl-64">
        <header className="sticky top-0 z-40 bg-white border-b">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <div className="flex items-center gap-4">
              <div className="relative w-64 max-w-sm hidden md:block">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search records..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <UserNav />
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          {/* Mobile Search */}
          <div className="mb-6 md:hidden">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search records..."
                className="pl-9 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mb-6 flex flex-wrap gap-4">
            <AddRecordDialog onAddRecord={handleAddRecord} />
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" /> Export Records
            </Button>
          </div>

          <StatsCards records={records} />
          <RecordsTable
            records={records}
            filteredRecords={filteredRecords}
            isLoading={isLoading}
            error={error}
            getStatusColor={getStatusColor}
          />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
