import { User } from '../types';
export const getToken = (): string | null => localStorage.getItem('tanky_token');
export const getUser = (): User | null => { const u = localStorage.getItem('tanky_user'); return u ? JSON.parse(u) : null; };
export const setAuth = (token: string, user: User) => { localStorage.setItem('tanky_token', token); localStorage.setItem('tanky_user', JSON.stringify(user)); };
export const clearAuth = () => { localStorage.removeItem('tanky_token'); localStorage.removeItem('tanky_user'); localStorage.removeItem('tanky_company_id'); };
