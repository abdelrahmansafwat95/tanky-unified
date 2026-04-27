import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { login } from '../../api/auth';
import { setAuth } from '../../store/auth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function Login() {
  const navigate = useNavigate();
  const [phone, setPhone]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await login(phone, password);
      setAuth(data.access_token, data.user);
      toast.success(`Welcome, ${data.user.full_name}`);
      if (data.user.role === 'platform_admin') navigate('/admin');
      else if (data.user.role === 'company_admin') navigate('/company');
      else toast.error('This portal is for admins only');
    } catch {
      toast.error('Invalid phone or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 w-full max-w-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center text-white font-bold text-xl">T</div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Tanky</h1>
            <p className="text-xs text-gray-400">Fuel Management System</p>
          </div>
        </div>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <Input label="Phone number" type="tel" placeholder="01012345678" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button type="submit" loading={loading} className="w-full mt-2">Sign in</Button>
        </form>
      </div>
    </div>
  );
}
