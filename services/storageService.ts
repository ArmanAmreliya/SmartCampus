
import { Appointment, StudentProfile, LeaveRequest, Faculty, BroadcastMessage, NotificationRequest, StudentNotification } from '../types';
import { DEFAULT_STUDENT_PROFILE, INITIAL_APPOINTMENTS, INITIAL_FACULTY, INITIAL_BROADCASTS } from '../constants';

const KEYS = {
  APPOINTMENTS: 'ldce_appointments',
  PROFILE: 'ldce_student_profile',
  LEAVE_REQUESTS: 'ldce_leave_requests',
  FACULTY_LIST: 'ldce_faculty_list',
  BROADCASTS: 'ldce_broadcasts',
  NOTIF_REQUESTS: 'ldce_notification_requests',
  NOTIFICATIONS: 'ldce_student_notifications'
};

// Helper to trigger custom event for same-tab updates
const triggerUpdate = () => {
  window.dispatchEvent(new Event('local-storage-update'));
};

export const storageService = {
  // --- Appointments CRUD ---
  getAppointments: (): Appointment[] => {
    try {
      const data = localStorage.getItem(KEYS.APPOINTMENTS);
      return data ? JSON.parse(data) : INITIAL_APPOINTMENTS;
    } catch (e) {
      console.error('Error loading appointments', e);
      return [];
    }
  },

  saveAppointments: (appointments: Appointment[]) => {
    localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(appointments));
    triggerUpdate();
  },

  deleteAppointment: (id: string) => {
    const list = storageService.getAppointments();
    const filtered = list.filter(a => a.id !== id);
    localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(filtered));
    triggerUpdate();
    return filtered;
  },

  updateAppointment: (updated: Appointment) => {
    const list = storageService.getAppointments();
    const index = list.findIndex(a => a.id === updated.id);
    if (index !== -1) {
      list[index] = updated;
      localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(list));
      triggerUpdate();
    }
    return list;
  },

  // --- Profile CRUD ---
  getProfile: (): StudentProfile => {
    try {
      const data = localStorage.getItem(KEYS.PROFILE);
      return data ? JSON.parse(data) : DEFAULT_STUDENT_PROFILE;
    } catch (e) {
      console.error('Error loading profile', e);
      return DEFAULT_STUDENT_PROFILE;
    }
  },

  saveProfile: (profile: StudentProfile) => {
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
    triggerUpdate();
  },

  // --- Leave Requests CRUD ---
  getLeaveRequests: (): LeaveRequest[] => {
    try {
      const data = localStorage.getItem(KEYS.LEAVE_REQUESTS);
      const parsed = data ? JSON.parse(data) : [];
      return parsed.map((req: any) => ({
        ...req,
        startDate: new Date(req.startDate),
        endDate: new Date(req.endDate)
      }));
    } catch (e) {
      console.error('Error loading leave requests', e);
      return [];
    }
  },

  saveLeaveRequests: (requests: LeaveRequest[]) => {
    localStorage.setItem(KEYS.LEAVE_REQUESTS, JSON.stringify(requests));
    triggerUpdate();
  },

  deleteLeaveRequest: (id: string) => {
    const list = storageService.getLeaveRequests();
    const filtered = list.filter(r => r.id !== id);
    localStorage.setItem(KEYS.LEAVE_REQUESTS, JSON.stringify(filtered));
    triggerUpdate();
    return filtered;
  },

  // --- Faculty List CRUD ---
  getFacultyList: (): Faculty[] => {
    try {
      const data = localStorage.getItem(KEYS.FACULTY_LIST);
      return data ? JSON.parse(data) : INITIAL_FACULTY;
    } catch (e) {
      console.error('Error loading faculty list', e);
      return INITIAL_FACULTY;
    }
  },

  saveFacultyList: (list: Faculty[]) => {
    localStorage.setItem(KEYS.FACULTY_LIST, JSON.stringify(list));
    triggerUpdate();
  },

  updateFaculty: (updated: Faculty) => {
    const list = storageService.getFacultyList();
    const index = list.findIndex(f => f.id === updated.id);
    if (index !== -1) {
      list[index] = updated;
      localStorage.setItem(KEYS.FACULTY_LIST, JSON.stringify(list));
      triggerUpdate();
    }
    return list;
  },

  // --- Broadcasts CRUD ---
  getBroadcasts: (): BroadcastMessage[] => {
    try {
      const data = localStorage.getItem(KEYS.BROADCASTS);
      return data ? JSON.parse(data) : INITIAL_BROADCASTS;
    } catch (e) {
      console.error('Error loading broadcasts', e);
      return INITIAL_BROADCASTS;
    }
  },

  saveBroadcasts: (broadcasts: BroadcastMessage[]) => {
    localStorage.setItem(KEYS.BROADCASTS, JSON.stringify(broadcasts));
    triggerUpdate();
  },

  deleteBroadcast: (id: string) => {
    const list = storageService.getBroadcasts();
    const filtered = list.filter(b => b.id !== id);
    localStorage.setItem(KEYS.BROADCASTS, JSON.stringify(filtered));
    triggerUpdate();
    return filtered;
  },

  // --- Notification Requests (Pending) ---
  getNotificationRequests: (): NotificationRequest[] => {
    try {
      const data = localStorage.getItem(KEYS.NOTIF_REQUESTS);
      return data ? JSON.parse(data) : [];
    } catch { return []; }
  },

  saveNotificationRequest: (request: NotificationRequest) => {
    const list = storageService.getNotificationRequests();
    // Prevent duplicate requests for same faculty
    if (!list.find(r => r.facultyId === request.facultyId && r.studentId === request.studentId)) {
      list.push(request);
      localStorage.setItem(KEYS.NOTIF_REQUESTS, JSON.stringify(list));
      triggerUpdate();
    }
  },

  removeNotificationRequests: (facultyId: string) => {
    const list = storageService.getNotificationRequests();
    const filtered = list.filter(r => r.facultyId !== facultyId);
    localStorage.setItem(KEYS.NOTIF_REQUESTS, JSON.stringify(filtered));
    triggerUpdate();
  },

  // --- Student Notifications (Inbox) ---
  getStudentNotifications: (): StudentNotification[] => {
    try {
      const data = localStorage.getItem(KEYS.NOTIFICATIONS);
      return data ? JSON.parse(data) : [];
    } catch { return []; }
  },

  addStudentNotification: (notification: StudentNotification) => {
    const list = storageService.getStudentNotifications();
    list.unshift(notification); // Add to top
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(list));
    triggerUpdate();
  },

  markNotificationsRead: () => {
    const list = storageService.getStudentNotifications();
    const updated = list.map(n => ({ ...n, isRead: true }));
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(updated));
    triggerUpdate();
  }
};
