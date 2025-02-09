import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { AddRecordDialog } from "@/components/AddRecordDialog";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TopNav } from "@/components/TopNav";
import { Organization } from "@/types/organization";
import { useNavigate } from "react-router-dom";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { CertificatesTable } from "@/components/dashboard/CertificatesTable";
import { EditRecordDialog } from "@/components/dashboard/EditRecordDialog";
import { format } from "date-fns";

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
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkSessionAndFetchData();
  }, [navigate]);

  const checkSessionAndFetchData = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) throw sessionError;
      
      if (!session) {
        navigate("/sign-in");
        return;
      }

      await fetchOrganizationAndRecords();
    } catch (error: any) {
      console.error("Session check error:", error);
      toast({
        title: "Authentication Error",
        description: "Please sign in again.",
        variant: "destructive",
      });
      navigate("/sign-in");
    }
  };

  const fetchOrganizationAndRecords = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/sign-in");
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) throw profileError;

      if (!profileData?.organization_id) {
        toast({
          title: "No organization found",
          description: "Please contact support to set up your organization.",
          variant: "destructive",
        });
        return;
      }

      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', profileData.organization_id)
        .maybeSingle();

      if (orgError) throw orgError;

      if (!orgData) {
        toast({
          title: "Organization not found",
          description: "The organization associated with your account was not found.",
          variant: "destructive",
        });
        return;
      }

      setOrganization(orgData);

      const { data: recordsData, error: recordsError } = await supabase
        .from('certificates')
        .select('*')
        .eq('organization_id', profileData.organization_id)
        .order('created_at', { ascending: false });

      if (recordsError) throw recordsError;
      
      setRecords(recordsData || []);
    } catch (error: any) {
      console.error("Data fetch error:", error);
      toast({
        title: "Error",
        description: "Failed to fetch data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!editingRecord || !organization) return;

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
          organization_id: organization.id
        })
        .eq('id', editingRecord.id);

      if (error) throw error;

      setRecords(records.map(record => 
        record.id === editingRecord.id ? editingRecord : record
      ));
      setEditingRecord(null);
      toast({
        title: "Success",
        description: "Record updated successfully",
      });
    } catch (error: any) {
      console.error("Update error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update record",
        variant: "destructive",
      });
    }
  };

  const handleAddRecord = async (newRecord: Omit<StudentRecord, "id" | "created_at" | "organization_id">) => {
    if (!organization) {
      toast({
        title: "Error",
        description: "No organization found. Please contact support.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('certificates')
        .insert({
          recipient_name: newRecord.recipient_name,
          certificate_number: newRecord.certificate_number,
          course_name: newRecord.course_name,
          email: newRecord.email || '',
          status: newRecord.status || 'pending',
          year_of_birth: newRecord.year_of_birth || new Date().getFullYear(),
          course_description: newRecord.course_description,
          valid_through: newRecord.valid_through || new Date().toISOString(),
          diploma_image_url: newRecord.diploma_image_url,
          provider_description: newRecord.provider_description,
          organization_id: organization.id,
          blockchain_hash: 'pending',
          blockchain_timestamp: new Date().toISOString(),
          issue_date: new Date().toISOString(),
          provider: 'Default Provider'
        })
        .select()
        .single();

      if (error) throw error;

      setRecords((prev) => [data, ...prev]);
      toast({
        title: "Success",
        description: "Record added successfully",
      });
    } catch (error: any) {
      console.error("Add record error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add record",
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

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <TopNav searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            {organization && (
              <p className="text-muted-foreground">
                {organization.name}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <AddRecordDialog onAddRecord={handleAddRecord} />
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
          </div>
        </div>

        <DashboardStats records={records} />

        <div className="grid gap-4">
          <DashboardFilters
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            onDateFilterChange={setDateFilter}
          />

          <CertificatesTable
            records={filteredRecords}
            onEditRecord={setEditingRecord}
          />
        </div>
      </main>

      <EditRecordDialog
        record={editingRecord}
        onClose={() => setEditingRecord(null)}
        onSave={handleEdit}
        onChange={setEditingRecord}
      />
    </div>
  );
};

export default Dashboard;
