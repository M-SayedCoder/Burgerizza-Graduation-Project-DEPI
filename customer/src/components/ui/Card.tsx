import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverable = true,
  padding = 'md',
  className = '',
  ...props
}) => {
  const baseStyle = 'bg-white rounded-4 border-0 shadow-sm transition-all';
  const hoverStyle = hoverable ? 'base-card' : '';
  
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-5',
  };

  return (
    <div
      className={`${baseStyle} ${hoverStyle} ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
export default Card;
