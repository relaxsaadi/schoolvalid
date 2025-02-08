
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  FileText,
  Award,
  Bell,
  Search,
  Download,
  Plus,
  Filter,
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
import { AddCourseDialog } from "@/components/AddCourseDialog";

export interface Course {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface StudentRecord {
  id: string;
  recipient_name: string;
  certificate_number: string;
  course_name: string;
  course_id: string;
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
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState<"name" | "course" | "date">("name");
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    fetchRecords();
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('name');

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch courses",
        variant: "destructive",
      });
      return;
    }

    setCourses(data || []);
  };

  const fetchRecords = async () => {
    const { data, error } = await supabase
      .from('certificates')
      .select('*, courses(name)')
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

  const handleAddRecord = async (newRecord: Omit<StudentRecord, "id" | "created_at">) => {
    const { data: courseData } = await supabase
      .from('courses')
      .select('id')
      .eq('name', newRecord.course_name)
      .single();

    const { data, error } = await supabase
      .from('certificates')
      .insert([{
        recipient_name: newRecord.recipient_name,
        certificate_number: newRecord.certificate_number,
        course_name: newRecord.course_name,
        course_id: courseData?.id,
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

  const handleAddCourse = async (course: { name: string; description?: string }) => {
    const { data, error } = await supabase
      .from('courses')
      .insert([course])
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add course",
        variant: "destructive",
      });
      return;
    }

    setCourses((prev) => [...prev, data]);
    toast({
      title: "Success",
      description: "Course added successfully",
    });
  };

  const filteredRecords = records.filter((record) => {
    const matchesSearch = (
      record.recipient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.certificate_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.course_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!matchesSearch) return false;

    if (selectedCourse && record.course_id !== selectedCourse) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    if (filterBy === "date") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    if (filterBy === "course") {
      return a.course_name.localeCompare(b.course_name);
    }
    return a.recipient_name.localeCompare(b.recipient_name);
  });

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <div className="w-full max-w-lg relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search records..."
                className="w-full pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <AddCourseDialog onAddCourse={handleAddCourse} />
            <AddRecordDialog onAddRecord={handleAddRecord} courses={courses} />
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
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
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <FileText className="h-8 w-8 text-brand-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Records
                </p>
                <h3 className="text-2xl font-bold">{records.length}</h3>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <Award className="h-8 w-8 text-brand-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Courses
                </p>
                <h3 className="text-2xl font-bold">{courses.length}</h3>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <Bell className="h-8 w-8 text-brand-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Pending Tasks
                </p>
                <h3 className="text-2xl font-bold">0</h3>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex gap-4 items-center">
          <Select value={filterBy} onValueChange={(value: "name" | "course" | "date") => setFilterBy(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Sort by Name</SelectItem>
              <SelectItem value="course">Sort by Course</SelectItem>
              <SelectItem value="date">Sort by Date</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Filter by course..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Courses</SelectItem>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Student ID</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Date Added</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No records found
                  </TableCell>
                </TableRow>
              ) : (
                filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.recipient_name}</TableCell>
                    <TableCell>{record.certificate_number}</TableCell>
                    <TableCell>{record.course_name}</TableCell>
                    <TableCell>
                      {new Date(record.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
