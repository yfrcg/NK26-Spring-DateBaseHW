import { useEffect, useState } from 'react';
import { Button, Card, Col, Empty, Form, Input, InputNumber, message, Modal, Row, Space, Statistic, Table, Tag, Typography } from 'antd';
import {
  EditOutlined,
  FileTextOutlined,
  HistoryOutlined,
  PlusOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { adminApi, userApi, creditApi } from '@/api';
import { creditEventMap, creditEventColorMap } from '@/constants/domain';
import type { User, CreditTransaction, CreditAdjustRequest } from '@/types';
import { logError } from '@/utils/logError';

const { Title, Text } = Typography;

export default function AdminCreditsPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [creditRecords, setCreditRecords] = useState<CreditTransaction[]>([]);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [adjustLoading, setAdjustLoading] = useState(false);
  const [form] = Form.useForm();

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await userApi.listUsers();
      setUsers(res.data.data);
    } catch (error) {
      logError(error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecords = async (userId: number) => {
    setRecordsLoading(true);
    try {
      const res = await creditApi.listByUser(userId);
      setCreditRecords(res.data.data);
    } catch (error) {
      logError(error);
    } finally {
      setRecordsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      loadRecords(selectedUserId);
    }
  }, [selectedUserId]);

  const handleAdjust = async (values: CreditAdjustRequest) => {
    if (!selectedUserId) return;
    setAdjustLoading(true);
    try {
      await adminApi.credit.adjust(selectedUserId, values);
      message.success('信用分调整成功');
      setAdjustModalOpen(false);
      form.resetFields();
      await Promise.all([loadUsers(), loadRecords(selectedUserId)]);
    } catch (error) {
      logError(error);
    } finally {
      setAdjustLoading(false);
    }
  };

  const selectedUser = users.find((u) => u.userId === selectedUserId);

  const userColumns: ColumnsType<User> = [
    { title: '编号', dataIndex: 'userNo', width: 100, render: (v) => <Text strong style={{ fontFamily: 'monospace' }}>{v}</Text> },
    { title: '姓名', dataIndex: 'realName', width: 90 },
    {
      title: '信用分',
      dataIndex: 'creditScore',
      width: 90,
      render: (v) => (
        <Text strong style={{ color: v >= 800 ? '#10b981' : v >= 600 ? '#f59e0b' : '#ef4444' }}>
          {v ?? '-'}
        </Text>
      ),
    },
    {
      title: '操作',
      width: 100,
      render: (_, r) => (
        <Button
          type={selectedUserId === r.userId ? 'primary' : 'default'}
          size="small"
          icon={<FileTextOutlined />}
          onClick={() => setSelectedUserId(r.userId)}
          style={{ borderRadius: 8 }}
        >
          查看
        </Button>
      ),
    },
  ];

  const recordColumns: ColumnsType<CreditTransaction> = [
    {
      title: '事件类型',
      dataIndex: 'eventType',
      width: 130,
      render: (v) => (
        <Tag color={creditEventColorMap[v] || 'default'} style={{ borderRadius: 20, border: 'none', fontWeight: 500 }}>
          {creditEventMap[v] || v}
        </Tag>
      ),
    },
    {
      title: '变动分值',
      dataIndex: 'changeScore',
      width: 100,
      render: (v) => (
        <Text strong style={{ color: v > 0 ? '#10b981' : '#ef4444', fontSize: 14 }}>
          {v > 0 ? '+' : ''}{v}
        </Text>
      ),
    },
    {
      title: '变动前',
      dataIndex: 'beforeScore',
      width: 80,
      render: (v) => <Text type="secondary">{v}</Text>,
    },
    {
      title: '变动后',
      dataIndex: 'afterScore',
      width: 80,
      render: (v) => <Text strong>{v}</Text>,
    },
    { title: '原因', dataIndex: 'reasonText', ellipsis: true, render: (v) => v || '-' },
    {
      title: '时间',
      dataIndex: 'createdAt',
      width: 170,
      render: (v) => v ? dayjs(v).format('YYYY-MM-DD HH:mm:ss') : '-',
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <Title level={3} style={{ marginBottom: 4 }}>
            <SafetyCertificateOutlined style={{ marginRight: 8, color: '#4f46e5' }} />
            信用分管理
          </Title>
          <Text type="secondary">查看用户信用记录，手动调整信用分</Text>
        </div>
        <Space>
          {selectedUserId && (
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => setAdjustModalOpen(true)}
              style={{
                borderRadius: 8,
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                border: 'none',
              }}
            >
              调整信用分
            </Button>
          )}
          <Button icon={<ReloadOutlined />} onClick={loadUsers} style={{ borderRadius: 8 }}>
            刷新
          </Button>
        </Space>
      </div>

      <Row gutter={[20, 20]}>
        <Col xs={24} lg={10}>
          <Card
            title={
              <Space>
                <UserOutlined style={{ color: '#4f46e5' }} />
                <span style={{ fontWeight: 600 }}>用户列表</span>
              </Space>
            }
            style={{ borderRadius: 16, border: 'none' }}
            styles={{ body: { padding: 0 } }}
          >
            <Table
              columns={userColumns}
              dataSource={users}
              rowKey="userId"
              loading={loading}
              pagination={{ pageSize: 8, showSizeChanger: false }}
              size="small"
              onRow={(r) => ({
                onClick: () => setSelectedUserId(r.userId),
                style: {
                  cursor: 'pointer',
                  background: selectedUserId === r.userId ? '#eef2ff' : undefined,
                },
              })}
            />
          </Card>
        </Col>

        <Col xs={24} lg={14}>
          {selectedUserId && selectedUser ? (
            <motion.div
              key={selectedUserId}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
            >
              <Card
                style={{ borderRadius: 16, border: 'none', marginBottom: 20 }}
                styles={{ body: { padding: '20px 24px' } }}
              >
                <Row gutter={16} align="middle">
                  <Col>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 14,
                        background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: 20,
                      }}
                    >
                      <UserOutlined />
                    </div>
                  </Col>
                  <Col flex="1">
                    <Text strong style={{ fontSize: 16, display: 'block' }}>{selectedUser.realName}</Text>
                    <Text type="secondary" style={{ fontSize: 13 }}>编号：{selectedUser.userNo}</Text>
                  </Col>
                  <Col>
                    <Statistic
                      title={<span style={{ fontSize: 11, color: '#64748b' }}>信用分</span>}
                      value={selectedUser.creditScore ?? 0}
                      suffix="/ 1000"
                      valueStyle={{
                        fontSize: 28,
                        fontWeight: 700,
                        color: (selectedUser.creditScore ?? 0) >= 800 ? '#10b981' : (selectedUser.creditScore ?? 0) >= 600 ? '#f59e0b' : '#ef4444',
                      }}
                    />
                  </Col>
                </Row>
              </Card>

              <Card
                title={
                  <Space>
                    <HistoryOutlined style={{ color: '#4f46e5' }} />
                    <span style={{ fontWeight: 600 }}>信用变动记录</span>
                  </Space>
                }
                style={{ borderRadius: 16, border: 'none' }}
                styles={{ body: { padding: 0 } }}
              >
                <Table
                  columns={recordColumns}
                  dataSource={creditRecords}
                  rowKey="creditTxnId"
                  loading={recordsLoading}
                  pagination={{ pageSize: 8, showTotal: (t) => `共 ${t} 条记录`, showSizeChanger: false }}
                  size="small"
                  locale={{ emptyText: <Empty description="暂无信用变动记录" /> }}
                />
              </Card>
            </motion.div>
          ) : (
            <Card style={{ borderRadius: 16, border: 'none', height: 400 }} styles={{ body: { display: 'flex', alignItems: 'center', justifyContent: 'center' } }}>
              <Empty description="请从左侧选择一个用户" />
            </Card>
          )}
        </Col>
      </Row>

      <Modal
        title={
          <Space>
            <EditOutlined style={{ color: '#4f46e5' }} />
            <span>调整信用分 · {selectedUser?.realName}</span>
          </Space>
        }
        open={adjustModalOpen}
        onCancel={() => setAdjustModalOpen(false)}
        footer={null}
        destroyOnClose
        width={440}
      >
        <div style={{ margin: '12px 0 16px', padding: '12px 16px', background: '#f8fafc', borderRadius: 10, fontSize: 13, color: '#64748b' }}>
          当前信用分：<Text strong style={{ color: (selectedUser?.creditScore ?? 0) >= 800 ? '#10b981' : '#f59e0b', fontSize: 18 }}>
            {selectedUser?.creditScore ?? 0}
          </Text> / 1000
        </div>
        <Form form={form} layout="vertical" onFinish={handleAdjust}>
          <Form.Item name="changeScore" label="变动分值" rules={[{ required: true, message: '请输入变动分值' }]}>
            <InputNumber
              style={{ width: '100%' }}
              min={-1000}
              max={1000}
              addonBefore={<PlusOutlined />}
              placeholder="正数为加分，负数为扣分"
            />
          </Form.Item>
          <Form.Item name="reason" label="原因说明" rules={[{ required: true, message: '请输入原因' }]}>
            <Input.TextArea rows={3} placeholder="请说明调整原因" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={adjustLoading}
              block
              icon={<SafetyCertificateOutlined />}
              style={{
                height: 44,
                borderRadius: 10,
                fontWeight: 600,
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                border: 'none',
              }}
            >
              确认调整
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </motion.div>
  );
}
