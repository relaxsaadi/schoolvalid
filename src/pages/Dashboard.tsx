
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  BarChart3,
  Users,
  Award,
  Bell,
  Download,
  Search,
  Plus,
  FileText,
  Settings,
  Menu,
  UserCircle,
  LayoutDashboard,
  GraduationCap,
  ScrollText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AddRecordDialog } from "@/components/AddRecordDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UserNav } from "@/components/UserNav";

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

  const navigationItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: true },
    { icon: ScrollText, label: "Certificates" },
    { icon: GraduationCap, label: "Courses" },
    { icon: Users, label: "Students" },
    { icon: Settings, label: "Settings" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Navigation */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden fixed top-4 left-4 z-50">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-16 items-center border-b px-6">
            <img
              className="h-8 w-auto"
              src="/placeholder.svg"
              alt="Company Logo"
            />
          </div>
          <nav className="flex flex-col gap-1 p-4">
            {navigationItems.map((item) => (
              <Button
                key={item.label}
                variant={item.active ? "secondary" : "ghost"}
                className="justify-start w-full"
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r">
        <div className="flex h-16 items-center border-b px-6">
          <img
            className="h-8 w-auto"
            src="/placeholder.svg"
            alt="Company Logo"
          />
        </div>
        <nav className="flex flex-col gap-1 p-4 flex-1">
          {navigationItems.map((item) => (
            <Button
              key={item.label}
              variant={item.active ? "secondary" : "ghost"}
              className="justify-start w-full"
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </nav>
      </div>

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

          {/* Stats Grid */}
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

          {/* Records Table */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Records</CardTitle>
              <CardDescription>
                View and manage student certificates
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error ? (
                <div className="p-8 text-center">
                  <p className="text-red-500 mb-4">{error}</p>
                  <Button onClick={() => fetchRecords()}>Try Again</Button>
                </div>
              ) : isLoading ? (
                <div className="p-8 text-center text-muted-foreground">
                  Loading records...
                </div>
              ) : (
                <div className="relative overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Certificate ID</TableHead>
                        <TableHead className="hidden md:table-cell">Course</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="hidden lg:table-cell">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRecords.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center h-32">
                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                              <FileText className="h-8 w-8 mb-2" />
                              <p>No records found</p>
                              <p className="text-sm">
                                {records.length === 0 
                                  ? "Add your first record using the button above." 
                                  : "Try adjusting your search filters."}
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredRecords.map((record) => (
                          <TableRow key={record.id} className="group">
                            <TableCell className="font-medium">
                              {record.recipient_name}
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                              {record.certificate_number}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {record.course_name}
                            </TableCell>
                            <TableCell>
                              <span className={cn(
                                "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset",
                                getStatusColor(record.status)
                              )}>
                                {record.status}
                              </span>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell text-muted-foreground">
                              {format(new Date(record.created_at), 'MMM d, yyyy')}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
