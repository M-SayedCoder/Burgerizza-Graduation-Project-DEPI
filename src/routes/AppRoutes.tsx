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

// Admin Imports
import AdminDashboard from '../pages/AdminDashboard';
import AdminOrders from '../pages/AdminOrders';
import AdminOrderDetails from '../pages/OrderDetails';
import AdminReservations from '../pages/AdminReservations';
import AdminReservationDetails from '../pages/ReservationDetails';
import AdminLogin from '../pages/AdminLogin';
import AdminProtectedRoute from '../components/ProtectedRoute';

const AppRoutes = () => (
  <Routes>
    {/* Manager/Staff Routes */}
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

    {/* Admin Routes */}
    <Route path="/admin/login" element={<AdminLogin />} />
    <Route
      path="/admin"
      element={
        <AdminProtectedRoute>
          <AdminDashboard />
        </AdminProtectedRoute>
      }
    />
    <Route
      path="/admin/orders"
      element={
        <AdminProtectedRoute>
          <AdminOrders />
        </AdminProtectedRoute>
      }
    />
    <Route
      path="/admin/orders/:id"
      element={
        <AdminProtectedRoute>
          <AdminOrderDetails />
        </AdminProtectedRoute>
      }
    />
    <Route
      path="/admin/reservations"
      element={
        <AdminProtectedRoute>
          <AdminReservations />
        </AdminProtectedRoute>
      }
    />
    <Route
      path="/admin/reservations/:id"
      element={
        <AdminProtectedRoute>
          <AdminReservationDetails />
        </AdminProtectedRoute>
      }
    />

    {/* Fallback */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
