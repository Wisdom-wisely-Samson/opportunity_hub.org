import api from './api'

export const adminService = {
  getDashboard: () => api.get('/admin/dashboard'),
  getReports: () => api.get('/admin/reports'),
  getUsers: (params) => api.get('/admin/users', { params }),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getOrganizations: (params) => api.get('/admin/organizations', { params }),
  verifyOrganization: (id, action) => api.put(`/admin/organizations/${id}/verify`, { action }),
  getOpportunities: (params) => api.get('/admin/opportunities', { params }),
  updateOpportunityStatus: (id, status) => api.put(`/admin/opportunities/${id}/status`, { status }),
  deleteOpportunity: (id) => api.delete(`/admin/opportunities/${id}`),
}
