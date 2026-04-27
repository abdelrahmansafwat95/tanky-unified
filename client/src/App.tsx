import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { getToken, getUser } from './store/auth';
import DashboardLayout from './components/layout/DashboardLayout';
import Login from './pages/auth/Login';
import AdminDashboard from './pages/admin/Dashboard';
import Companies from './pages/admin/Companies';
import AdminVehicles from './pages/admin/Vehicles';
import Stations from './pages/admin/Stations';
import AdminTransactions from './pages/admin/Transactions';
import CompanyDashboard from './pages/company/Dashboard';

function RequireAuth({ children, role }: { children: JSX.Element; role?: string }) {
  const token = getToken();
  const user  = getUser();
  if (!token) return <Navigate to="/login" replace />;
  if (role && user?.role !== role) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<RequireAuth role="platform_admin"><DashboardLayout /></RequireAuth>}>
          <Route index             element={<AdminDashboard />} />
          <Route path="companies"   element={<Companies />} />
          <Route path="vehicles"    element={<AdminVehicles />} />
          <Route path="stations"    element={<Stations />} />
          <Route path="transactions" element={<AdminTransactions />} />
        </Route>
        <Route path="/company" element={<RequireAuth role="company_admin"><DashboardLayout /></RequireAuth>}>
          <Route index element={<CompanyDashboard />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
