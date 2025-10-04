export type StudentStatus = 'active' | 'inactive' | 'graduated' | 'suspended';

export interface Student {
  id: string;
  name: string;
  email: string;
  status: StudentStatus;
  isScholarship: boolean;
  attendancePercentage: number;
  assignmentScore: number;
  gradePointAverage: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface FilterOptions {
  status?: StudentStatus;
  isScholarship?: boolean;
  search?: string;
}

export interface SortConfig {
  field: keyof Student;
  direction: 'asc' | 'desc';
}
