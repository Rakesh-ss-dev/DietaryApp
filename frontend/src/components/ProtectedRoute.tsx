// components/ProtectedRoute.tsx
import React, { ReactNode } from 'react';
import { getUserType, UserRole } from '../utils/auth';
import { Navigate } from 'react-router';

interface ProtectedRouteProps {
  allowedRole: UserRole;
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRole, children }) => {
  const userType = getUserType();

  if (!userType) return <Navigate to="/" replace />;
  if (userType !== allowedRole) return <Navigate to={`/${userType}-dashboard`} replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
