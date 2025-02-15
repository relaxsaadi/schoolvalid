
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
  diploma_image_url?: string | null;
  organization_id?: string;
  phone?: string;
  registration_date?: string;
  organization?: string;
  completion_rate?: number;
  last_login?: string;
  last_activity?: string;
  enrolled_courses?: {
    name: string;
    progress: number;
    status: 'active' | 'completed' | 'inactive';
  }[];
  certificates?: {
    id: string;
    name: string;
    issueDate: string;
    status: 'issued' | 'pending';
  }[];
  notes?: {
    id: string;
    content: string;
    createdAt: string;
    createdBy: string;
  }[];
}

export type NewStudentRecord = Omit<StudentRecord, 'id' | 'created_at'>;
