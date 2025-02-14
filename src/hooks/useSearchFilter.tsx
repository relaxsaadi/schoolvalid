
import { useState } from "react";
import { StudentRecord } from "@/types/records";

export const useSearchFilter = (records: StudentRecord[]) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRecords = records.filter((record) => {
    if (!searchQuery.trim()) return true; // Show all records when search is empty
    
    const searchTerm = searchQuery.toLowerCase().trim();
    const searchFields = [
      record.recipient_name,
      record.certificate_number,
      record.course_name,
      record.email,
      record.provider
    ];

    return searchFields.some(field => 
      field?.toLowerCase().includes(searchTerm)
    );
  });

  return {
    searchQuery,
    setSearchQuery,
    filteredRecords,
  };
};

