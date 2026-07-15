import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";
import OrderDetails from "./pages/OrderDetails";
import AdminReservations from "./pages/AdminReservations";
import ReservationDetails from "./pages/ReservationDetails";
import AdminLogin from "./pages/AdminLogin";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* الصفحة الرئيسية */}
        <Route
          path="/"
          element={<AdminDashboard />}
        />

        {/* Login (نسيبه موجود لكن مش إجباري) */}
        <Route
          path="/login"
          element={<AdminLogin />}
        />

        {/* Orders */}
        <Route
          path="/orders"
          element={<AdminOrders />}
        />

        <Route
          path="/orders/:id"
          element={<OrderDetails />}
        />

        {/* Reservations */}
        <Route
          path="/reservations"
          element={<AdminReservations />}
        />

        <Route
          path="/reservations/:id"
          element={<ReservationDetails />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;