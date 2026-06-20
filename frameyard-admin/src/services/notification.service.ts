import { Notification } from '../types';

export const notificationService = {
  getNotifications: async (): Promise<Notification[]> => {
    return [];
  },

  markAllRead: async (): Promise<Notification[]> => {
    return [];
  },

  toggleRead: async (id: string): Promise<Notification> => {
    throw new Error(`Notifications API is not available for ${id}`);
  },

  deleteNotification: async (id: string): Promise<{ success: boolean }> => {
    return { success: true };
  },
};
