import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

export const AuthLayout: React.FC = () => {
  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light py-5 px-3">
      <div className="card border-0 shadow rounded-4 overflow-hidden" style={{ maxWidth: '480px', width: '100%' }}>
        <div className="bg-dark text-white text-center py-4 px-4">
          <Link to={ROUTES.HOME} className="text-decoration-none text-white">
            <h2 className="fw-bold m-0 text-orange">Burgerizza</h2>
          </Link>
          <p className="text-white-50 m-0 mt-1 small">Satisy your cravings instantly</p>
        </div>
        <div className="p-4 p-sm-5 bg-white">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
export default AuthLayout;
