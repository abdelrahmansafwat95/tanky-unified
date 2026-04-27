export interface User { id: string; full_name: string; phone: string; role: 'platform_admin' | 'company_admin' | 'driver' | 'station_user'; }
export interface Company { id: string; name: string; commercial_register: string; phone: string; email?: string; subscription_plan: string; wallet_balance: number; is_active: boolean; created_at: string; }
export interface Vehicle { id: string; plate_number: string; model: string; year: number; fuel_type: string; daily_limit: number; monthly_limit: number; is_active: boolean; company_id: string; }
export interface Driver { id: string; user: User; vehicle: Vehicle; company_id: string; is_active: boolean; }
export interface Station { id: string; name: string; address: string; phone: string; latitude: number; longitude: number; is_active: boolean; allowed_radius_meters: number; }
export interface Transaction { id: string; qr_token: string; driver: Driver; vehicle: Vehicle; station: Station; amount_liters: number; amount_egp: number; price_per_liter: number; status: 'pending' | 'completed' | 'rejected' | 'expired'; rejection_reason?: string; created_at: string; completed_at?: string; }
export interface CompanyStats { this_month_transactions: number; this_month_liters: number; this_month_egp: number; }
