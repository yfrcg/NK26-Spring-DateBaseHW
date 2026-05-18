import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, Form, Input, Select, Tabs, Typography, message } from 'antd';
import { LockOutlined, MailOutlined, PhoneOutlined, SafetyCertificateOutlined, UserOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { authApi } from '@/api';
import heroImage from '@/assets/workspace-hero.svg';
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
      className="auth-card-shell"
      style={{
        width: 920,
        maxWidth: '100%',
        borderRadius: 8,
        boxShadow: '0 30px 80px rgba(15, 23, 42, 0.28)',
        border: '1px solid rgba(255,255,255,0.2)',
        overflow: 'hidden',
      }}
      styles={{ body: { padding: 0 } }}
    >
      <div className="auth-card-grid">
        <div className="auth-visual-panel">
          <div className="auth-brand-mark">
            <SafetyCertificateOutlined />
          </div>
          <div>
            <Title level={2} style={{ color: '#fff', marginBottom: 10, fontWeight: 800 }}>
              共享空间预约系统
            </Title>
            <Text style={{ color: 'rgba(255,255,255,0.72)', fontSize: 15 }}>
              面向自习室、工位与会议空间的预约、签到、计费和信用管理平台。
            </Text>
          </div>
          <img src={heroImage} alt="共享空间预约系统" className="auth-hero-image" />
          <div className="auth-flow-panel">
            <span>今日开放</span>
            <strong>08:00 - 22:00</strong>
            <small>实时锁定空闲时段</small>
          </div>
          <div className="auth-proof-row">
            <span>预约</span>
            <span>签到</span>
            <span>结算</span>
            <span>信用</span>
          </div>
        </div>

        <div className="auth-form-panel">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            style={{ textAlign: 'center', marginBottom: 28 }}
          >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 8,
            background: 'linear-gradient(135deg, #2563eb 0%, #0891b2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 14px',
            boxShadow: '0 12px 28px rgba(37, 99, 235, 0.24)',
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
                        background: 'linear-gradient(135deg, #2563eb 0%, #0891b2 100%)',
                        border: 'none',
                        boxShadow: '0 8px 18px rgba(37, 99, 235, 0.24)',
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
                        background: 'linear-gradient(135deg, #2563eb 0%, #0891b2 100%)',
                        border: 'none',
                        boxShadow: '0 8px 18px rgba(37, 99, 235, 0.24)',
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
        </div>
      </div>
    </Card>
  );
}
