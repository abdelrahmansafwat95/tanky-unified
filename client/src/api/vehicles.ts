import api from './client';
export const getVehicles        = () => api.get('/vehicles');
export const getCompanyVehicles = (company_id: string) => api.get(`/vehicles/company/${company_id}`);
export const createVehicle      = (data: any) => api.post('/vehicles', data);
