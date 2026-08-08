import api from './api';

export const siteService = {
  recordVisit: () => api.post('/site/visit'),
  getMetrics: () => api.get('/site/metrics'),
};
