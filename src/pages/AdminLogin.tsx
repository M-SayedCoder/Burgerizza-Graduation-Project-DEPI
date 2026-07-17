import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { adminLogin } from "../api/authApi";
import type { LoginPayload } from "../types/auth";

import "../styles/admin-login.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<LoginPayload>({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await adminLogin(formData);

      const { token, user } = response.data;

      if (user.role !== "admin") {
        setError("Access denied. Admin only.");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      navigate("/");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Login failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-page">

      <div className="admin-login-container">

        <div className="admin-login-logo">
          Burger<span>izza</span>
        </div>

        <h2 className="admin-login-title">
          Admin Login
        </h2>

        <p className="admin-login-subtitle">
          Sign in to access the admin dashboard
        </p>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <form
          className="admin-login-form"
          onSubmit={handleSubmit}
        >

          <label>Email</label>

          <div className="input-wrapper">
            <i className="far fa-envelope"></i>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <label>Password</label>

          <div className="input-wrapper">
            <i className="fas fa-lock"></i>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="options-row">

            <label>
              <input type="checkbox" />
              {" "}Remember me
            </label>

            <a href="#">
              Forgot Password?
            </a>

          </div>

          <button
            type="submit"
            className="admin-login-btn"
            disabled={loading}
          >
            {loading ? (
              "Logging in..."
            ) : (
              <>
                <i className="fas fa-sign-in-alt me-2"></i>
                Login
              </>
            )}
          </button>

        </form>

        <div className="admin-login-footer">
          Burgerizza Restaurant Management System
        </div>

      </div>

    </div>
  );
}

export default AdminLogin;