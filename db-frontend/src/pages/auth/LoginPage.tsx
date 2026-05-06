import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, Form, Input, Select, Tabs, Typography, message } from 'antd';
import { LockOutlined, MailOutlined, PhoneOutlined, SafetyCertificateOutlined, UserOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
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
      message.success('登录成功，欢迎回来！');
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
      message.success('注册成功！');
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
        width: 440,
        maxWidth: '100%',
        borderRadius: 20,
        boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.1)',
        overflow: 'hidden',
      }}
      styles={{ body: { padding: '40px 36px 32px' } }}
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        style={{ textAlign: 'center', marginBottom: 32 }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 24px rgba(79, 70, 229, 0.35)',
          }}
        >
          <SafetyCertificateOutlined style={{ fontSize: 28, color: '#fff' }} />
        </div>
        <Title level={3} style={{ marginBottom: 6, fontWeight: 700, color: '#0f172a' }}>
          共享空间预约系统
        </Title>
        <Text type="secondary" style={{ fontSize: 14 }}>
          Smart Shared Space Booking Platform
        </Text>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.4 }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, #eef2ff 0%, #f5f3ff 100%)',
            border: '1px solid #e0e7ff',
            borderRadius: 10,
            padding: '10px 14px',
            marginBottom: 24,
            fontSize: 13,
            color: '#4338ca',
          }}
        >
          <strong>演示账号</strong>：admin / admin123456
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          centered
          style={{ marginTop: -4 }}
          items={[
            {
              key: 'login',
              label: '登录',
              children: (
                <Form onFinish={handleLogin} size="large" autoComplete="off" layout="vertical">
                  <Form.Item
                    name="userNo"
                    rules={[{ required: true, message: '请输入用户编号' }]}
                  >
                    <Input
                      prefix={<UserOutlined style={{ color: '#9ca3af' }} />}
                      placeholder="用户编号（如 admin）"
                      style={{ height: 48, borderRadius: 10 }}
                    />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    rules={[{ required: true, message: '请输入密码' }]}
                  >
                    <Input.Password
                      prefix={<LockOutlined style={{ color: '#9ca3af' }} />}
                      placeholder="密码"
                      style={{ height: 48, borderRadius: 10 }}
                    />
                  </Form.Item>
                  <Form.Item style={{ marginBottom: 8 }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      block
                      style={{
                        height: 48,
                        borderRadius: 10,
                        fontSize: 15,
                        fontWeight: 600,
                        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                        border: 'none',
                        boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)',
                      }}
                    >
                      登 录
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
                    rules={[{ required: true, message: '请输入用户编号' }]}
                  >
                    <Input
                      prefix={<UserOutlined style={{ color: '#9ca3af' }} />}
                      placeholder="用户编号（学号/工号）"
                      style={{ height: 44, borderRadius: 10 }}
                    />
                  </Form.Item>
                  <Form.Item
                    name="realName"
                    rules={[{ required: true, message: '请输入真实姓名' }]}
                  >
                    <Input
                      prefix={<UserOutlined style={{ color: '#9ca3af' }} />}
                      placeholder="真实姓名"
                      style={{ height: 44, borderRadius: 10 }}
                    />
                  </Form.Item>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <Form.Item name="phone" style={{ flex: 1 }}>
                      <Input
                        prefix={<PhoneOutlined style={{ color: '#9ca3af' }} />}
                        placeholder="手机号（选填）"
                        style={{ height: 44, borderRadius: 10 }}
                      />
                    </Form.Item>
                    <Form.Item name="email" style={{ flex: 1 }}>
                      <Input
                        prefix={<MailOutlined style={{ color: '#9ca3af' }} />}
                        placeholder="邮箱（选填）"
                        style={{ height: 44, borderRadius: 10 }}
                      />
                    </Form.Item>
                  </div>
                  <Form.Item name="userType" initialValue="STUDENT">
                    <Select options={registerUserTypeOptions} style={{ height: 44 }} />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    rules={[
                      { required: true, message: '请输入密码' },
                      { min: 6, message: '密码至少 6 位' },
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined style={{ color: '#9ca3af' }} />}
                      placeholder="密码（至少 6 位）"
                      style={{ height: 44, borderRadius: 10 }}
                    />
                  </Form.Item>
                  <Form.Item
                    name="confirmPassword"
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
                    <Input.Password
                      prefix={<LockOutlined style={{ color: '#9ca3af' }} />}
                      placeholder="确认密码"
                      style={{ height: 44, borderRadius: 10 }}
                    />
                  </Form.Item>
                  <Form.Item style={{ marginBottom: 8 }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      block
                      style={{
                        height: 48,
                        borderRadius: 10,
                        fontSize: 15,
                        fontWeight: 600,
                        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                        border: 'none',
                        boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)',
                      }}
                    >
                      注册并登录
                    </Button>
                  </Form.Item>
                </Form>
              ),
            },
          ]}
        />
      </motion.div>
    </Card>
  );
}
