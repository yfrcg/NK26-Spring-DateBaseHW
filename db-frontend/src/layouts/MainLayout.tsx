import { useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Avatar, Badge, Dropdown, Layout, Menu, Typography } from 'antd';
import {
  BankOutlined,
  CalendarOutlined,
  DashboardOutlined,
  DollarOutlined,
  FileTextOutlined,
  HomeOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import { authApi } from '@/api';
import { useAuthStore } from '@/stores/authStore';
import { logError } from '@/utils/logError';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  const userMenuItems = useMemo(
    () => [
      { key: '/dashboard', icon: <DashboardOutlined />, label: '仪表盘' },
      { key: '/spaces', icon: <HomeOutlined />, label: '空间浏览' },
      { key: '/reservations', icon: <CalendarOutlined />, label: '我的预约' },
      { type: 'divider' as const },
      { key: '/account', icon: <WalletOutlined />, label: '账户中心' },
      { key: '/profile', icon: <UserOutlined />, label: '个人信息' },
    ],
    []
  );

  const adminMenuItems = useMemo(
    () => [
      { key: '/dashboard', icon: <DashboardOutlined />, label: '仪表盘' },
      { type: 'divider' as const },
      { key: '/admin/users', icon: <TeamOutlined />, label: '用户管理' },
      { key: '/admin/spaces', icon: <BankOutlined />, label: '空间管理' },
      { key: '/admin/reservations', icon: <FileTextOutlined />, label: '预约管理' },
      { key: '/admin/policies', icon: <DollarOutlined />, label: '计费策略' },
      { key: '/admin/credits', icon: <SafetyCertificateOutlined />, label: '信用管理' },
      { type: 'divider' as const },
      { key: '/spaces', icon: <HomeOutlined />, label: '空间浏览' },
      { key: '/profile', icon: <UserOutlined />, label: '个人信息' },
    ],
    []
  );

  const dropdownItems = {
    items: [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: '个人信息',
        onClick: () => navigate('/profile'),
      },
      {
        key: 'settings',
        icon: <SettingOutlined />,
        label: '账户设置',
        onClick: () => navigate('/account'),
      },
      { type: 'divider' as const },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: '退出登录',
        danger: true,
        onClick: async () => {
          try {
            await authApi.logout();
          } catch (error) {
            logError(error);
          } finally {
            logout();
            navigate('/login', { replace: true });
          }
        },
      },
    ],
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="lg"
        collapsedWidth={64}
        width={240}
        trigger={null}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 10,
          background: 'linear-gradient(180deg, #07111f 0%, #0d2635 55%, #12343b 100%)',
          boxShadow: '4px 0 28px rgba(15, 23, 42, 0.18)',
        }}
      >
        <div
          style={{
            height: 72,
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? '0' : '0 20px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #2563eb 0%, #0891b2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 10px 22px rgba(8, 145, 178, 0.28)',
            }}
          >
            <CalendarOutlined style={{ fontSize: 18, color: '#fff' }} />
          </div>
          {!collapsed && (
            <div style={{ marginLeft: 12, overflow: 'hidden' }}>
              <Text
                strong
                style={{
                  color: '#fff',
                  fontSize: 15,
                  whiteSpace: 'nowrap',
                  display: 'block',
                  lineHeight: 1.3,
                }}
              >
                共享空间预约
              </Text>
              <Text
                style={{
                  color: 'rgba(255,255,255,0.45)',
                  fontSize: 11,
                  whiteSpace: 'nowrap',
                  display: 'block',
                }}
              >
                Space Booking System
              </Text>
            </div>
          )}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={isAdmin ? adminMenuItems : userMenuItems}
          onClick={({ key }) => navigate(key)}
          style={{
            marginTop: 8,
            borderRight: 'none',
          }}
        />

        {!collapsed && (
          <div
            style={{
              position: 'absolute',
              bottom: 16,
              left: 16,
              right: 16,
              padding: '12px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Badge dot status="success" offset={[-2, 28]}>
                <Avatar
                  size={36}
                  icon={<UserOutlined />}
                  style={{
                    background: 'linear-gradient(135deg, #2563eb, #0891b2)',
                    flexShrink: 0,
                  }}
                />
              </Badge>
              <div style={{ overflow: 'hidden' }}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 500,
                    display: 'block',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {user?.realName || '用户'}
                </Text>
                <Text
                  style={{
                    color: 'rgba(255,255,255,0.4)',
                    fontSize: 11,
                    display: 'block',
                  }}
                >
                  {isAdmin ? '管理员' : user?.userType === 'STUDENT' ? '学生' : '教师'}
                </Text>
              </div>
            </div>
          </div>
        )}
      </Sider>

      <Layout
        style={{
          marginLeft: collapsed ? 64 : 240,
          transition: 'margin-left 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Header
          style={{
            padding: '0 24px',
            background: 'rgba(255,255,255,0.88)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 10px 28px rgba(15, 23, 42, 0.04)',
            position: 'sticky',
            top: 0,
            zIndex: 9,
            borderBottom: '1px solid #e5edf5',
          }}
        >
          <div
            style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: 8, transition: 'background 0.15s' }}
            onClick={() => setCollapsed(!collapsed)}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = '#f1f5f9'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
          >
            {collapsed ? (
              <MenuUnfoldOutlined style={{ fontSize: 18, color: '#64748b' }} />
            ) : (
              <MenuFoldOutlined style={{ fontSize: 18, color: '#64748b' }} />
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ textAlign: 'right', marginRight: 4 }}>
              <Text style={{ fontSize: 13, fontWeight: 500, display: 'block', color: '#1e293b' }}>
                {user?.realName || '用户'}
              </Text>
              <Text style={{ fontSize: 11, color: '#94a3b8', display: 'block' }}>
                {isAdmin ? '系统管理员' : `信用分 ${user?.creditScore ?? '-'}`}
              </Text>
            </div>
            <Dropdown menu={dropdownItems} placement="bottomRight" trigger={['click']}>
              <div
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '4px 8px',
                  borderRadius: 10,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = '#f1f5f9'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
              >
                <Badge dot status="success" offset={[-2, 28]}>
                  <Avatar
                    size={36}
                    icon={<UserOutlined />}
                    style={{
                      background: 'linear-gradient(135deg, #2563eb, #0891b2)',
                    }}
                  />
                </Badge>
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content
          style={{
            margin: 24,
            position: 'relative',
            minHeight: 280,
          }}
        >
          <div className="page-enter">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
