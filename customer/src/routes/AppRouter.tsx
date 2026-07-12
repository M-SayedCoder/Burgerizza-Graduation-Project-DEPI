import { createBrowserRouter } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import ProtectedRoute from '../components/ui/ProtectedRoute';

// Lazy load pages for performance
import Home from '../components/Home/Home';
import AllCategures from '../components/AllCatetguers/AllCategures';
import Details from '../components/Details/Details';
import Cart from '../components/Cart/Cart';
import Checkout from '../components/Checkout/Checkout';
import Profile from '../components/Profile/Profile';
import Address from '../components/Address/Address';
import Signin from '../components/Signin/Signin';
import Signup from '../components/Signup/Signup';

// Lazy or Direct loading for new pages
import MenuPage from '../components/Menu/MenuPage.tsx';
import OrdersPage from '../components/Orders/OrdersPage.tsx';
import ReservationPage from '../components/Reservation/ReservationPage.tsx';

export const AppRouter = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: ROUTES.MENU,
        element: <MenuPage />,
      },
      {
        path: ROUTES.MENU_DETAIL,
        element: <Details />,
      },
      {
        path: ROUTES.CATEGORIES,
        element: <AllCategures />,
      },
      {
        path: ROUTES.CART,
        element: (
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.CHECKOUT,
        element: (
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.ORDERS,
        element: (
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.RESERVATIONS,
        element: (
          <ProtectedRoute>
            <ReservationPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.PROFILE,
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.ADDRESS,
        element: (
          <ProtectedRoute>
            <Address />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: ROUTES.LOGIN,
        element: <Signin />,
      },
      {
        path: ROUTES.REGISTER,
        element: <Signup />,
      },
    ],
  },
]);

export default AppRouter;
