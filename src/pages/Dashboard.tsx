
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  FileText,
  Award,
  Bell,
  Download,
  Pencil,
} from "lucide-react";
import { AddRecordDialog } from "@/components/AddRecordDialog";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { TopNav } from "@/components/TopNav";
import { useNavigate } from "react-router-dom";

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
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<Date>();
  const [editingRecord, setEditingRecord] = useState<StudentRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

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

  const handleEdit = async () => {
    if (!editingRecord) return;

    try {
      const { error } = await supabase
        .from('certificates')
        .update({
          recipient_name: editingRecord.recipient_name,
          certificate_number: editingRecord.certificate_number,
          course_name: editingRecord.course_name,
          email: editingRecord.email,
          status: editingRecord.status,
          year_of_birth: editingRecord.year_of_birth,
          course_description: editingRecord.course_description,
          valid_through: editingRecord.valid_through,
          diploma_image_url: editingRecord.diploma_image_url,
          provider_description: editingRecord.provider_description,
        })
        .eq('id', editingRecord.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update record: " + error.message,
          variant: "destructive",
        });
        return;
      }

      setRecords(records.map(record => 
        record.id === editingRecord.id ? editingRecord : record
      ));
      setEditingRecord(null);
      toast({
        title: "Success",
        description: "Record updated successfully",
      });
    } catch (error) {
      console.error('Update record error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while updating",
        variant: "destructive",
      });
    }
  };

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

    const matchesStatus = !statusFilter || record.status === statusFilter;

    const matchesDate = !dateFilter || 
      format(new Date(record.created_at), 'yyyy-MM-dd') === format(dateFilter, 'yyyy-MM-dd');

    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <div className="flex min-h-screen flex-col">
      <TopNav searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <AddRecordDialog onAddRecord={handleAddRecord} />
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
          </div>
        </div>

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

        <div className="rounded-md border">
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No records found. {records.length === 0 ? "Add your first record using the button above." : "Try adjusting your search filters."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRecords.map((record) => (
                    <TableRow 
                      key={record.id}
                      className="transition-colors hover:bg-muted/50 animate-fade-in"
                    >
                      <TableCell>{record.recipient_name}</TableCell>
                      <TableCell>{record.certificate_number}</TableCell>
                      <TableCell>{record.course_name}</TableCell>
                      <TableCell>
                        <span className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
                          record.status === 'active' && "bg-green-100 text-green-800",
                          record.status === 'pending' && "bg-yellow-100 text-yellow-800",
                          record.status === 'expired' && "bg-red-100 text-red-800"
                        )}>
                          {record.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        {new Date(record.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="hover:text-blue-500 hover:scale-110 transition-all"
                                onClick={() => setEditingRecord(record)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit Record</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </main>

      <Dialog open={!!editingRecord} onOpenChange={(open) => !open && setEditingRecord(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Record</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Student Name</Label>
              <Input
                id="name"
                value={editingRecord?.recipient_name || ''}
                onChange={(e) => setEditingRecord(curr => curr ? {
                  ...curr,
                  recipient_name: e.target.value
                } : null)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="certificate_number">Certificate Number</Label>
              <Input
                id="certificate_number"
                value={editingRecord?.certificate_number || ''}
                onChange={(e) => setEditingRecord(curr => curr ? {
                  ...curr,
                  certificate_number: e.target.value
                } : null)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="course">Course Name</Label>
              <Input
                id="course"
                value={editingRecord?.course_name || ''}
                onChange={(e) => setEditingRecord(curr => curr ? {
                  ...curr,
                  course_name: e.target.value
                } : null)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="course_description">Course Description</Label>
              <Textarea
                id="course_description"
                value={editingRecord?.course_description || ''}
                onChange={(e) => setEditingRecord(curr => curr ? {
                  ...curr,
                  course_description: e.target.value
                } : null)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="provider_description">Provider Description</Label>
              <Textarea
                id="provider_description"
                value={editingRecord?.provider_description || ''}
                onChange={(e) => setEditingRecord(curr => curr ? {
                  ...curr,
                  provider_description: e.target.value
                } : null)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={editingRecord?.status || 'active'}
                onValueChange={(value) => setEditingRecord(curr => curr ? {
                  ...curr,
                  status: value
                } : null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editingRecord?.email || ''}
                onChange={(e) => setEditingRecord(curr => curr ? {
                  ...curr,
                  email: e.target.value
                } : null)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="year_of_birth">Year of Birth</Label>
              <Input
                id="year_of_birth"
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                value={editingRecord?.year_of_birth || ''}
                onChange={(e) => setEditingRecord(curr => curr ? {
                  ...curr,
                  year_of_birth: parseInt(e.target.value)
                } : null)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="valid_through">Valid Through</Label>
              <Input
                id="valid_through"
                type="date"
                value={editingRecord?.valid_through ? format(new Date(editingRecord.valid_through), 'yyyy-MM-dd') : ''}
                onChange={(e) => setEditingRecord(curr => curr ? {
                  ...curr,
                  valid_through: e.target.value
                } : null)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="diploma_image_url">Diploma Image URL</Label>
              <Input
                id="diploma_image_url"
                type="url"
                value={editingRecord?.diploma_image_url || ''}
                onChange={(e) => setEditingRecord(curr => curr ? {
                  ...curr,
                  diploma_image_url: e.target.value
                } : null)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingRecord(null)}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
