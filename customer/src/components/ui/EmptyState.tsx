import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import Button from './Button';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: React.ReactNode;
  actionText?: string;
  actionPath?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  icon,
  actionText = 'Go to Menu',
  actionPath = ROUTES.MENU,
}) => {
  return (
    <div className="text-center py-5 px-4 animate-fade-in">
      <div className="fs-1 text-muted mb-3 d-flex justify-content-center">
        {icon || <i className="bi bi-inbox" style={{ fontSize: '3rem' }} />}
      </div>
      <h4 className="fw-bold mb-2">{title}</h4>
      <p className="text-muted mb-4 mx-auto" style={{ maxWidth: '400px' }}>
        {message}
      </p>
      {actionText && actionPath && (
        <Link to={actionPath}>
          <Button variant="orange" size="md">
            {actionText}
          </Button>
        </Link>
      )}
    </div>
  );
};
export default EmptyState;
