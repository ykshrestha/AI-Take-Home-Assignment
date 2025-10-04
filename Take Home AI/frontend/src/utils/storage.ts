import { Student } from '../types';

const STORAGE_KEYS = {
  STUDENTS: 'ai_campus_students',
  USER: 'ai_campus_user',
  DEMO_DATA_INITIALIZED: 'ai_campus_demo_initialized'
};

export const storage = {
  getStudents: (): Student[] => {
    const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return data ? JSON.parse(data) : [];
  },

  setStudents: (students: Student[]): void => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  },

  getUser: () => {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  },

  setUser: (user: any): void => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  clearUser: (): void => {
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  isDemoDataInitialized: (): boolean => {
    return localStorage.getItem(STORAGE_KEYS.DEMO_DATA_INITIALIZED) === 'true';
  },

  setDemoDataInitialized: (): void => {
    localStorage.setItem(STORAGE_KEYS.DEMO_DATA_INITIALIZED, 'true');
  }
};

export const calculateGPA = (attendance: number, assignmentScore: number): number => {
  return Number(((attendance * 0.4) + (assignmentScore * 0.6)).toFixed(2));
};
