import { useEffect, useState } from 'react';
import { getCompanies } from '../../api/companies';
import { getAllTransactions } from '../../api/transactions';
import { Company, Transaction } from '../../types';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

export default function AdminDashboard() {
  const [companies,    setCompanies]    = useState<Company[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    Promise.all([getCompanies(), getAllTransactions()])
      .then(([c, t]) => { setCompanies(c.data); setTransactions(t.data); })
      .finally(() => setLoading(false));
  }, []);

  const totalWallet    = companies.reduce((s, c) => s + Number(c.wallet_balance), 0);
  const completedToday = transactions.filter(t => t.status === 'completed' && new Date(t.created_at).toDateString() === new Date().toDateString()).length;

  if (loading) return <p className="text-gray-400">Loading...</p>;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Platform Overview</h1>
        <p className="text-sm text-gray-400 mt-1">All companies and live activity</p>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Total companies"    value={companies.length} />
        <StatCard label="Active companies"   value={companies.filter(c => c.is_active).length} />
        <StatCard label="Total wallet (EGP)" value={`${totalWallet.toLocaleString()} ج.م`} color="text-green-600" />
        <StatCard label="Transactions today" value={completedToday} sub="completed" />
      </div>
      <Card>
        <h2 className="text-base font-semibold text-gray-900 mb-4">Latest transactions</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b border-gray-100">
              <th className="pb-3 font-medium">Driver</th>
              <th className="pb-3 font-medium">Vehicle</th>
              <th className="pb-3 font-medium">Liters</th>
              <th className="pb-3 font-medium">EGP</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Time</th>
            </tr>
          </thead>
          <tbody>
            {transactions.slice(0, 10).map(t => (
              <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-3 text-gray-700">{t.driver?.user?.full_name ?? '—'}</td>
                <td className="py-3 text-gray-500">{t.vehicle?.plate_number ?? '—'}</td>
                <td className="py-3">{t.amount_liters ?? '—'} L</td>
                <td className="py-3 font-medium">{t.amount_egp ? `${Number(t.amount_egp).toLocaleString()} ج.م` : '—'}</td>
                <td className="py-3"><Badge status={t.status} /></td>
                <td className="py-3 text-gray-400 text-xs">{new Date(t.created_at).toLocaleTimeString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {transactions.length === 0 && <p className="text-gray-400 text-sm text-center py-8">No transactions yet</p>}
      </Card>
    </div>
  );
}
