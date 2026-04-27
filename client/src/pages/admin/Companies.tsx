import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getCompanies, createCompany, topUpWallet } from '../../api/companies';
import { Company } from '../../types';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function Companies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [showForm,  setShowForm]  = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [form, setForm] = useState({ name: '', commercial_register: '', phone: '', email: '', subscription_plan: 'basic' });

  const load = () => getCompanies().then(r => setCompanies(r.data));
  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try { await createCompany(form); toast.success('Company created'); setShowForm(false); setForm({ name: '', commercial_register: '', phone: '', email: '', subscription_plan: 'basic' }); load(); }
    catch (err: any) { toast.error(err.response?.data?.message ?? 'Error'); }
    finally { setLoading(false); }
  };

  const handleTopUp = async (id: string) => {
    const amount = prompt('Top-up amount (EGP):');
    if (!amount || isNaN(Number(amount))) return;
    try { await topUpWallet(id, Number(amount)); toast.success('Topped up'); load(); }
    catch { toast.error('Failed'); }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-semibold text-gray-900">Companies</h1><p className="text-sm text-gray-400 mt-1">{companies.length} registered</p></div>
        <Button onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : '+ New company'}</Button>
      </div>
      {showForm && (
        <Card>
          <h2 className="text-base font-semibold mb-4">New company</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-2 gap-4">
            <Input label="Company name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            <Input label="Commercial register" value={form.commercial_register} onChange={e => setForm({ ...form, commercial_register: e.target.value })} required />
            <Input label="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
            <Input label="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600 font-medium">Plan</label>
              <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none" value={form.subscription_plan} onChange={e => setForm({ ...form, subscription_plan: e.target.value })}>
                <option value="basic">Basic</option><option value="professional">Professional</option><option value="enterprise">Enterprise</option>
              </select>
            </div>
            <div className="flex items-end"><Button type="submit" loading={loading} className="w-full">Create</Button></div>
          </form>
        </Card>
      )}
      <Card>
        <table className="w-full text-sm">
          <thead><tr className="text-left text-gray-400 border-b border-gray-100"><th className="pb-3 font-medium">Company</th><th className="pb-3 font-medium">Phone</th><th className="pb-3 font-medium">Plan</th><th className="pb-3 font-medium">Wallet</th><th className="pb-3 font-medium">Status</th><th className="pb-3 font-medium">Actions</th></tr></thead>
          <tbody>
            {companies.map(c => (
              <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-3 font-medium text-gray-900">{c.name}</td>
                <td className="py-3 text-gray-500">{c.phone}</td>
                <td className="py-3 capitalize text-gray-500">{c.subscription_plan}</td>
                <td className="py-3 font-semibold text-green-600">{Number(c.wallet_balance).toLocaleString()} ج.م</td>
                <td className="py-3"><Badge status={c.is_active ? 'active' : 'inactive'} /></td>
                <td className="py-3"><Button variant="outline" onClick={() => handleTopUp(c.id)} className="text-xs py-1">Top up</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {companies.length === 0 && <p className="text-gray-400 text-sm text-center py-8">No companies yet</p>}
      </Card>
    </div>
  );
}
