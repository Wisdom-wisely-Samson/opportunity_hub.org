import api from "./api"; // axios instance with baseURL + auth headers

export const notificationService = {
  // Get notifications (supports pagination + unread filter)
  getNotifications: (params) => api.get("/notifications", { params }),

  // Mark a single notification as read
  markNotificationRead: (id) => api.put(`/notifications/${id}/read`),

  // Mark all notifications as read
  markAllNotificationsRead: () => api.put("/notifications/read-all"),

  // Delete a notification
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
};
