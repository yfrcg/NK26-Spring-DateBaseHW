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
import { userApi, creditApi } from '@/api';
import { creditEventMap, creditEventColorMap } from '@/constants/domain';
import type { User, CreditTransaction, CreditAdjustRequest } from '@/types';
import { logError } from '@/utils/logError';
import { pageVariants } from '@/constants/motionVariants';
import PageHeader from '@/components/PageHeader';

const { Text } = Typography;

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
      const res = await creditApi.listTransactions(userId);
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
      await creditApi.manualAdjust(selectedUserId, values);
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
    { title: '编号', dataIndex: 'userNo', width: 100, render: (v) => <Text strong className="monospace-code">{v}</Text> },
    { title: '姓名', dataIndex: 'realName', width: 90 },
    {
      title: '信用分',
      dataIndex: 'creditScore',
      width: 90,
      render: (v) => {
        const isExcellent = (v ?? 0) >= 80;
        const isFair = (v ?? 0) >= 60;
        const color = isExcellent ? 'var(--emerald)' : isFair ? 'var(--amber)' : 'var(--danger)';
        return (
          <Text strong style={{ color }}>
            {v ?? '-'}
          </Text>
        );
      },
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
        >
          查看
        </Button>
      ),
    },
  ];

  const recordColumns: ColumnsType<CreditTransaction> = [
    {
      title: '事件类型',
      dataIndex: 'txnType',
      width: 130,
      render: (v) => (
        <Tag color={creditEventColorMap[v] || 'default'} className="status-tag">
          {creditEventMap[v] || v}
        </Tag>
      ),
    },
    {
      title: '变动分值',
      dataIndex: 'creditDelta',
      width: 100,
      render: (v) => (
        <Text strong style={{ color: (v ?? 0) > 0 ? 'var(--emerald)' : 'var(--danger)', fontSize: 14 }}>
          {v != null && v > 0 ? '+' : ''}{v ?? '-'}
        </Text>
      ),
    },
    {
      title: '变动前',
      dataIndex: 'beforeScore',
      width: 80,
      render: (v) => <Text type="secondary">{v ?? '-'}</Text>,
    },
    {
      title: '变动后',
      dataIndex: 'afterScore',
      width: 80,
      render: (v) => <Text strong>{v ?? '-'}</Text>,
    },
    { title: '备注', dataIndex: 'remark', ellipsis: true, render: (v) => v || '-' },
    {
      title: '时间',
      dataIndex: 'createdAt',
      width: 170,
      render: (v) => v ? dayjs(v).format('YYYY-MM-DD HH:mm:ss') : '-',
    },
  ];

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="page-enter"
    >
      <PageHeader
        title="信用分管理"
        subtitle="查看用户信用记录，手动调整信用分"
        action={
          <Space>
            {selectedUserId && (
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => setAdjustModalOpen(true)}
                className="primary-gradient-btn"
              >
                调整信用分
              </Button>
            )}
            <Button icon={<ReloadOutlined />} onClick={loadUsers} className="btn-refresh">
              刷新
            </Button>
          </Space>
        }
      />

      <Row gutter={[20, 20]}>
        <Col xs={24} lg={10}>
          <Card
            title={
              <Space>
                <UserOutlined style={{ color: 'var(--primary)' }} />
                <span style={{ fontWeight: 600 }}>用户列表</span>
              </Space>
            }
            className="admin-table-card"
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
                className: selectedUserId === r.userId ? 'selected-row' : '',
                style: { cursor: 'pointer' }
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
                className="admin-table-card"
                style={{ marginBottom: 20 }}
                styles={{ body: { padding: '20px 24px' } }}
              >
                <Row gutter={16} align="middle">
                  <Col>
                    <div className="credit-user-avatar">
                      <UserOutlined />
                    </div>
                  </Col>
                  <Col flex="1">
                    <Text strong style={{ fontSize: 16, display: 'block' }}>{selectedUser.realName}</Text>
                    <Text type="secondary" style={{ fontSize: 13 }}>编号：{selectedUser.userNo}</Text>
                  </Col>
                  <Col>
                    <Statistic
                      title={<span style={{ fontSize: 11, color: 'var(--muted)' }}>信用分</span>}
                      value={selectedUser.creditScore ?? 0}
                      suffix="/ 100"
                      valueStyle={{
                        fontSize: 28,
                        fontWeight: 700,
                        color: (selectedUser.creditScore ?? 0) >= 80 ? 'var(--emerald)' : (selectedUser.creditScore ?? 0) >= 60 ? 'var(--amber)' : 'var(--danger)',
                      }}
                    />
                  </Col>
                </Row>
              </Card>

              <Card
                title={
                  <Space>
                    <HistoryOutlined style={{ color: 'var(--primary)' }} />
                    <span style={{ fontWeight: 600 }}>信用变动记录</span>
                  </Space>
                }
                className="admin-table-card"
                styles={{ body: { padding: 0 } }}
              >
                <Table
                  columns={recordColumns}
                  dataSource={creditRecords}
                  rowKey="txnId"
                  loading={recordsLoading}
                  pagination={{ pageSize: 8, showTotal: (t) => `共 ${t} 条记录`, showSizeChanger: false }}
                  size="small"
                  locale={{ emptyText: <Empty description="暂无信用变动记录" /> }}
                />
              </Card>
            </motion.div>
          ) : (
            <Card className="admin-table-card" style={{ height: 400 }} styles={{ body: { display: 'flex', alignItems: 'center', justifyContent: 'center' } }}>
              <Empty description="请从左侧选择一个用户" />
            </Card>
          )}
        </Col>
      </Row>

      <Modal
        title={
          <Space>
            <EditOutlined style={{ color: 'var(--primary)' }} />
            <span>调整信用分 · {selectedUser?.realName}</span>
          </Space>
        }
        open={adjustModalOpen}
        onCancel={() => setAdjustModalOpen(false)}
        footer={null}
        destroyOnClose
        width={440}
      >
        <div style={{ margin: '12px 0 16px', padding: '12px 16px', background: 'var(--surface-soft)', borderRadius: 'var(--radius)', fontSize: 13, color: 'var(--muted)' }}>
          当前信用分：<Text strong style={{ color: (selectedUser?.creditScore ?? 0) >= 80 ? 'var(--emerald)' : 'var(--amber)', fontSize: 18 }}>
            {selectedUser?.creditScore ?? 0}
          </Text> / 100
        </div>
        <Form form={form} layout="vertical" onFinish={handleAdjust}>
          <Form.Item name="changeScore" label="变动分值" rules={[{ required: true, message: '请输入变动分值' }]}>
            <InputNumber
              style={{ width: '100%', borderRadius: 'var(--radius-sm)' }}
              min={-100}
              max={100}
              addonBefore={<PlusOutlined />}
              placeholder="正数为加分，负数为扣分"
            />
          </Form.Item>
          <Form.Item name="reason" label="原因说明" rules={[{ required: true, message: '请输入原因' }]}>
            <Input.TextArea rows={3} placeholder="请说明调整原因" style={{ borderRadius: 'var(--radius-sm)' }} />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={adjustLoading}
              block
              icon={<SafetyCertificateOutlined />}
              className="primary-gradient-btn"
              style={{ height: 44 }}
            >
              确认调整
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </motion.div>
  );
}
