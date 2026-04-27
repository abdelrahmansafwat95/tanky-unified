import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getVehicles, createVehicle } from '../../api/vehicles';
import { getCompanies } from '../../api/companies';
import { Vehicle, Company } from '../../types';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function AdminVehicles() {
  const [vehicles, setVehicles]   = useState<Vehicle[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [showForm, setShowForm]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [form, setForm] = useState({ plate_number: '', model: '', year: '', fuel_type: 'petrol_92', daily_limit: '', monthly_limit: '', company_id: '' });

  const load = () => Promise.all([getVehicles(), getCompanies()]).then(([v, c]) => { setVehicles(v.data); setCompanies(c.data); });
  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      await createVehicle({ ...form, year: form.year ? Number(form.year) : undefined, daily_limit: Number(form.daily_limit) || 0, monthly_limit: Number(form.monthly_limit) || 0 });
      toast.success('Vehicle added'); setShowForm(false); load();
    } catch (err: any) { toast.error(err.response?.data?.message ?? 'Error'); }
    finally { setLoading(false); }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-semibold text-gray-900">Vehicles</h1><p className="text-sm text-gray-400 mt-1">{vehicles.length} registered</p></div>
        <Button onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : '+ Add vehicle'}</Button>
      </div>
      {showForm && (
        <Card>
          <h2 className="text-base font-semibold mb-4">Add vehicle</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-2 gap-4">
            <Input label="Plate number" value={form.plate_number} onChange={e => setForm({ ...form, plate_number: e.target.value })} required />
            <Input label="Model" value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} required />
            <Input label="Year" type="number" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} />
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600 font-medium">Fuel type</label>
              <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none" value={form.fuel_type} onChange={e => setForm({ ...form, fuel_type: e.target.value })}>
                <option value="petrol_80">Petrol 80</option><option value="petrol_92">Petrol 92</option><option value="petrol_95">Petrol 95</option><option value="diesel">Diesel</option><option value="natural_gas">Natural Gas</option>
              </select>
            </div>
            <Input label="Daily limit (L)" type="number" value={form.daily_limit} onChange={e => setForm({ ...form, daily_limit: e.target.value })} />
            <Input label="Monthly limit (L)" type="number" value={form.monthly_limit} onChange={e => setForm({ ...form, monthly_limit: e.target.value })} />
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600 font-medium">Company</label>
              <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none" value={form.company_id} onChange={e => setForm({ ...form, company_id: e.target.value })} required>
                <option value="">Select company</option>
                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="flex items-end"><Button type="submit" loading={loading} className="w-full">Add vehicle</Button></div>
          </form>
        </Card>
      )}
      <Card>
        <table className="w-full text-sm">
          <thead><tr className="text-left text-gray-400 border-b border-gray-100"><th className="pb-3 font-medium">Plate</th><th className="pb-3 font-medium">Model</th><th className="pb-3 font-medium">Fuel</th><th className="pb-3 font-medium">Daily limit</th><th className="pb-3 font-medium">Monthly limit</th><th className="pb-3 font-medium">Status</th></tr></thead>
          <tbody>
            {vehicles.map(v => (
              <tr key={v.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-3 font-medium text-gray-900">{v.plate_number}</td>
                <td className="py-3 text-gray-500">{v.model}{v.year ? ` (${v.year})` : ''}</td>
                <td className="py-3 text-gray-500 capitalize">{v.fuel_type?.replace('_', ' ')}</td>
                <td className="py-3 text-gray-500">{Number(v.daily_limit) > 0 ? `${v.daily_limit} L` : '—'}</td>
                <td className="py-3 text-gray-500">{Number(v.monthly_limit) > 0 ? `${v.monthly_limit} L` : '—'}</td>
                <td className="py-3"><Badge status={v.is_active ? 'active' : 'inactive'} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {vehicles.length === 0 && <p className="text-gray-400 text-sm text-center py-8">No vehicles yet</p>}
      </Card>
    </div>
  );
}
