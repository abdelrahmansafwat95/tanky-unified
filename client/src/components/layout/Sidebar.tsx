import { NavLink, useNavigate } from 'react-router-dom';
import { clearAuth, getUser } from '../../store/auth';

const adminLinks = [
  { to: '/admin',               label: 'Dashboard',     icon: '◈' },
  { to: '/admin/companies',     label: 'Companies',     icon: '🏢' },
  { to: '/admin/vehicles',      label: 'Vehicles',      icon: '🚗' },
  { to: '/admin/stations',      label: 'Stations',      icon: '⛽' },
  { to: '/admin/transactions',  label: 'Transactions',  icon: '📋' },
];

const companyLinks = [
  { to: '/company',               label: 'Dashboard',    icon: '◈' },
  { to: '/company/vehicles',      label: 'Vehicles',     icon: '🚗' },
  { to: '/company/drivers',       label: 'Drivers',      icon: '👤' },
  { to: '/company/transactions',  label: 'Transactions', icon: '📋' },
];

export default function Sidebar() {
  const user     = getUser();
  const navigate = useNavigate();
  const links    = user?.role === 'platform_admin' ? adminLinks : companyLinks;

  return (
    <aside className="w-60 min-h-screen bg-white border-r border-gray-100 flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-green-600 flex items-center justify-center text-white font-bold text-lg">T</div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">Tanky</p>
            <p className="text-xs text-gray-400 capitalize">{user?.role?.replace(/_/g, ' ')}</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 flex flex-col gap-1">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} end={link.to === '/admin' || link.to === '/company'}
            className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${isActive ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>
            <span>{link.icon}</span>{link.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-100">
        <div className="px-3 py-2 mb-2">
          <p className="text-sm font-medium text-gray-900">{user?.full_name}</p>
          <p className="text-xs text-gray-400">{user?.phone}</p>
        </div>
        <button onClick={() => { clearAuth(); navigate('/login'); }}
          className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer">
          Logout
        </button>
      </div>
    </aside>
  );
}
