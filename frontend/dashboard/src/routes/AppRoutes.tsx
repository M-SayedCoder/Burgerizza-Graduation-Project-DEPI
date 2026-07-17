import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '../layouts/DashboardLayout';
import Login from '../pages/auth/Login';
import Dashboard from '../pages/dashboard/Dashboard';
import MenuList from '../pages/menu/MenuList';
import Orders from '../pages/orders/Orders';
import OrderDetails from '../pages/orders/OrderDetails';
import Reservations from '../pages/reservations/Reservations';
import Inventory from '../pages/inventory/Inventory';

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route element={<ProtectedRoute />}>
      <Route element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="/menu" element={<MenuList />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<OrderDetails />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/inventory" element={<Inventory />} />
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
