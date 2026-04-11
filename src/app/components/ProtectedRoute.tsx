import { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useBank } from '../context/BankContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { currentUser } = useBank();

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  if (requireAdmin && currentUser.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
