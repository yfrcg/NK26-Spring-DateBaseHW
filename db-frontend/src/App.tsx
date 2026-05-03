import { Suspense, lazy, useEffect, useEffectEvent } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ConfigProvider, Spin } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { authApi } from '@/api';
import { useAuthStore } from '@/stores/authStore';
import { logError } from '@/utils/logError';

const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'));
const SpacesPage = lazy(() => import('@/pages/spaces/SpacesPage'));
const ReservationsPage = lazy(() => import('@/pages/reservations/ReservationsPage'));
const AccountPage = lazy(() => import('@/pages/account/AccountPage'));
const ProfilePage = lazy(() => import('@/pages/profile/ProfilePage'));
const AdminUsersPage = lazy(() => import('@/pages/admin/AdminUsersPage'));
const AdminSpacesPage = lazy(() => import('@/pages/admin/AdminSpacesPage'));
const AdminReservationsPage = lazy(() => import('@/pages/admin/AdminReservationsPage'));
const AdminPoliciesPage = lazy(() => import('@/pages/admin/AdminPoliciesPage'));
const AdminCreditsPage = lazy(() => import('@/pages/admin/AdminCreditsPage'));

function PageFallback() {
  return (
    <div style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Spin size="large" />
    </div>
  );
}

export default function App() {
  const { token, isReady, syncUser, setReady, logout } = useAuthStore();

  const bootstrapAuth = useEffectEvent(async () => {
    if (!token) {
      setReady();
      return;
    }

    try {
      const res = await authApi.me();
      syncUser(res.data.data);
    } catch (error) {
      logError(error);
      logout();
    } finally {
      setReady();
    }
  });

  useEffect(() => {
    void bootstrapAuth();
  }, [token]);

  if (!isReady) {
    return (
      <ConfigProvider locale={zhCN}>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Spin size="large" />
        </div>
      </ConfigProvider>
    );
  }

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        },
      }}
    >
      <BrowserRouter>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
            </Route>
            <Route
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/spaces" element={<SpacesPage />} />
              <Route path="/reservations" element={<ReservationsPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminUsersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/spaces"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminSpacesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/reservations"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminReservationsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/policies"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminPoliciesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/credits"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminCreditsPage />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ConfigProvider>
  );
}
