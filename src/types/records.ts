
export interface StudentRecord {
  id: string;
  recipient_name: string;
  certificate_number: string;
  course_name: string;
  created_at: string;
  valid_through: string;
  status: 'active' | 'expired' | 'revoked';
  year_of_birth: number;
  course_description?: string;
  provider_description?: string | null;
  provider: string;
  blockchain_hash: string;
  blockchain_timestamp: string;
  issue_date: string;
  email: string;
}

export type NewStudentRecord = Omit<StudentRecord, 'id' | 'created_at'>;
