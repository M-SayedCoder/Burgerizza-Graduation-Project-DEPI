import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { loginSchema, type LoginFormValues } from '../../utils/validators';
import { ROUTES } from '../../constants/routes';
import Button from '../ui/Button';
import './Signin.css';

export const Signin: React.FC = () => {
  const { login, error, dismissError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Get redirect path or default to '/'
  const from = (location.state as any)?.from?.pathname || ROUTES.HOME;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const handleFormSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    dismissError();
    try {
      const result = await login(data);
      if ((result as any).payload && !(result as any).error) {
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <h3 className="fw-bold mb-3 text-center">Log In</h3>
      
      {error && (
        <div className="alert alert-danger py-2 px-3 fs-7 mb-3 d-flex justify-content-between align-items-center" role="alert">
          <span>{error}</span>
          <button type="button" className="btn-close fs-8" onClick={dismissError} aria-label="Close" />
        </div>
      )}

      <form onSubmit={handleSubmit(handleFormSubmit)} className="active">
        <div className="mb-3">
          <label htmlFor="loginEmail">Email</label>
          <div className="input-wrapper mb-1">
            <i className="bi bi-envelope" />
            <input
              type="email"
              id="loginEmail"
              placeholder="Enter your email"
              {...register('email')}
            />
          </div>
          {errors.email && <div className="error">{errors.email.message}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="loginPassword">Password</label>
          <div className="input-wrapper mb-1">
            <i className="bi bi-lock" />
            <input
              type={showPassword ? 'text' : 'password'}
              id="loginPassword"
              placeholder="Enter your password"
              {...register('password')}
            />
            <i
              className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} toggle`}
              onClick={() => setShowPassword((prev) => !prev)}
              title={showPassword ? 'Hide password' : 'Show password'}
            />
          </div>
          {errors.password && <div className="error">{errors.password.message}</div>}
        </div>

        <div className="options-row mb-4">
          <label className="d-flex align-items-center gap-2 cursor-pointer mb-0">
            <input type="checkbox" id="rememberMe" {...register('rememberMe')} />
            Remember me
          </label>
          <Link to={ROUTES.FORGOT_PASSWORD} className="text-decoration-none">
            Forgot Password?
          </Link>
        </div>

        <Button type="submit" variant="orange" isLoading={loading} fullWidth>
          Log In
        </Button>
      </form>

      <div className="text-center mt-4 text-muted small">
        Don't have an account?{' '}
        <Link to={ROUTES.REGISTER} className="text-primary-orange text-decoration-none fw-bold">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Signin;
