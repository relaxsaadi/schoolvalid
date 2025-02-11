
import { useState } from "react";
import { StudentRecord } from "@/types/records";

export const useSearchFilter = (records: StudentRecord[]) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRecords = records.filter((record) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      record.recipient_name.toLowerCase().includes(searchTerm) ||
      record.certificate_number.toLowerCase().includes(searchTerm) ||
      record.course_name.toLowerCase().includes(searchTerm)
    );
  });

  return {
    searchQuery,
    setSearchQuery,
    filteredRecords,
  };
};
