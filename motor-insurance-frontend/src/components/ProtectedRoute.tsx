import React from 'react';
import { Navigate } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';

interface Props {
  children: React.ReactNode;
  allowedRoles: string[];
  useLayout?: boolean;
}

const ProtectedRoute: React.FC<Props> = ({ children, allowedRoles, useLayout = true }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(role || '')) {
    return <Navigate to="/login" replace />;
  }

  // Wrap with MainLayout for all routes except specific cases
  if (useLayout) {
    return <MainLayout>{children}</MainLayout>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;