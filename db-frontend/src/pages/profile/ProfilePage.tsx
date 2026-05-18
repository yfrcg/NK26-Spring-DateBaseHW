import { useState } from 'react';
import { Avatar, Badge, Button, Card, Col, Descriptions, Divider, Form, Input, message, Modal, Row, Space, Tag, Typography } from 'antd';
import {
  KeyOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { authApi } from '@/api';
import { useAuthStore } from '@/stores/authStore';
import { userTypeMap, accountStatusMap, accountStatusColorMap } from '@/constants/domain';
import type { ChangePasswordRequest } from '@/types';
import { logError } from '@/utils/logError';

const { Title, Text } = Typography;

export default function ProfilePage() {
  const { user, syncUser } = useAuthStore();
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [form] = Form.useForm();

  const handleChangePassword = async (values: ChangePasswordRequest & { confirmPassword: string }) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('两次输入的新密码不一致');
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await authApi.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      syncUser(res.data.data);
      message.success('密码修改成功');
      setPasswordModalOpen(false);
      form.resetFields();
    } catch (error) {
      logError(error);
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!user) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <div style={{ marginBottom: 28 }}>
        <Title level={3} style={{ marginBottom: 4 }}>
          <UserOutlined style={{ marginRight: 8, color: '#2563eb' }} />
          个人信息
        </Title>
        <Text type="secondary">查看和管理您的个人资料</Text>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={8}>
          <Card
            style={{
              borderRadius: 20,
              border: 'none',
              textAlign: 'center',
              overflow: 'hidden',
            }}
            styles={{ body: { padding: '32px 24px' } }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 100,
                background: 'linear-gradient(135deg, #2563eb 0%, #0891b2 100%)',
              }}
            />
            <div style={{ position: 'relative', marginTop: -30 }}>
              <Badge dot status={user.accountStatus === 'ACTIVE' ? 'success' : 'error'} offset={[-4, 56]}>
                <Avatar
                  size={80}
                  icon={<UserOutlined />}
                  style={{
                    background: 'linear-gradient(135deg, #2563eb, #0891b2)',
                    border: '4px solid #fff',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    fontSize: 36,
                  }}
                />
              </Badge>
            </div>
            <div style={{ marginTop: 16 }}>
              <Title level={4} style={{ marginBottom: 4 }}>{user.realName}</Title>
              <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
                编号：{user.userNo}
              </Text>
              <Space>
                <Tag
                  color={user.userType === 'ADMIN' ? 'purple' : 'blue'}
                  style={{ borderRadius: 20, border: 'none', padding: '2px 14px' }}
                >
                  {userTypeMap[user.userType] || user.userType}
                </Tag>
                <Tag
                  color={accountStatusColorMap[user.accountStatus]}
                  style={{ borderRadius: 20, border: 'none', padding: '2px 14px' }}
                >
                  {accountStatusMap[user.accountStatus] || user.accountStatus}
                </Tag>
              </Space>
            </div>

            <Divider />

            <div
              style={{
                background: '#f8fafc',
                borderRadius: 14,
                padding: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
                <SafetyCertificateOutlined style={{ color: '#f59e0b', fontSize: 18 }} />
                <Text style={{ fontSize: 13, color: '#64748b' }}>信用分</Text>
              </div>
              <div
                style={{
                  fontSize: 36,
                  fontWeight: 700,
                  color: (user.creditScore ?? 0) >= 800 ? '#10b981' : (user.creditScore ?? 0) >= 600 ? '#f59e0b' : '#ef4444',
                  lineHeight: 1.2,
                }}
              >
                {user.creditScore ?? '-'}
              </div>
              <Text style={{ fontSize: 11, color: '#94a3b8' }}>/ 1000</Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          <Card
            title={
              <Space>
                <UserOutlined style={{ color: '#2563eb' }} />
                <span style={{ fontWeight: 600 }}>详细信息</span>
              </Space>
            }
            extra={
              <Button
                icon={<KeyOutlined />}
                onClick={() => setPasswordModalOpen(true)}
                style={{ borderRadius: 8 }}
              >
                修改密码
              </Button>
            }
            style={{ borderRadius: 20, border: 'none' }}
          >
            <Descriptions
              column={{ xs: 1, sm: 2 }}
              labelStyle={{ color: '#64748b', fontWeight: 500, width: 120 }}
              contentStyle={{ color: '#1e293b' }}
            >
              <Descriptions.Item label="用户编号">{user.userNo}</Descriptions.Item>
              <Descriptions.Item label="真实姓名">{user.realName}</Descriptions.Item>
              <Descriptions.Item label="用户类型">
                <Tag color={user.userType === 'ADMIN' ? 'purple' : 'blue'} style={{ borderRadius: 20, border: 'none' }}>
                  {userTypeMap[user.userType] || user.userType}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="账户状态">
                <Tag color={accountStatusColorMap[user.accountStatus]} style={{ borderRadius: 20, border: 'none' }}>
                  {accountStatusMap[user.accountStatus] || user.accountStatus}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label={<><PhoneOutlined style={{ marginRight: 4 }} />手机号</>}>
                {user.phone || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={<><MailOutlined style={{ marginRight: 4 }} />邮箱</>}>
                {user.email || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="信用分">
                <Text
                  strong
                  style={{
                    color: (user.creditScore ?? 0) >= 800 ? '#10b981' : (user.creditScore ?? 0) >= 600 ? '#f59e0b' : '#ef4444',
                  }}
                >
                  {user.creditScore ?? '-'} / 1000
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="最后登录">
                {user.lastLoginTime ? new Date(user.lastLoginTime).toLocaleString('zh-CN') : '-'}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>

      <Modal
        title={
          <Space>
            <KeyOutlined style={{ color: '#2563eb' }} />
            <span>修改密码</span>
          </Space>
        }
        open={passwordModalOpen}
        onCancel={() => {
          setPasswordModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        destroyOnClose
        width={420}
      >
        <Form form={form} layout="vertical" onFinish={handleChangePassword} style={{ marginTop: 16 }}>
          <Form.Item
            name="currentPassword"
            label="当前密码"
            rules={[{ required: true, message: '请输入当前密码' }]}
          >
            <Input.Password prefix={<LockOutlined style={{ color: '#9ca3af' }} />} placeholder="当前密码" />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="新密码"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, message: '密码至少 6 位' },
            ]}
          >
            <Input.Password prefix={<LockOutlined style={{ color: '#9ca3af' }} />} placeholder="新密码（至少 6 位）" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="确认新密码"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: '请再次输入新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) return Promise.resolve();
                  return Promise.reject(new Error('两次输入的新密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined style={{ color: '#9ca3af' }} />} placeholder="确认新密码" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={passwordLoading}
              block
              icon={<KeyOutlined />}
              style={{
                height: 44,
                borderRadius: 10,
                fontWeight: 600,
                background: 'linear-gradient(135deg, #2563eb, #0891b2)',
                border: 'none',
              }}
            >
              确认修改
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </motion.div>
  );
}
