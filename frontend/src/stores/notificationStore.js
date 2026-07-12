import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { notificationService } from "@/services/notificationService";

export const useNotificationStore = defineStore("notification", () => {
  const notifications = ref([]);
  const unreadCount = ref(0);
  const isLoading = ref(false);

  const hasUnread = computed(() => unreadCount.value > 0);

  // Fetch notifications (with pagination/unread filter support)
  const fetchNotifications = async (params = {}) => {
    isLoading.value = true;
    try {
      const { data } = await notificationService.getNotifications(params);
      notifications.value = data.data;
      unreadCount.value = data.meta?.unreadCount || 0;
    } finally {
      isLoading.value = false;
    }
  };

  // Mark single notification as read
  const markAsRead = async (id) => {
    await notificationService.markNotificationRead(id);
    const n = notifications.value.find((n) => n._id === id);
    if (n && !n.isRead) {
      n.isRead = true;
      unreadCount.value = Math.max(0, unreadCount.value - 1);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    await notificationService.markAllNotificationsRead();
    notifications.value.forEach((n) => {
      n.isRead = true;
    });
    unreadCount.value = 0;
  };

  // Delete a notification
  const deleteNotification = async (id) => {
    await notificationService.deleteNotification(id);
    notifications.value = notifications.value.filter((n) => n._id !== id);
    unreadCount.value = notifications.value.filter((n) => !n.isRead).length;
  };

  return {
    notifications,
    unreadCount,
    hasUnread,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
});
