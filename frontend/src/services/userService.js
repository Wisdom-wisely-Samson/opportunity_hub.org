import api from './api'

export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  uploadAvatar: (formData) => api.post('/users/upload-avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  uploadCV: (formData) => api.post('/users/upload-cv', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteCV: () => api.delete('/users/cv'),
  changePassword: (data) => api.put('/users/change-password', data),
  deleteAccount: () => api.delete('/users/account'),
  getSavedOpportunities: (params) => api.get('/users/saved-opportunities', { params }),
  saveOpportunity: (id) => api.post(`/users/saved-opportunities/${id}`),
  unsaveOpportunity: (id) => api.delete(`/users/saved-opportunities/${id}`),
  getNotifications: (params) => api.get('/users/notifications', { params }),
  markNotificationRead: (id) => api.put(`/users/notifications/${id}/read`),
  markAllNotificationsRead: () => api.put('/users/notifications/read-all'),
}
