
import { useState } from "react";
import { StudentRecord } from "@/types/records";

export const useSearchFilter = (records: StudentRecord[]) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRecords = records.filter((record) => {
    if (!searchQuery.trim()) return true;
    
    const searchTerm = searchQuery.toLowerCase().trim();
    
    // Only search through fields that exist
    const searchableFields = [
      record.recipient_name,
      record.certificate_number,
      record.course_name,
      record.email,
      record.provider
    ].filter(Boolean); // Remove null/undefined values
    
    // Convert each field to lowercase for case-insensitive search
    const normalizedFields = searchableFields.map(field => 
      field?.toLowerCase() || ''
    );
    
    // Check if any field contains the search term
    return normalizedFields.some(field => field.includes(searchTerm));
  });

  console.log('Search Query:', searchQuery); // Debug log
  console.log('Filtered Records:', filteredRecords.length); // Debug log

  return {
    searchQuery,
    setSearchQuery,
    filteredRecords,
  };
};
