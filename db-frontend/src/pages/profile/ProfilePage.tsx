import { useState } from 'react';
import {
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  Input,
  Modal,
  Row,
  Statistic,
  Tag,
  Typography,
  message,
} from 'antd';
import { CalendarOutlined, LockOutlined, SafetyCertificateOutlined, UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { authApi } from '@/api';
import { accountStatusMap, userTypeMap } from '@/constants/domain';
import { useAuthStore } from '@/stores/authStore';
import { logError } from '@/utils/logError';

const { Title } = Typography;

export default function ProfilePage() {
  const { user, syncUser } = useAuthStore();
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [form] = Form.useForm();

  if (!user) {
    return null;
  }

  const statusInfo = accountStatusMap[user.accountStatus] || {
    color: 'default',
    text: user.accountStatus,
  };

  const handleChangePassword = async (values: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('两次输入的新密码不一致');
      return;
    }

    setSavingPassword(true);
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
      setSavingPassword(false);
    }
  };

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>
        个人信息
      </Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={16}>
          <Card style={{ borderRadius: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: '#1890ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 16,
                }}
              >
                <UserOutlined style={{ fontSize: 32, color: '#fff' }} />
              </div>
              <div>
                <Title level={4} style={{ marginBottom: 4 }}>
                  {user.realName}
                </Title>
                <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
                <Tag color="blue">{userTypeMap[user.userType] || user.userType}</Tag>
              </div>
            </div>

            <Descriptions column={{ xs: 1, sm: 2 }} bordered size="small">
              <Descriptions.Item label="用户编号">{user.userNo}</Descriptions.Item>
              <Descriptions.Item label="真实姓名">{user.realName}</Descriptions.Item>
              <Descriptions.Item label="手机号">{user.phone || '-'}</Descriptions.Item>
              <Descriptions.Item label="邮箱">{user.email || '-'}</Descriptions.Item>
              <Descriptions.Item label="用户类型">
                {userTypeMap[user.userType] || user.userType}
              </Descriptions.Item>
              <Descriptions.Item label="账户状态">
                <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="注册时间">
                {dayjs(user.createdAt).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
              <Descriptions.Item label="最后登录">
                {user.lastLoginTime ? dayjs(user.lastLoginTime).format('YYYY-MM-DD HH:mm:ss') : '-'}
              </Descriptions.Item>
            </Descriptions>

            <Button icon={<LockOutlined />} style={{ marginTop: 16 }} onClick={() => setPasswordModalOpen(true)}>
              修改密码
            </Button>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card style={{ borderRadius: 8, textAlign: 'center' }}>
            <Statistic
              title="信用分数"
              value={user.creditScore}
              prefix={<SafetyCertificateOutlined />}
              valueStyle={{
                color: user.creditScore >= 80 ? '#52c41a' : user.creditScore >= 60 ? '#faad14' : '#ff4d4f',
                fontSize: 36,
              }}
            />
            <div style={{ marginTop: 12 }}>
              <Tag color={user.creditScore >= 80 ? 'green' : user.creditScore >= 60 ? 'orange' : 'red'}>
                {user.creditScore >= 80 ? '信用优秀' : user.creditScore >= 60 ? '信用良好' : '信用偏低'}
              </Tag>
            </div>
          </Card>
          <Card style={{ borderRadius: 8, marginTop: 16, textAlign: 'center' }}>
            <Statistic
              title="账户创建日"
              value={dayjs(user.createdAt).format('YYYY-MM-DD')}
              prefix={<CalendarOutlined />}
              valueStyle={{ fontSize: 16 }}
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title="修改密码"
        open={passwordModalOpen}
        onCancel={() => {
          setPasswordModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        width={420}
      >
        <Form form={form} layout="vertical" onFinish={handleChangePassword} style={{ marginTop: 16 }}>
          <Form.Item
            name="currentPassword"
            label="当前密码"
            rules={[{ required: true, message: '请输入当前密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="新密码"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, message: '新密码至少 6 位' },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="确认新密码"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: '请再次输入新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的新密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" loading={savingPassword} block>
              保存新密码
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
