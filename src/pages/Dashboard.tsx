import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  FileText,
  Award,
  Bell,
  Download,
  Filter,
  Pencil,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { TopNav } from "@/components/TopNav";

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
}

const Dashboard = () => {
  const [records, setRecords] = useState<StudentRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<Date>();
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch records",
        variant: "destructive",
      });
      return;
    }

    setRecords(data || []);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('certificates')
      .delete()
      .match({ id });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete record",
        variant: "destructive",
      });
      return;
    }

    setRecords(records.filter(record => record.id !== id));
    setRecordToDelete(null);
    toast({
      title: "Success",
      description: "Record deleted successfully",
    });
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

  const handleAddRecord = async (newRecord: Omit<StudentRecord, "id" | "created_at">) => {
    const { data, error } = await supabase
      .from('certificates')
      .insert([{
        recipient_name: newRecord.recipient_name,
        certificate_number: newRecord.certificate_number,
        course_name: newRecord.course_name,
        status: newRecord.status,
        blockchain_hash: 'pending',
        blockchain_timestamp: new Date().toISOString(),
        issue_date: new Date().toISOString(),
        valid_through: newRecord.valid_through,
        year_of_birth: newRecord.year_of_birth,
        email: newRecord.email,
        course_description: newRecord.course_description,
        diploma_image_url: newRecord.diploma_image_url,
        provider: 'Default Provider',
      }])
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add record",
        variant: "destructive",
      });
      return;
    }

    setRecords((prev) => [data, ...prev]);
    toast({
      title: "Success",
      description: "Record added successfully",
    });
  };

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
                    No records found
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
                              className="hover:text-red-500 hover:scale-110 transition-all"
                              onClick={() => setRecordToDelete(record.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete Record</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </main>

      <AlertDialog open={!!recordToDelete} onOpenChange={() => setRecordToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => recordToDelete && handleDelete(recordToDelete)}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;
