import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import AddMenuItem from "./pages/AddMenuItem";
import AdminMenu from "./pages/AdminMenu";
import AdminOrders from "./pages/AdminOrders";
import AdminProfile from "./pages/AdminProfile";
import AdminCustomers from "./pages/AdminCustomers";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/add-menu-item" element={<AddMenuItem />} />
        <Route path="/menu" element={<AdminMenu />} />
        <Route path="/orders" element={<AdminOrders />} />
        <Route path="/profile" element={<AdminProfile />} />
        <Route path="/customers" element={<AdminCustomers />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;