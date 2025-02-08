
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TopNav } from "@/components/TopNav";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
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
}

const Dashboard = () => {
  const [records, setRecords] = useState<StudentRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
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

  const filteredRecords = records.filter((record) => {
    const matchesSearch = 
      record.recipient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.certificate_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.course_name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
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
    <div className="flex min-h-screen flex-col bg-background">
      <TopNav searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <main className="flex-1 space-y-4 p-8 pt-6">
        <DashboardHeader onAddRecord={handleAddRecord} />
        <StatsOverview records={records} />
        <RecordsTable records={filteredRecords} />
      </main>
    </div>
  );
};

export default Dashboard;
