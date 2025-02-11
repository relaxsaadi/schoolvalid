
export interface StudentRecord {
  id: string;
  recipient_name: string;
  certificate_number: string;
  course_name: string;
  created_at: string;
  valid_through: string;
  status: string;
  year_of_birth: number;
  course_description?: string;
  diploma_image_url?: string | null;
  provider_description?: string | null;
  provider: string;
  organization_id: string;
  blockchain_hash: string;
  blockchain_timestamp: string;
  issue_date: string;
}

export interface NewStudentRecord extends Omit<StudentRecord, 'id' | 'created_at'> {}
