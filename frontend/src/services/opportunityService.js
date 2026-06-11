import api from './api'

export const opportunityService = {
  getOpportunities: (params) => api.get('/opportunities', { params }),
  getOpportunityById: (id) => api.get(`/opportunities/${id}`),
  getFeatured: () => api.get('/opportunities/featured'),
  getCategoryStats: () => api.get('/opportunities/categories/stats'),
  createOpportunity: (data) => api.post('/opportunities', data),
  updateOpportunity: (id, data) => api.put(`/opportunities/${id}`, data),
  deleteOpportunity: (id) => api.delete(`/opportunities/${id}`),
  getMyOpportunities: (params) => api.get('/organizations/my-opportunities', { params }),
}
