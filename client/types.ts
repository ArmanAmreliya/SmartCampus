
export enum FacultyStatus {
  AVAILABLE = 'Available',
  BUSY = 'Busy',
  NOT_AVAILABLE = 'Not Available',
}

export interface TimeSlot {
  id: string;
  start: string;
  end: string;
}

export interface DaySchedule {
  day: string; // 'SUN', 'MON', 'TUE', etc.
  isEnabled: boolean;
  slots: TimeSlot[];
}

export interface Experience {
  role: string;
  years: string;
  institution: string;
}

export interface Publication {
  title: string;
  isbn?: string;
  date: string;
}

export interface Faculty {
  id: string;
  name: string;
  department: string;
  position: string;
  status: FacultyStatus;
  nextAvailableSlot?: string;
  image: string;
  email: string;
  schedule?: DaySchedule[];
  // New Profile Fields
  bio?: string;
  researchInterests?: string[];
  education?: string;
  experience?: Experience[];
  publications?: Publication[];
}

export interface BroadcastMessage {
  id: string;
  facultyId: string;
  facultyName: string;
  message: string;
  timestamp: string;
  department?: string; // If null, global
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface Appointment {
  id: string;
  facultyId: string;
  facultyName: string;
  facultyImage: string;
  date: Date;
  time: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  purpose: string;
}

export interface StudentProfile {
  name: string;
  email: string;
  enrollmentNo: string;
  department: string;
  semester: number;
  phone: string;
  avatar: string;
}

export interface LeaveRequest {
  id: string;
  type: 'Medical' | 'Personal' | 'Academic' | 'Other';
  startDate: Date;
  endDate: Date;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  timestamp: number;
}

// New Types for Notification System
export interface NotificationRequest {
  id: string;
  studentId: string;
  facultyId: string;
  facultyName: string;
  timestamp: number;
}

export interface StudentNotification {
  id: string;
  title: string;
  message: string;
  type: 'AVAILABILITY' | 'SYSTEM' | 'APPOINTMENT';
  timestamp: number;
  isRead: boolean;
  facultyImage?: string;
}

export enum UserRole {
  STUDENT = 'STUDENT',
  FACULTY = 'FACULTY',
}

export enum AppView {
  LANDING = 'LANDING',
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
}

export enum DashboardView {
  OVERVIEW = 'OVERVIEW',
  FACULTY_LIST = 'FACULTY_LIST',
  APPOINTMENTS = 'APPOINTMENTS',
  PROFILE = 'PROFILE',
  LEAVE_REQUEST = 'LEAVE_REQUEST',
  CHATBOT = 'CHATBOT',
  BROADCASTS = 'BROADCASTS',
  FACULTY_PROFILE = 'FACULTY_PROFILE',
  NOTIFICATIONS = 'NOTIFICATIONS', // New View
}
