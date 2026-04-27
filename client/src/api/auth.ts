import api from './client';
export const login = (phone: string, password: string) => api.post('/auth/login', { phone, password });
export const getMe = () => api.get('/auth/me');
