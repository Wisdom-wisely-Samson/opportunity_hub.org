import api from './api'

export const organizationService = {
  getAll: (params) => api.get('/organizations', { params }),
  getById: (id) => api.get(`/organizations/${id}`),
  getMyProfile: () => api.get('/organizations/my/profile'),
  getDashboard: () => api.get('/organizations/my/dashboard'),
  createProfile: (data) => api.post('/organizations/profile', data),
  updateProfile: (data) => api.put('/organizations/profile', data),
  uploadLogo: (formData) => api.post('/organizations/upload-logo', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
}
