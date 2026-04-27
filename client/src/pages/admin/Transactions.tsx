import { useEffect, useState } from 'react';
import { getAllTransactions } from '../../api/transactions';
import { Transaction } from '../../types';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { getAllTransactions().then(r => setTransactions(r.data)).finally(() => setLoading(false)); }, []);
  if (loading) return <p className="text-gray-400">Loading...</p>;

  return (
    <div className="flex flex-col gap-6">
      <div><h1 className="text-2xl font-semibold text-gray-900">All Transactions</h1><p className="text-sm text-gray-400 mt-1">{transactions.length} total</p></div>
      <Card>
        <table className="w-full text-sm">
          <thead><tr className="text-left text-gray-400 border-b border-gray-100"><th className="pb-3 font-medium">Driver</th><th className="pb-3 font-medium">Plate</th><th className="pb-3 font-medium">Station</th><th className="pb-3 font-medium">Liters</th><th className="pb-3 font-medium">EGP</th><th className="pb-3 font-medium">Status</th><th className="pb-3 font-medium">Date</th></tr></thead>
          <tbody>
            {transactions.map(t => (
              <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-2.5 text-gray-700">{t.driver?.user?.full_name ?? '—'}</td>
                <td className="py-2.5 text-gray-500">{t.vehicle?.plate_number ?? '—'}</td>
                <td className="py-2.5 text-gray-500">{t.station?.name ?? '—'}</td>
                <td className="py-2.5">{t.amount_liters ?? '—'} L</td>
                <td className="py-2.5 font-medium">{t.amount_egp ? `${Number(t.amount_egp).toLocaleString()} ج.م` : '—'}</td>
                <td className="py-2.5"><Badge status={t.status} /></td>
                <td className="py-2.5 text-gray-400 text-xs">{new Date(t.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {transactions.length === 0 && <p className="text-gray-400 text-sm text-center py-8">No transactions yet</p>}
      </Card>
    </div>
  );
}
