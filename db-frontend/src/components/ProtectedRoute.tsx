import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Spin, message } from 'antd';
import { useAuthStore } from '@/stores/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

// Separate component to handle redirection and show toast safely in useEffect
function AdminRedirect() {
  useEffect(() => {
    message.warning('权限不足');
  }, []);
  return <Navigate to="/dashboard" replace />;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { token, isReady, isAdmin } = useAuthStore();
  const location = useLocation();

  if (!isReady) {
    return (
      <div className="centered-loader">
        <Spin size="large" />
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <AdminRedirect />;
  }

  return <>{children}</>;
}
