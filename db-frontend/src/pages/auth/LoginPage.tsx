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
      message.success('登录成功，欢迎回来');
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
    <Card className="auth-card-shell" styles={{ body: { padding: 0 } }}>
      <div className="auth-card-grid">
        <div className="auth-visual-panel">
          <div className="auth-brand-mark">
            <SafetyCertificateOutlined />
          </div>
          <div>
            <Title level={2} style={{ color: '#fff', margin: 0, fontWeight: 800 }}>
              共享空间预约
            </Title>
            <Text style={{ display: 'block', marginTop: 12, maxWidth: 380, color: 'rgba(255,255,255,0.78)', fontSize: 15 }}>
              面向自习室、会议室、路演厅和创客空间的预约、签到、计费与信用管理平台。
            </Text>
          </div>
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
            transition={{ duration: 0.32 }}
            style={{ marginBottom: 26 }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                display: 'grid',
                placeItems: 'center',
                marginBottom: 16,
                borderRadius: 8,
                color: '#fff',
                fontSize: 24,
                background: 'linear-gradient(135deg, #0f9f8f 0%, #22b8cf 100%)',
              }}
            >
              <SafetyCertificateOutlined />
            </div>
            <Title level={3} style={{ margin: 0, color: '#172033', fontWeight: 800 }}>
              登录系统
            </Title>
            <Text type="secondary">使用账号进入共享空间预约工作台</Text>
          </motion.div>

          <div className="demo-account">
            <strong>演示账号：</strong>admin / admin123456
          </div>

          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              {
                key: 'login',
                label: '登录',
                children: (
                  <Form onFinish={handleLogin} size="large" autoComplete="off" layout="vertical">
                    <Form.Item name="userNo" rules={[{ required: true, message: '请输入用户编号' }]}>
                      <Input prefix={<UserOutlined />} placeholder="用户编号，例如 admin" />
                    </Form.Item>
                    <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
                      <Input.Password prefix={<LockOutlined />} placeholder="密码" />
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
                    <Form.Item name="userNo" rules={[{ required: true, message: '请输入用户编号' }]}>
                      <Input prefix={<UserOutlined />} placeholder="用户编号（学号/工号）" />
                    </Form.Item>
                    <Form.Item name="realName" rules={[{ required: true, message: '请输入真实姓名' }]}>
                      <Input prefix={<UserOutlined />} placeholder="真实姓名" />
                    </Form.Item>
                    <Form.Item name="phone">
                      <Input prefix={<PhoneOutlined />} placeholder="手机号（选填）" />
                    </Form.Item>
                    <Form.Item name="email">
                      <Input prefix={<MailOutlined />} placeholder="邮箱（选填）" />
                    </Form.Item>
                    <Form.Item name="userType" initialValue="STUDENT">
                      <Select options={registerUserTypeOptions} />
                    </Form.Item>
                    <Form.Item
                      name="password"
                      rules={[
                        { required: true, message: '请输入密码' },
                        { min: 6, message: '密码至少 6 位' },
                      ]}
                    >
                      <Input.Password prefix={<LockOutlined />} placeholder="密码，至少 6 位" />
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
                      <Input.Password prefix={<LockOutlined />} placeholder="确认密码" />
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
        </div>
      </div>
    </Card>
  );
}
