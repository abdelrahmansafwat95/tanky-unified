import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/client';
import { Station } from '../../types';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function Stations() {
  const [stations, setStations] = useState<Station[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [form, setForm] = useState({ name: '', address: '', phone: '', latitude: '', longitude: '', allowed_radius_meters: '300' });

  const load = () => api.get('/stations').then(r => setStations(r.data));
  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      await api.post('/stations', { ...form, latitude: form.latitude ? Number(form.latitude) : undefined, longitude: form.longitude ? Number(form.longitude) : undefined, allowed_radius_meters: Number(form.allowed_radius_meters) });
      toast.success('Station created'); setShowForm(false); setForm({ name: '', address: '', phone: '', latitude: '', longitude: '', allowed_radius_meters: '300' }); load();
    } catch (err: any) { toast.error(err.response?.data?.message ?? 'Error'); }
    finally { setLoading(false); }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-semibold text-gray-900">Stations</h1><p className="text-sm text-gray-400 mt-1">{stations.length} registered</p></div>
        <Button onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : '+ New station'}</Button>
      </div>
      {showForm && (
        <Card>
          <h2 className="text-base font-semibold mb-4">New station</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-2 gap-4">
            <Input label="Station name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            <Input label="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
            <Input label="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required />
            <Input label="Radius (meters)" type="number" value={form.allowed_radius_meters} onChange={e => setForm({ ...form, allowed_radius_meters: e.target.value })} />
            <Input label="Latitude (optional)" type="number" value={form.latitude} onChange={e => setForm({ ...form, latitude: e.target.value })} />
            <Input label="Longitude (optional)" type="number" value={form.longitude} onChange={e => setForm({ ...form, longitude: e.target.value })} />
            <div className="col-span-2"><Button type="submit" loading={loading}>Create station</Button></div>
          </form>
        </Card>
      )}
      <Card>
        <table className="w-full text-sm">
          <thead><tr className="text-left text-gray-400 border-b border-gray-100"><th className="pb-3 font-medium">Name</th><th className="pb-3 font-medium">Address</th><th className="pb-3 font-medium">Phone</th><th className="pb-3 font-medium">Radius</th><th className="pb-3 font-medium">Status</th></tr></thead>
          <tbody>
            {stations.map(s => (
              <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-3 font-medium text-gray-900">{s.name}</td>
                <td className="py-3 text-gray-500">{s.address}</td>
                <td className="py-3 text-gray-500">{s.phone}</td>
                <td className="py-3 text-gray-500">{s.allowed_radius_meters}m</td>
                <td className="py-3"><Badge status={s.is_active ? 'active' : 'inactive'} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {stations.length === 0 && <p className="text-gray-400 text-sm text-center py-8">No stations yet</p>}
      </Card>
    </div>
  );
}
