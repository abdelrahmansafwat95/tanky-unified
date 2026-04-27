import api from './client';
export const getCompanies  = () => api.get('/companies');
export const getCompany    = (id: string) => api.get(`/companies/${id}`);
export const createCompany = (data: any) => api.post('/companies', data);
export const topUpWallet   = (id: string, amount: number) => api.patch(`/companies/${id}/top-up`, { amount });
