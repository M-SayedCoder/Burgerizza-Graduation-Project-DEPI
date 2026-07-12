import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'orange' | 'light' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyle = 'btn d-inline-flex align-items-center justify-content-center gap-2 transition-all';
  
  const variantStyles = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline-primary',
    orange: 'btn-orange',
    light: 'btn-light border',
    danger: 'btn-danger',
  };

  const sizeStyles = {
    sm: 'btn-sm py-1.5 px-3 fs-7',
    md: 'py-2 px-4 fs-6',
    lg: 'btn-lg py-3 px-5 fs-5',
  };

  const wStyle = fullWidth ? 'w-100' : '';
  const dStyle = disabled || isLoading ? 'disabled' : '';

  return (
    <button
      className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${wStyle} ${dStyle} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
      )}
      {children}
    </button>
  );
};
export default Button;
