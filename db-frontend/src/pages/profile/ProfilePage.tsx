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
import { pageVariants } from '@/constants/motionVariants';
import PageHeader from '@/components/PageHeader';

const { Text } = Typography;

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

  // Credit score helper styling (0-100 scale)
  const isCreditExcellent = (user.creditScore ?? 0) >= 80;
  const isCreditFair = (user.creditScore ?? 0) >= 60;
  const creditColor = isCreditExcellent ? 'var(--emerald)' : isCreditFair ? 'var(--amber)' : 'var(--danger)';

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="page-enter"
    >
      <PageHeader
        title="个人信息"
        subtitle="查看和管理您的个人资料"
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={8}>
          <Card className="profile-card" styles={{ body: { padding: '32px 24px' } }}>
            <div className="profile-banner" />
            <div className="profile-avatar-section">
              <Badge dot status={user.accountStatus === 'ACTIVE' ? 'success' : 'error'} offset={[-4, 56]}>
                <Avatar
                  size={80}
                  icon={<UserOutlined />}
                  style={{
                    background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
                    border: '4px solid #fff',
                    boxShadow: 'var(--shadow-sm)',
                    fontSize: 36,
                  }}
                />
              </Badge>
            </div>

            <div style={{ marginTop: 16, textAlign: 'center' }}>
              <Typography.Title level={4} style={{ marginBottom: 4 }}>{user.realName}</Typography.Title>
              <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
                编号：{user.userNo}
              </Text>
              <Space>
                <Tag
                  color={user.userType === 'ADMIN' ? 'purple' : 'blue'}
                  className="status-tag"
                >
                  {userTypeMap[user.userType] || user.userType}
                </Tag>
                <Tag
                  color={accountStatusColorMap[user.accountStatus]}
                  className="status-tag"
                >
                  {accountStatusMap[user.accountStatus] || user.accountStatus}
                </Tag>
              </Space>
            </div>

            <Divider />

            <div className="credit-score-display">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
                <SafetyCertificateOutlined style={{ color: 'var(--amber)', fontSize: 18 }} />
                <Text style={{ fontSize: 13, color: 'var(--muted)' }}>信用分</Text>
              </div>
              <div
                style={{
                  fontSize: 36,
                  fontWeight: 700,
                  color: creditColor,
                  lineHeight: 1.2,
                }}
              >
                {user.creditScore ?? '-'}
              </div>
              <Text style={{ fontSize: 11, color: 'var(--muted)' }}>/ 100 分</Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          <Card
            className="profile-info-card"
            title={
              <Space>
                <UserOutlined style={{ color: 'var(--primary)' }} />
                <span style={{ fontWeight: 600 }}>详细信息</span>
              </Space>
            }
            extra={
              <Button
                icon={<KeyOutlined />}
                onClick={() => setPasswordModalOpen(true)}
                className="btn-action-outline"
              >
                修改密码
              </Button>
            }
          >
            <Descriptions
              column={{ xs: 1, sm: 2 }}
              labelStyle={{ color: 'var(--muted)', fontWeight: 500, width: 120 }}
              contentStyle={{ color: 'var(--ink)' }}
            >
              <Descriptions.Item label="用户编号">{user.userNo}</Descriptions.Item>
              <Descriptions.Item label="真实姓名">{user.realName}</Descriptions.Item>
              <Descriptions.Item label="用户类型">
                <Tag color={user.userType === 'ADMIN' ? 'purple' : 'blue'} className="status-tag">
                  {userTypeMap[user.userType] || user.userType}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="账户状态">
                <Tag color={accountStatusColorMap[user.accountStatus]} className="status-tag">
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
                <Text strong style={{ color: creditColor }}>
                  {user.creditScore ?? '-'} / 100 分
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
            <KeyOutlined style={{ color: 'var(--primary)' }} />
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
            <Input.Password prefix={<LockOutlined style={{ color: 'var(--muted)' }} />} placeholder="当前密码" />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="新密码"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, message: '密码至少 6 位' },
            ]}
          >
            <Input.Password prefix={<LockOutlined style={{ color: 'var(--muted)' }} />} placeholder="新密码（至少 6 位）" />
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
            <Input.Password prefix={<LockOutlined style={{ color: 'var(--muted)' }} />} placeholder="确认新密码" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={passwordLoading}
              block
              icon={<KeyOutlined />}
              className="primary-gradient-btn"
              style={{ height: 44 }}
            >
              确认修改
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </motion.div>
  );
}
