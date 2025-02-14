
import { useState, useCallback } from "react";
import { StudentRecord } from "@/types/records";

export const useSearchFilter = (records: StudentRecord[]) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRecords = records.filter((record) => {
    if (!searchQuery.trim()) return true;
    
    const searchTerm = searchQuery.toLowerCase().trim();
    const searchFields = [
      record.recipient_name?.toLowerCase(),
      record.certificate_number?.toLowerCase(),
      record.course_name?.toLowerCase(),
      record.email?.toLowerCase(),
      record.provider?.toLowerCase()
    ].filter(Boolean);

    return searchFields.some(field => field?.includes(searchTerm));
  });

  return {
    searchQuery,
    setSearchQuery,
    filteredRecords,
  };
};
