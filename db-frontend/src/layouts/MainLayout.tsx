import { useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Avatar, Dropdown, Layout, Menu, Typography, theme } from 'antd';
import {
  BankOutlined,
  CalendarOutlined,
  DashboardOutlined,
  DollarOutlined,
  FileTextOutlined,
  HomeOutlined,
  LogoutOutlined,
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
  const { token } = theme.useToken();

  const userMenuItems = useMemo(
    () => [
      { key: '/dashboard', icon: <DashboardOutlined />, label: '仪表盘' },
      { key: '/spaces', icon: <HomeOutlined />, label: '空间浏览' },
      { key: '/reservations', icon: <CalendarOutlined />, label: '我的预约' },
      { key: '/account', icon: <WalletOutlined />, label: '账户中心' },
      { key: '/profile', icon: <UserOutlined />, label: '个人信息' },
    ],
    []
  );

  const adminMenuItems = useMemo(
    () => [
      { key: '/dashboard', icon: <DashboardOutlined />, label: '仪表盘' },
      { key: '/admin/users', icon: <TeamOutlined />, label: '用户管理' },
      { key: '/admin/spaces', icon: <BankOutlined />, label: '空间管理' },
      { key: '/admin/reservations', icon: <FileTextOutlined />, label: '预约管理' },
      { key: '/admin/policies', icon: <DollarOutlined />, label: '计费策略' },
      { key: '/admin/credits', icon: <SafetyCertificateOutlined />, label: '信用管理' },
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
        onClick: () => navigate('/profile'),
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
        breakpoint="lg"
        collapsedWidth="0"
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <CalendarOutlined style={{ fontSize: 24, color: '#fff', marginRight: 8 }} />
          <Text strong style={{ color: '#fff', fontSize: 16, whiteSpace: 'nowrap' }}>
            共享空间预约系统
          </Text>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={isAdmin ? adminMenuItems : userMenuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout style={{ marginLeft: 200 }}>
        <Header
          style={{
            padding: '0 24px',
            background: token.colorBgContainer,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            position: 'sticky',
            top: 0,
            zIndex: 9,
          }}
        >
          <Dropdown menu={dropdownItems} placement="bottomRight">
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar icon={<UserOutlined />} style={{ backgroundColor: token.colorPrimary }} />
              <Text>{user?.realName || '用户'}</Text>
              {isAdmin && (
                <Text type="secondary" style={{ fontSize: 12 }}>
                  （管理员）
                </Text>
              )}
            </div>
          </Dropdown>
        </Header>
        <Content style={{ margin: 24, minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
