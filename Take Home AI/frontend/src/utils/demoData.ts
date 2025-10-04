import { Student } from '../types';
import { storage, calculateGPA } from './storage';

const generateId = () => crypto.randomUUID();

const demoStudents: Omit<Student, 'id' | 'createdAt' | 'updatedAt' | 'gradePointAverage'>[] = [
  {
    name: 'Alice Johnson',
    email: 'alice.johnson@university.edu',
    status: 'active',
    isScholarship: true,
    attendancePercentage: 95,
    assignmentScore: 92
  },
  {
    name: 'Bob Smith',
    email: 'bob.smith@university.edu',
    status: 'active',
    isScholarship: false,
    attendancePercentage: 88,
    assignmentScore: 85
  },
  {
    name: 'Carol Williams',
    email: 'carol.williams@university.edu',
    status: 'active',
    isScholarship: true,
    attendancePercentage: 92,
    assignmentScore: 95
  },
  {
    name: 'David Brown',
    email: 'david.brown@university.edu',
    status: 'inactive',
    isScholarship: false,
    attendancePercentage: 65,
    assignmentScore: 70
  },
  {
    name: 'Emma Davis',
    email: 'emma.davis@university.edu',
    status: 'active',
    isScholarship: true,
    attendancePercentage: 98,
    assignmentScore: 97
  },
  {
    name: 'Frank Miller',
    email: 'frank.miller@university.edu',
    status: 'suspended',
    isScholarship: false,
    attendancePercentage: 45,
    assignmentScore: 55
  },
  {
    name: 'Grace Wilson',
    email: 'grace.wilson@university.edu',
    status: 'active',
    isScholarship: false,
    attendancePercentage: 82,
    assignmentScore: 88
  },
  {
    name: 'Henry Moore',
    email: 'henry.moore@university.edu',
    status: 'graduated',
    isScholarship: true,
    attendancePercentage: 94,
    assignmentScore: 93
  },
  {
    name: 'Iris Taylor',
    email: 'iris.taylor@university.edu',
    status: 'active',
    isScholarship: false,
    attendancePercentage: 90,
    assignmentScore: 87
  },
  {
    name: 'Jack Anderson',
    email: 'jack.anderson@university.edu',
    status: 'active',
    isScholarship: true,
    attendancePercentage: 96,
    assignmentScore: 94
  },
  {
    name: 'Kate Thomas',
    email: 'kate.thomas@university.edu',
    status: 'active',
    isScholarship: false,
    attendancePercentage: 85,
    assignmentScore: 82
  },
  {
    name: 'Leo Jackson',
    email: 'leo.jackson@university.edu',
    status: 'inactive',
    isScholarship: false,
    attendancePercentage: 70,
    assignmentScore: 72
  },
  {
    name: 'Mia White',
    email: 'mia.white@university.edu',
    status: 'active',
    isScholarship: true,
    attendancePercentage: 93,
    assignmentScore: 91
  },
  {
    name: 'Noah Harris',
    email: 'noah.harris@university.edu',
    status: 'active',
    isScholarship: false,
    attendancePercentage: 87,
    assignmentScore: 89
  },
  {
    name: 'Olivia Martin',
    email: 'olivia.martin@university.edu',
    status: 'graduated',
    isScholarship: true,
    attendancePercentage: 97,
    assignmentScore: 96
  }
];

export const initializeDemoData = () => {
  if (storage.isDemoDataInitialized()) {
    return;
  }

  const now = new Date().toISOString();
  const students: Student[] = demoStudents.map(student => ({
    ...student,
    id: generateId(),
    gradePointAverage: calculateGPA(student.attendancePercentage, student.assignmentScore),
    createdAt: now,
    updatedAt: now
  }));

  storage.setStudents(students);
  storage.setDemoDataInitialized();
};
