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
          colorPrimary: '#0f9f8f',
          colorSuccess: '#10b981',
          colorWarning: '#f59e0b',
          colorError: '#ef4444',
          colorInfo: '#2563eb',
          borderRadius: 8,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
          colorBgLayout: '#f5f7fb',
          colorBgContainer: '#ffffff',
          colorText: '#172033',
          colorTextSecondary: '#667085',
          colorBorderSecondary: '#e6ebf2',
          boxShadow: '0 14px 36px rgba(16, 24, 40, 0.08)',
        },
        components: {
          Card: {
            borderRadiusLG: 8,
            boxShadow: '0 16px 38px rgba(16, 24, 40, 0.07)',
          },
          Table: {
            headerBg: '#f8fafc',
            headerColor: '#475467',
            rowHoverBg: '#f2fbf9',
          },
          Button: {
            borderRadius: 8,
            controlHeight: 36,
          },
          Menu: {
            itemBorderRadius: 8,
            darkItemBg: 'transparent',
            darkSubMenuItemBg: 'transparent',
            darkItemSelectedBg: 'rgba(16, 185, 129, 0.18)',
            darkItemHoverBg: 'rgba(255, 255, 255, 0.07)',
          },
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
