import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getCompanyStats, getCompanyTransactions } from '../../api/transactions';
import { getCompanyVehicles } from '../../api/vehicles';
import { Transaction, Vehicle, CompanyStats } from '../../types';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

export default function CompanyDashboard() {
  const [stats,        setStats]        = useState<CompanyStats | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [vehicles,     setVehicles]     = useState<Vehicle[]>([]);
  const [loading,      setLoading]      = useState(true);
  const companyId = localStorage.getItem('tanky_company_id') ?? '';

  useEffect(() => {
    if (!companyId) { setLoading(false); return; }
    Promise.all([getCompanyStats(companyId), getCompanyTransactions(companyId), getCompanyVehicles(companyId)])
      .then(([s, t, v]) => { setStats(s.data); setTransactions(t.data); setVehicles(v.data); })
      .finally(() => setLoading(false));
  }, [companyId]);

  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const label = d.toLocaleDateString('en', { weekday: 'short' });
    const liters = transactions.filter(t => t.status === 'completed' && new Date(t.created_at).toDateString() === d.toDateString()).reduce((s, t) => s + Number(t.amount_liters), 0);
    return { day: label, liters: Math.round(liters * 10) / 10 };
  });

  if (loading) return <p className="text-gray-400">Loading...</p>;
  if (!companyId) return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-gray-900">Company Dashboard</h1>
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-700">
        Open browser console (F12) and run:<br />
        <code className="bg-yellow-100 px-1 rounded">localStorage.setItem('tanky_company_id', 'YOUR_COMPANY_ID')</code><br />
        then refresh the page.
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <div><h1 className="text-2xl font-semibold text-gray-900">Company Dashboard</h1><p className="text-sm text-gray-400 mt-1">This month</p></div>
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Transactions this month" value={stats?.this_month_transactions ?? 0} />
        <StatCard label="Liters this month"        value={`${stats?.this_month_liters ?? 0} L`} color="text-green-600" />
        <StatCard label="Spent (EGP)"              value={`${Number(stats?.this_month_egp ?? 0).toLocaleString()} ج.م`} />
      </div>
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <h2 className="text-base font-semibold text-gray-900 mb-4">Fuel usage — last 7 days</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => [`${v} L`, 'Liters']} />
              <Bar dataKey="liters" fill="#16a34a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <h2 className="text-base font-semibold text-gray-900 mb-4">Fleet ({vehicles.length} vehicles)</h2>
          <div className="flex flex-col gap-2">
            {vehicles.slice(0, 6).map(v => (
              <div key={v.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div><p className="text-sm font-medium text-gray-900">{v.plate_number}</p><p className="text-xs text-gray-400">{v.model} · {v.fuel_type}</p></div>
                <Badge status={v.is_active ? 'active' : 'inactive'} />
              </div>
            ))}
            {vehicles.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No vehicles</p>}
          </div>
        </Card>
      </div>
      <Card>
        <h2 className="text-base font-semibold text-gray-900 mb-4">Recent transactions</h2>
        <table className="w-full text-sm">
          <thead><tr className="text-left text-gray-400 border-b border-gray-100"><th className="pb-3 font-medium">Driver</th><th className="pb-3 font-medium">Plate</th><th className="pb-3 font-medium">Liters</th><th className="pb-3 font-medium">EGP</th><th className="pb-3 font-medium">Status</th></tr></thead>
          <tbody>
            {transactions.slice(0, 8).map(t => (
              <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-2.5 text-gray-700">{t.driver?.user?.full_name ?? '—'}</td>
                <td className="py-2.5 text-gray-500">{t.vehicle?.plate_number ?? '—'}</td>
                <td className="py-2.5">{t.amount_liters ?? '—'} L</td>
                <td className="py-2.5 font-medium">{t.amount_egp ? `${Number(t.amount_egp).toLocaleString()} ج.م` : '—'}</td>
                <td className="py-2.5"><Badge status={t.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {transactions.length === 0 && <p className="text-sm text-gray-400 text-center py-6">No transactions yet</p>}
      </Card>
    </div>
  );
}
