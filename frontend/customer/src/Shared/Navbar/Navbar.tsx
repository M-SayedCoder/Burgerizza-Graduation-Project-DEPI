import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { ROUTES } from '../../constants/routes';
import './Navbar.css';

export const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { count: cartCount } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.HOME);
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  return (
    <>
      <header className="border-bottom bg-white sticky-top py-3">
        <div className="container">
          <div className="row align-items-center">
            {/* Logo & Toggle */}
            <div className="col-6 col-md-4 d-flex align-items-center gap-3">
              <button
                type="button"
                className="menu-icon d-md-none text-decoration-none border-0 bg-transparent p-0"
                onClick={toggleMobileMenu}
                aria-label="Toggle Navigation"
              >
                <i className="fa-solid fa-bars" />
              </button>
              <Link to={ROUTES.HOME} className="text-decoration-none text-dark fw-bold fs-4">
                Burgerizza
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="col-md-4 d-none d-md-flex justify-content-center gap-4">
              <NavLink
                to={ROUTES.HOME}
                className={({ isActive }) =>
                  `text-decoration-none fw-semibold ${isActive ? 'text-primary-orange' : 'text-secondary'}`
                }
              >
                Home
              </NavLink>
              <NavLink
                to={ROUTES.MENU}
                className={({ isActive }) =>
                  `text-decoration-none fw-semibold ${isActive ? 'text-primary-orange' : 'text-secondary'}`
                }
              >
                Menu
              </NavLink>
              <NavLink
                to={ROUTES.CATEGORIES}
                className={({ isActive }) =>
                  `text-decoration-none fw-semibold ${isActive ? 'text-primary-orange' : 'text-secondary'}`
                }
              >
                Categories
              </NavLink>
            </div>

            {/* Auth & Cart Icons */}
            <div className="col-6 col-md-4 d-flex justify-content-end align-items-center gap-3">
              {isAuthenticated ? (
                <div className="dropdown">
                  <button
                    className="btn btn-light rounded-pill dropdown-toggle d-flex align-items-center gap-2"
                    type="button"
                    id="userDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="fa-solid fa-circle-user fs-5" />
                    <span className="d-none d-sm-inline">{user?.name}</span>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end border-0 shadow-sm" aria-labelledby="userDropdown">
                    <li>
                      <Link className="dropdown-menu-item dropdown-item" to={ROUTES.PROFILE}>
                        My Profile
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-menu-item dropdown-item" to={ROUTES.ORDERS}>
                        My Orders
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-menu-item dropdown-item" to={ROUTES.RESERVATIONS}>
                        Reservations
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-menu-item dropdown-item" to={ROUTES.ADDRESS}>
                        Addresses
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button className="dropdown-item text-danger border-0 bg-transparent w-100 text-start" onClick={handleLogout}>
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <Link to={ROUTES.LOGIN} className="text-decoration-none">
                  <button className="btn btn-orange">Login<span className="d-none d-sm-inline"> / Sign Up</span></button>
                </Link>
              )}

              <div className="position-relative cart-icon">
                <Link to={ROUTES.CART} className="text-decoration-none text-dark">
                  <i className="fa-solid fa-bag-shopping" />
                  {cartCount > 0 && (
                    <span className="badge bg-warning text-dark position-absolute top-0 start-100 translate-middle rounded-circle">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="modal-backdrop fade show"
          style={{ zIndex: 1040 }}
          onClick={toggleMobileMenu}
        />
      )}

      {/* Mobile Drawer (Sidebar) */}
      <div
        className={`offcanvas offcanvas-start border-0 shadow ${mobileMenuOpen ? 'show' : ''}`}
        tabIndex={-1}
        style={{
          visibility: mobileMenuOpen ? 'visible' : 'hidden',
          zIndex: 1050,
          transition: 'transform 0.3s ease-in-out',
          transform: mobileMenuOpen ? 'none' : 'translateX(-100%)',
        }}
      >
        <div className="offcanvas-header bg-dark-navy text-white">
          <h5 className="offcanvas-title fw-bold">Burgerizza Menu</h5>
          <button
            type="button"
            className="btn-close btn-close-white"
            onClick={toggleMobileMenu}
            aria-label="Close"
          />
        </div>
        <div className="offcanvas-body bg-light d-flex flex-column justify-content-between">
          <div className="d-flex flex-column gap-3">
            <NavLink
              to={ROUTES.HOME}
              className="text-decoration-none text-dark fs-5 py-2 border-bottom fw-medium"
              onClick={toggleMobileMenu}
            >
              Home
            </NavLink>
            <NavLink
              to={ROUTES.MENU}
              className="text-decoration-none text-dark fs-5 py-2 border-bottom fw-medium"
              onClick={toggleMobileMenu}
            >
              Menu
            </NavLink>
            <NavLink
              to={ROUTES.CATEGORIES}
              className="text-decoration-none text-dark fs-5 py-2 border-bottom fw-medium"
              onClick={toggleMobileMenu}
            >
              Categories
            </NavLink>
            {isAuthenticated && (
              <>
                <NavLink
                  to={ROUTES.PROFILE}
                  className="text-decoration-none text-dark fs-5 py-2 border-bottom fw-medium"
                  onClick={toggleMobileMenu}
                >
                  My Profile
                </NavLink>
                <NavLink
                  to={ROUTES.ORDERS}
                  className="text-decoration-none text-dark fs-5 py-2 border-bottom fw-medium"
                  onClick={toggleMobileMenu}
                >
                  My Orders
                </NavLink>
                <NavLink
                  to={ROUTES.RESERVATIONS}
                  className="text-decoration-none text-dark fs-5 py-2 border-bottom fw-medium"
                  onClick={toggleMobileMenu}
                >
                  Reservations
                </NavLink>
                <NavLink
                  to={ROUTES.ADDRESS}
                  className="text-decoration-none text-dark fs-5 py-2 border-bottom fw-medium"
                  onClick={toggleMobileMenu}
                >
                  Addresses
                </NavLink>
              </>
            )}
          </div>

          <div>
            {isAuthenticated ? (
              <button
                className="btn btn-danger w-100 py-2.5 rounded-pill fw-semibold"
                onClick={handleLogout}
              >
                Logout
              </button>
            ) : (
              <Link to={ROUTES.LOGIN} className="text-decoration-none" onClick={toggleMobileMenu}>
                <button className="btn btn-orange w-100 py-2.5 rounded-pill fw-semibold">
                  Login / Sign Up
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default Navbar;