import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Alert, Button, Card, Form, Input, Select, Tabs, Typography, message } from 'antd';
import { LockOutlined, MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { authApi } from '@/api';
import { registerUserTypeOptions } from '@/constants/domain';
import { useAuthStore } from '@/stores/authStore';
import type { LoginRequest, RegisterRequest } from '@/types';
import { logError } from '@/utils/logError';

const { Title, Text } = Typography;

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSession, isLoggedIn } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async (values: LoginRequest) => {
    setLoading(true);
    try {
      const res = await authApi.login(values);
      const session = res.data.data;
      setSession(session.token, session.user);
      message.success('登录成功');
      navigate(from, { replace: true });
    } catch (error) {
      logError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values: RegisterRequest & { confirmPassword: string }) => {
    if (values.password !== values.confirmPassword) {
      message.error('两次输入的密码不一致');
      return;
    }

    setLoading(true);
    try {
      const payload: RegisterRequest = {
        userNo: values.userNo,
        realName: values.realName,
        phone: values.phone,
        email: values.email,
        password: values.password,
        userType: values.userType,
      };
      const res = await authApi.register(payload);
      const session = res.data.data;
      setSession(session.token, session.user);
      message.success('注册成功');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      logError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      style={{
        width: 420,
        maxWidth: '100%',
        borderRadius: 12,
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
      }}
      styles={{ body: { padding: '32px 32px 24px' } }}
    >
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Title level={3} style={{ marginBottom: 4 }}>
          共享空间预约系统
        </Title>
        <Text type="secondary">登录后即可浏览、预约和管理共享空间资源</Text>
      </div>

      <Alert
        type="info"
        showIcon
        style={{ marginBottom: 20 }}
        message="默认管理员账号"
        description="首次启动时系统会自动创建管理员账号：admin，默认密码：admin123456。登录后可在个人信息页修改密码。"
      />

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        centered
        items={[
          {
            key: 'login',
            label: '登录',
            children: (
              <Form onFinish={handleLogin} size="large" autoComplete="off" layout="vertical">
                <Form.Item
                  name="userNo"
                  label="用户编号"
                  rules={[{ required: true, message: '请输入用户编号' }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="例如：admin、学号或工号" />
                </Form.Item>
                <Form.Item
                  name="password"
                  label="密码"
                  rules={[{ required: true, message: '请输入密码' }]}
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="请输入密码" />
                </Form.Item>
                <Form.Item style={{ marginBottom: 0 }}>
                  <Button type="primary" htmlType="submit" loading={loading} block>
                    登录
                  </Button>
                </Form.Item>
              </Form>
            ),
          },
          {
            key: 'register',
            label: '注册',
            children: (
              <Form onFinish={handleRegister} size="large" autoComplete="off" layout="vertical">
                <Form.Item
                  name="userNo"
                  label="用户编号"
                  rules={[{ required: true, message: '请输入用户编号' }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="请输入用户编号" />
                </Form.Item>
                <Form.Item
                  name="realName"
                  label="真实姓名"
                  rules={[{ required: true, message: '请输入真实姓名' }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="请输入真实姓名" />
                </Form.Item>
                <Form.Item name="phone" label="手机号">
                  <Input prefix={<PhoneOutlined />} placeholder="选填" />
                </Form.Item>
                <Form.Item name="email" label="邮箱">
                  <Input prefix={<MailOutlined />} placeholder="选填" />
                </Form.Item>
                <Form.Item name="userType" label="用户类型" initialValue="STUDENT">
                  <Select options={registerUserTypeOptions} />
                </Form.Item>
                <Form.Item
                  name="password"
                  label="密码"
                  rules={[
                    { required: true, message: '请输入密码' },
                    { min: 6, message: '密码至少 6 位' },
                  ]}
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="至少 6 位" />
                </Form.Item>
                <Form.Item
                  name="confirmPassword"
                  label="确认密码"
                  dependencies={['password']}
                  rules={[
                    { required: true, message: '请再次输入密码' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('两次输入的密码不一致'));
                      },
                    }),
                  ]}
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="请再次输入密码" />
                </Form.Item>
                <Form.Item style={{ marginBottom: 0 }}>
                  <Button type="primary" htmlType="submit" loading={loading} block>
                    注册并登录
                  </Button>
                </Form.Item>
              </Form>
            ),
          },
        ]}
      />
    </Card>
  );
}
