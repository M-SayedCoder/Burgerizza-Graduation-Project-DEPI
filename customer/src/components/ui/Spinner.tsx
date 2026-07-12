import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'text-primary-orange',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'spinner-border-sm',
    md: '',
    lg: 'spinner-border-lg',
  };

  const style = size === 'lg' ? { width: '3rem', height: '3rem' } : undefined;

  return (
    <div className={`d-flex justify-content-center align-items-center py-5 ${className}`}>
      <div
        className={`spinner-border ${color} ${sizeClasses[size]}`}
        role="status"
        style={style}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};
export default Spinner;
