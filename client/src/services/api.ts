import { storageService } from './storageService';
import { FacultyStatus, UserRole } from '@/types';

// Centralized API Layer
// This service acts as a bridge between the frontend and the data source.
// Currently it uses local storage (storageService), but it is structured to easily
// swap this out for real Axios/Fetch calls in the future.

export const api = {
    auth: {
        login: async (role: UserRole, id?: string) => {
            // Simulate network request
            await new Promise(resolve => setTimeout(resolve, 500));
            return { success: true, role, id };
        },
        logout: async () => {
            await new Promise(resolve => setTimeout(resolve, 200));
            return { success: true };
        }
    },

    faculty: {
        getAll: () => {
            return storageService.getFacultyList();
        },
        getById: (id: string) => {
            return storageService.getFacultyList().find(f => f.id === id);
        },
        updateStatus: async (id: string, status: FacultyStatus, nextSlot: string) => {
            // In a real app, this would be a PATCH request
            const list = storageService.getFacultyList();
            const updatedList = list.map(f => {
                if (f.id === id) return { ...f, status, nextAvailableSlot: nextSlot };
                return f;
            });
            storageService.saveFacultyList(updatedList);
            return { success: true };
        }
    },

    student: {
        getProfile: () => {
            return storageService.getProfile();
        },
        getNotifications: () => {
            return storageService.getStudentNotifications();
        }
    },

    broadcasts: {
        getAll: () => {
            return storageService.getBroadcasts();
        }
    }
};
