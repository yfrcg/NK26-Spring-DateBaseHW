import { useEffect, useEffectEvent, useState } from 'react';
import { EditOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, InputNumber, Modal, Space, Table, Tag, Typography, message } from 'antd';
import dayjs from 'dayjs';
import { adminApi, creditApi } from '@/api';
import { accountStatusMap, creditEventMap, userTypeMap } from '@/constants/domain';
import type { CreditAdjustRequest, CreditTransaction, User } from '@/types';
import { logError } from '@/utils/logError';

const { Title } = Typography;

export default function AdminCreditsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [adjustTarget, setAdjustTarget] = useState<User | null>(null);
  const [adjusting, setAdjusting] = useState(false);
  const [creditRecords, setCreditRecords] = useState<CreditTransaction[]>([]);
  const [recordsModalOpen, setRecordsModalOpen] = useState(false);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [form] = Form.useForm();

  const fetchUsers = useEffectEvent(async () => {
    setLoading(true);
    try {
      const res = await adminApi.user.list();
      setUsers(res.data.data);
    } catch (error) {
      logError(error);
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    void fetchUsers();
  }, [reloadKey]);

  const handleAdjust = async (values: CreditAdjustRequest) => {
    if (!adjustTarget) {
      return;
    }

    setAdjusting(true);
    try {
      await adminApi.credit.adjust(adjustTarget.userId, {
        changeScore: values.changeScore,
        reason: values.reason,
      });
      message.success('信用调整成功');
      setAdjustModalOpen(false);
      form.resetFields();
      setReloadKey((current) => current + 1);
    } catch (error) {
      logError(error);
    } finally {
      setAdjusting(false);
    }
  };

  const openCreditRecords = async (userId: number) => {
    setRecordsModalOpen(true);
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

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>
        信用管理
      </Title>
      <Card style={{ borderRadius: 8 }}>
        <Table
          columns={[
            { title: 'ID', dataIndex: 'userId', key: 'userId', width: 60 },
            { title: '用户编号', dataIndex: 'userNo', key: 'userNo', width: 120 },
            { title: '姓名', dataIndex: 'realName', key: 'realName', width: 100 },
            {
              title: '类型',
              dataIndex: 'userType',
              key: 'userType',
              width: 100,
              render: (value: string) => <Tag color="blue">{userTypeMap[value] || value}</Tag>,
            },
            {
              title: '信用分',
              dataIndex: 'creditScore',
              key: 'creditScore',
              width: 90,
              render: (value: number) => (
                <span
                  style={{
                    fontWeight: 600,
                    fontSize: 16,
                    color: value >= 80 ? '#52c41a' : value >= 60 ? '#faad14' : '#ff4d4f',
                  }}
                >
                  {value}
                </span>
              ),
            },
            {
              title: '信用等级',
              key: 'creditLevel',
              width: 100,
              render: (_: unknown, record: User) => (
                <Tag color={record.creditScore >= 80 ? 'green' : record.creditScore >= 60 ? 'orange' : 'red'}>
                  {record.creditScore >= 80 ? '优秀' : record.creditScore >= 60 ? '良好' : '偏低'}
                </Tag>
              ),
            },
            {
              title: '状态',
              dataIndex: 'accountStatus',
              key: 'accountStatus',
              width: 110,
              render: (value: string) => {
                const item = accountStatusMap[value] || { color: 'default', text: value };
                return <Tag color={item.color}>{item.text}</Tag>;
              },
            },
            {
              title: '操作',
              key: 'actions',
              width: 180,
              render: (_: unknown, record: User) => (
                <Space size={4}>
                  <Button
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => {
                      setAdjustTarget(record);
                      setAdjustModalOpen(true);
                    }}
                  >
                    调整
                  </Button>
                  <Button
                    size="small"
                    onClick={() => {
                      void openCreditRecords(record.userId);
                    }}
                  >
                    记录
                  </Button>
                </Space>
              ),
            },
          ]}
          dataSource={users}
          rowKey="userId"
          loading={loading}
          pagination={{ pageSize: 15 }}
          scroll={{ x: 980 }}
        />
      </Card>

      <Modal
        title={`信用调整 - ${adjustTarget?.realName || ''}`}
        open={adjustModalOpen}
        onCancel={() => {
          setAdjustModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        width={440}
      >
        <div style={{ marginBottom: 16 }}>
          <span>当前信用分：</span>
          <span
            style={{
              fontWeight: 600,
              fontSize: 18,
              color: (adjustTarget?.creditScore || 0) >= 80 ? '#52c41a' : '#faad14',
            }}
          >
            {adjustTarget?.creditScore}
          </span>
        </div>
        <Form form={form} onFinish={handleAdjust} layout="vertical">
          <Form.Item
            name="changeScore"
            label="变动分值（正数加分，负数扣分）"
            rules={[{ required: true, message: '请输入变动分值' }]}
          >
            <InputNumber style={{ width: '100%' }} placeholder="例如：10 或 -5" />
          </Form.Item>
          <Form.Item name="reason" label="调整原因">
            <Input.TextArea rows={3} placeholder="请输入调整原因" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" loading={adjusting} block>
              确认调整
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="信用变动记录"
        open={recordsModalOpen}
        onCancel={() => setRecordsModalOpen(false)}
        footer={null}
        width={820}
      >
        <Table
          columns={[
            {
              title: '事件类型',
              dataIndex: 'eventType',
              key: 'eventType',
              width: 140,
              render: (value: string) => {
                const item = creditEventMap[value] || { color: 'default', text: value };
                return <Tag color={item.color}>{item.text}</Tag>;
              },
            },
            {
              title: '变动分值',
              dataIndex: 'changeScore',
              key: 'changeScore',
              width: 90,
              render: (value: number) => (
                <span style={{ color: value > 0 ? '#52c41a' : '#ff4d4f', fontWeight: 600 }}>
                  {value > 0 ? `+${value}` : value}
                </span>
              ),
            },
            { title: '变动前', dataIndex: 'beforeScore', key: 'beforeScore', width: 80 },
            { title: '变动后', dataIndex: 'afterScore', key: 'afterScore', width: 80 },
            {
              title: '原因',
              dataIndex: 'reasonText',
              key: 'reasonText',
              ellipsis: true,
              render: (value: string | null) => value || '-',
            },
            {
              title: '时间',
              dataIndex: 'createdAt',
              key: 'createdAt',
              width: 160,
              render: (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm'),
            },
          ]}
          dataSource={creditRecords}
          rowKey="creditTxnId"
          loading={recordsLoading}
          pagination={{ pageSize: 10 }}
          size="small"
        />
      </Modal>
    </div>
  );
}
