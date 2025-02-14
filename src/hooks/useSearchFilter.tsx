
import { useState, useCallback } from "react";
import { StudentRecord } from "@/types/records";

export const useSearchFilter = (records: StudentRecord[]) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRecords = records.filter((record) => {
    if (!searchQuery.trim()) return true;
    
    const searchTerm = searchQuery.toLowerCase().trim();
    
    // Fields to search through
    const searchFields = [
      record.recipient_name,
      record.certificate_number,
      record.course_name,
      record.email,
      record.provider,
      record.status,
    ].filter(Boolean);
    
    return searchFields.some(field => 
      field?.toLowerCase().includes(searchTerm)
    );
  });

  const handleSearch = useCallback((value: string) => {
    console.log('Search triggered with:', value);
    setSearchQuery(value);
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    filteredRecords,
    handleSearch
  };
};
