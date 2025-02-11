
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
  FileText,
  BookOpen,
  Settings,
  Menu,
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
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
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
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
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

      if (!session) {
        navigate('/sign-in');
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', session.user.id)
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
    const matchesSearch = 
      record.recipient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.certificate_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.course_name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const getStatusColor = (status: string = 'active') => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = [
    {
      title: "Total Students",
      value: records.length,
      icon: Users,
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Active Records",
      value: records.filter(r => r.status === 'active').length,
      icon: FileText,
      trend: "+8%",
      trendUp: true,
    },
    {
      title: "Certificates",
      value: records.length,
      icon: Award,
      trend: "+15%",
      trendUp: true,
    },
    {
      title: "Pending",
      value: records.filter(r => r.status === 'pending').length,
      icon: Bell,
      trend: "-2%",
      trendUp: false,
    },
  ];

  const navigationItems = [
    { icon: BarChart3, label: "Dashboard", active: true },
    { icon: Users, label: "Students" },
    { icon: BookOpen, label: "Courses" },
    { icon: Settings, label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Navigation */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" className="lg:hidden fixed top-4 left-4">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64">
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold">Navigation</h2>
              <div className="space-y-1">
                {navigationItems.map((item) => (
                  <Button
                    key={item.label}
                    variant={item.active ? "secondary" : "ghost"}
                    className="w-full justify-start"
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Navigation */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <img
              className="h-8 w-auto"
              src="/placeholder.svg"
              alt="Your Company"
            />
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigationItems.map((item) => (
                    <li key={item.label}>
                      <Button
                        variant={item.active ? "secondary" : "ghost"}
                        className="w-full justify-start"
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.label}
                      </Button>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-72">
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your certificates and student records
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search records..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <AddRecordDialog onAddRecord={handleAddRecord} />
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" /> Export
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className={cn(
                      "text-xs",
                      stat.trendUp ? "text-green-600" : "text-red-600"
                    )}>
                      {stat.trend} from last month
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Records Table */}
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Records</CardTitle>
                  <CardDescription>
                    Manage and view all your student records
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
                            <TableHead>Student ID</TableHead>
                            <TableHead>Course</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date Added</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredRecords.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center">
                                No records found. {records.length === 0 ? "Add your first record using the button above." : "Try adjusting your search filters."}
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredRecords.map((record) => (
                              <TableRow key={record.id}>
                                <TableCell className="font-medium">
                                  {record.recipient_name}
                                </TableCell>
                                <TableCell>{record.certificate_number}</TableCell>
                                <TableCell>{record.course_name}</TableCell>
                                <TableCell>
                                  <span className={cn(
                                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                                    getStatusColor(record.status)
                                  )}>
                                    {record.status}
                                  </span>
                                </TableCell>
                                <TableCell>
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
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
