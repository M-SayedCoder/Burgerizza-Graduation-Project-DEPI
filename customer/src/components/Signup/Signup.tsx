import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { registerSchema, type RegisterFormValues } from '../../utils/validators';
import { ROUTES } from '../../constants/routes';
import Button from '../ui/Button';
import './Signup.css';

export const Signup: React.FC = () => {
  const { register: signup, error, dismissError } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true);
    dismissError();
    try {
      const result = await signup(data);
      if ((result as any).payload && !(result as any).error) {
        navigate(ROUTES.HOME, { replace: true });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <h3 className="fw-bold mb-3 text-center">Sign Up</h3>
      
      {error && (
        <div className="alert alert-danger py-2 px-3 fs-7 mb-3 d-flex justify-content-between align-items-center" role="alert">
          <span>{error}</span>
          <button type="button" className="btn-close fs-8" onClick={dismissError} aria-label="Close" />
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="active">
        <div className="mb-2">
          <label htmlFor="signupName">Name</label>
          <div className="input-wrapper mb-1">
            <i className="bi bi-person" />
            <input
              type="text"
              id="signupName"
              placeholder="Enter your full name"
              {...register('name')}
            />
          </div>
          {errors.name && <div className="error">{errors.name.message}</div>}
        </div>

        <div className="mb-2">
          <label htmlFor="signupEmail">Email</label>
          <div className="input-wrapper mb-1">
            <i className="bi bi-envelope" />
            <input
              type="email"
              id="signupEmail"
              placeholder="Enter your email"
              {...register('email')}
            />
          </div>
          {errors.email && <div className="error">{errors.email.message}</div>}
        </div>

        <div className="mb-2">
          <label htmlFor="signupPhone">Phone Number</label>
          <div className="input-wrapper mb-1">
            <i className="bi bi-telephone" />
            <input
              type="tel"
              id="signupPhone"
              placeholder="Enter phone number"
              {...register('phone')}
            />
          </div>
          {errors.phone && <div className="error">{errors.phone.message}</div>}
        </div>

        <div className="mb-2">
          <label htmlFor="signupPassword">Password</label>
          <div className="input-wrapper mb-1">
            <i className="bi bi-lock" />
            <input
              type={showPassword ? 'text' : 'password'}
              id="signupPassword"
              placeholder="Enter your password"
              {...register('password')}
            />
            <i
              className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} toggle`}
              onClick={() => setShowPassword((prev) => !prev)}
            />
          </div>
          {errors.password && <div className="error">{errors.password.message}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="signupRePassword">Re-type Password</label>
          <div className="input-wrapper mb-1">
            <i className="bi bi-lock" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="signupRePassword"
              placeholder="Re-enter your password"
              {...register('confirmPassword')}
            />
            <i
              className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'} toggle`}
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            />
          </div>
          {errors.confirmPassword && (
            <div className="error">{errors.confirmPassword.message}</div>
          )}
        </div>

        <Button type="submit" variant="orange" isLoading={loading} fullWidth>
          Sign Up
        </Button>
      </form>

      <div className="text-center mt-4 text-muted small">
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="text-primary-orange text-decoration-none fw-bold">
          Log In
        </Link>
      </div>
    </div>
  );
};

export default Signup;