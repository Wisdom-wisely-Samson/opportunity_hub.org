import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { userService } from '@/services/userService'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref([])
  const unreadCount = ref(0)
  const isLoading = ref(false)

  const hasUnread = computed(() => unreadCount.value > 0)

  const fetchNotifications = async () => {
    isLoading.value = true
    try {
      const { data } = await userService.getNotifications()
      notifications.value = data.data
      unreadCount.value = data.meta?.unreadCount || 0
    } finally {
      isLoading.value = false
    }
  }

  const markAsRead = async (id) => {
    await userService.markNotificationRead(id)
    const n = notifications.value.find(n => n._id === id)
    if (n && !n.isRead) { n.isRead = true; unreadCount.value = Math.max(0, unreadCount.value - 1) }
  }

  const markAllAsRead = async () => {
    await userService.markAllNotificationsRead()
    notifications.value.forEach(n => { n.isRead = true })
    unreadCount.value = 0
  }

  return { notifications, unreadCount, hasUnread, isLoading, fetchNotifications, markAsRead, markAllAsRead }
})
