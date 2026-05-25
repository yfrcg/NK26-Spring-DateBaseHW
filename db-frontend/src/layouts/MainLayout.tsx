import { useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Avatar, Badge, Button, Dropdown, Layout, Menu, Progress, Typography } from 'antd';
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

const routeTitleMap: Record<string, string> = {
  '/dashboard': '工作台',
  '/spaces': '空间浏览',
  '/reservations': '我的预约',
  '/account': '账户中心',
  '/profile': '个人信息',
  '/admin/users': '用户管理',
  '/admin/spaces': '空间管理',
  '/admin/reservations': '预约管理',
  '/admin/policies': '计费策略',
  '/admin/credits': '信用管理',
};

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  const userMenuItems = useMemo(
    () => [
      { key: '/dashboard', icon: <DashboardOutlined />, label: '工作台' },
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
      { key: '/dashboard', icon: <DashboardOutlined />, label: '工作台' },
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
        key: 'account',
        icon: <SettingOutlined />,
        label: '账户中心',
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

  const creditScore = user?.creditScore ?? 0;
  const pageTitle = routeTitleMap[location.pathname] || '共享空间预约';

  return (
    <Layout className="app-shell">
      <Sider
        className="app-sider"
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="lg"
        collapsedWidth={72}
        width={228}
        trigger={null}
      >
        <div className="brand-block">
          <div className="brand-mark">
            <CalendarOutlined />
          </div>
          {!collapsed && (
            <div className="brand-copy">
              <strong>共享空间预约</strong>
              <span>Space Booking</span>
            </div>
          )}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={isAdmin ? adminMenuItems : userMenuItems}
          onClick={({ key }) => navigate(key)}
          className="app-menu"
        />

        {!collapsed && (
          <div className="sider-credit-card">
            <div>
              <span>信用分</span>
              <strong>{creditScore}</strong>
            </div>
            <Progress
              percent={Math.min(100, creditScore)}
              showInfo={false}
              strokeColor="#10b981"
              railColor="rgba(255,255,255,0.12)"
              size="small"
            />
            <small>{creditScore >= 90 ? '良好，请继续保持' : '注意预约履约记录'}</small>
          </div>
        )}
      </Sider>

      <Layout className="app-main" style={{ marginLeft: collapsed ? 72 : 228 }}>
        <Header className="app-header">
          <div className="header-left">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="icon-action"
            />
            <div>
              <Text className="header-title">{pageTitle}</Text>
              <Text className="header-subtitle">今日状态、预约流转和空间运营一屏掌握</Text>
            </div>
          </div>

          <div className="header-right">
            <Badge count={isAdmin ? 3 : 0} size="small">
              <Button
                type="text"
                aria-label="查看我的预约"
                icon={<CalendarOutlined />}
                className="icon-action"
                onClick={() => navigate(isAdmin ? '/admin/reservations' : '/reservations')}
              />
            </Badge>
            <Dropdown menu={dropdownItems} placement="bottomRight" trigger={['click']}>
              <button className="profile-chip" type="button">
                <Badge dot status="success" offset={[-2, 30]}>
                  <Avatar size={36} icon={<UserOutlined />} />
                </Badge>
                <span>
                  <strong>{user?.realName || '用户'}</strong>
                  <small>{isAdmin ? '系统管理员' : `信用分 ${creditScore}`}</small>
                </span>
              </button>
            </Dropdown>
          </div>
        </Header>

        <Content className="app-content">
          <div className="page-enter">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
