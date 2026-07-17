import { NavLink, useNavigate } from "react-router-dom";

function AdminHeader() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // بما إننا مش مفعلين الـLogin دلوقتي
      navigate("/login");
  }

  return (
    <header className="admin-header border-bottom bg-white sticky-top">
      <div className="container py-3">
        <div className="row align-items-center">

          {/* LEFT SIDE */}

          <div className="col-md-6 d-flex align-items-center gap-3">

            <NavLink
              to="/"
              className="text-decoration-none brand-link"
            >
              <span className="fw-bold fs-5">
                Burgerizza
              </span>
            </NavLink>

            <nav className="d-none d-md-flex gap-3 admin-nav">

              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `text-decoration-none ${
                    isActive ? "active" : ""
                  }`
                }
              >
                Dashboard
              </NavLink>

              <NavLink
                to="/orders"
                className={({ isActive }) =>
                  `text-decoration-none ${
                    isActive ? "active" : ""
                  }`
                }
              >
                Orders
              </NavLink>

              <NavLink
                to="/reservations"
                className={({ isActive }) =>
                  `text-decoration-none ${
                    isActive ? "active" : ""
                  }`
                }
              >
                Reservations
              </NavLink>

            </nav>

          </div>

          {/* RIGHT SIDE */}

          <div className="col-md-6 d-flex justify-content-end align-items-center gap-3">

            <div className="admin-status text-end">

              <div className="small text-muted">
                Admin Mode
              </div>

              <div className="fw-semibold">
                {user.name || "Admin"}
              </div>

            </div>

            <button
              type="button"
              className="btn btn-orange"
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right me-2"></i>

              Logout
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}

export default AdminHeader;