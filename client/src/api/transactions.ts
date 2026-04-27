import api from './client';
export const getAllTransactions      = () => api.get('/transactions');
export const getCompanyTransactions = (id: string) => api.get(`/transactions/company/${id}`);
export const getCompanyStats        = (id: string) => api.get(`/transactions/company/${id}/stats`);
