import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Empty,
  Form,
  InputNumber,
  message,
  Modal,
  Row,
  Space,
  Spin,
  Statistic,
  Table,
  Tag,
  Typography,
} from 'antd';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DollarOutlined,
  HistoryOutlined,
  LockOutlined,
  PlusOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { accountApi } from '@/api';
import { txnTypeMap, txnDirectionMap } from '@/constants/domain';
import { useAuthStore } from '@/stores/authStore';
import type { AccountTransaction, RechargeRequest, UserAccount } from '@/types';
import { logError } from '@/utils/logError';

const { Title, Text } = Typography;

export default function AccountPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState<UserAccount | null>(null);
  const [transactions, setTransactions] = useState<AccountTransaction[]>([]);
  const [rechargeModalOpen, setRechargeModalOpen] = useState(false);
  const [rechargeLoading, setRechargeLoading] = useState(false);
  const [form] = Form.useForm();

  const load = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [accRes, txRes] = await Promise.all([
        accountApi.getAccount(user.userId),
        accountApi.listTransactions(user.userId),
      ]);
      setAccount(accRes.data.data);
      setTransactions(txRes.data.data);
    } catch (error) {
      logError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [user]);

  const handleRecharge = async (values: RechargeRequest) => {
    if (!user) return;
    setRechargeLoading(true);
    try {
      await accountApi.recharge(user.userId, values);
      message.success(`充值成功 ¥${values.amount.toFixed(2)}`);
      setRechargeModalOpen(false);
      form.resetFields();
      await load();
    } catch (error) {
      logError(error);
    } finally {
      setRechargeLoading(false);
    }
  };

  const columns: ColumnsType<AccountTransaction> = [
    {
      title: '流水编号',
      dataIndex: 'txnNo',
      width: 180,
      render: (v) => (
        <Text copyable style={{ fontFamily: 'monospace', fontSize: 12 }}>
          {v}
        </Text>
      ),
    },
    {
      title: '类型',
      dataIndex: 'txnType',
      width: 100,
      render: (v) => (
        <Tag color={v === 'RECHARGE' ? 'green' : v === 'CONSUME' ? 'orange' : v === 'REFUND' ? 'blue' : 'default'} style={{ borderRadius: 20, border: 'none' }}>
          {txnTypeMap[v] || v}
        </Tag>
      ),
    },
    {
      title: '方向',
      dataIndex: 'direction',
      width: 80,
      render: (v) => (
        <Tag
          icon={v === 'IN' ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
          color={v === 'IN' ? 'success' : 'error'}
          style={{ borderRadius: 20, border: 'none' }}
        >
          {txnDirectionMap[v] || v}
        </Tag>
      ),
    },
    {
      title: '金额',
      dataIndex: 'amount',
      width: 120,
      render: (v, r) => (
        <Text strong style={{ color: r.direction === 'IN' ? '#10b981' : '#ef4444', fontSize: 14 }}>
          {r.direction === 'IN' ? '+' : '-'}¥{v?.toFixed(2)}
        </Text>
      ),
    },
    {
      title: '变动前余额',
      dataIndex: 'beforeBalance',
      width: 120,
      render: (v) => <Text type="secondary">¥{v?.toFixed(2)}</Text>,
    },
    {
      title: '变动后余额',
      dataIndex: 'afterBalance',
      width: 120,
      render: (v) => <Text strong>¥{v?.toFixed(2)}</Text>,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      ellipsis: true,
    },
    {
      title: '时间',
      dataIndex: 'createdAt',
      width: 170,
      render: (v) => dayjs(v).format('YYYY-MM-DD HH:mm:ss'),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <div style={{ marginBottom: 28 }}>
        <Title level={3} style={{ marginBottom: 4 }}>
          <WalletOutlined style={{ marginRight: 8, color: '#4f46e5' }} />
          账户中心
        </Title>
        <Text type="secondary">管理您的账户余额、查看交易流水</Text>
      </div>

      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={8}>
          <Card
            style={{
              borderRadius: 20,
              border: 'none',
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              color: '#fff',
              overflow: 'hidden',
              position: 'relative',
            }}
            styles={{ body: { padding: '28px' } }}
          >
            <div
              style={{
                position: 'absolute',
                top: -30,
                right: -30,
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
              }}
            />
            <div style={{ position: 'relative' }}>
              <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 4 }}>
                <WalletOutlined style={{ marginRight: 6 }} />
                可用余额
              </div>
              <div style={{ fontSize: 38, fontWeight: 700, lineHeight: 1.2, marginBottom: 20 }}>
                ¥{account?.balance?.toFixed(2) || '0.00'}
              </div>
              <Button
                ghost
                icon={<PlusOutlined />}
                onClick={() => setRechargeModalOpen(true)}
                style={{
                  borderRadius: 10,
                  borderColor: 'rgba(255,255,255,0.4)',
                  color: '#fff',
                  fontWeight: 500,
                }}
              >
                充值
              </Button>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          <Row gutter={[16, 16]}>
            {[
              { title: '冻结金额', value: account?.frozenAmount || 0, icon: <LockOutlined />, color: '#f59e0b', prefix: '¥' },
              { title: '欠费金额', value: account?.arrearsAmount || 0, icon: <DollarOutlined />, color: '#ef4444', prefix: '¥' },
              { title: '累计充值', value: account?.totalRecharge || 0, icon: <ArrowDownOutlined />, color: '#10b981', prefix: '¥' },
              { title: '累计消费', value: account?.totalSpend || 0, icon: <ArrowUpOutlined />, color: '#6366f1', prefix: '¥' },
            ].map((item, i) => (
              <Col xs={12} key={i}>
                <Card
                  style={{ borderRadius: 16, border: 'none', height: '100%' }}
                  styles={{ body: { padding: '20px' } }}
                >
                  <Statistic
                    title={
                      <span style={{ fontSize: 12, color: '#64748b' }}>
                        {item.icon} {item.title}
                      </span>
                    }
                    value={item.value}
                    precision={2}
                    prefix={item.prefix}
                    valueStyle={{ fontSize: 24, fontWeight: 700, color: item.color }}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>

      <Card
        title={
          <Space>
            <HistoryOutlined style={{ color: '#4f46e5' }} />
            <span style={{ fontWeight: 600 }}>交易流水</span>
          </Space>
        }
        style={{ borderRadius: 16, border: 'none' }}
        styles={{ body: { padding: 0 } }}
      >
        <Table
          columns={columns}
          dataSource={transactions}
          rowKey="txnId"
          pagination={{ pageSize: 8, showTotal: (t) => `共 ${t} 条记录`, showSizeChanger: false }}
          scroll={{ x: 1000 }}
          locale={{ emptyText: <Empty description="暂无交易记录" /> }}
        />
      </Card>

      <Modal
        title={
          <Space>
            <DollarOutlined style={{ color: '#4f46e5' }} />
            <span>账户充值</span>
          </Space>
        }
        open={rechargeModalOpen}
        onCancel={() => setRechargeModalOpen(false)}
        footer={null}
        destroyOnClose
        width={400}
      >
        <Form form={form} layout="vertical" onFinish={handleRecharge} style={{ marginTop: 16 }}>
          <Form.Item name="amount" label="充值金额（元）" rules={[{ required: true, message: '请输入金额' }, { type: 'number', min: 0.01, message: '金额必须大于 0' }]}>
            <InputNumber min={0.01} step={100} precision={2} style={{ width: '100%' }} size="large" prefix="¥" />
          </Form.Item>
          <Space wrap style={{ marginBottom: 16 }}>
            {[50, 100, 200, 500].map((v) => (
              <Button key={v} onClick={() => form.setFieldsValue({ amount: v })}>
                ¥{v}
              </Button>
            ))}
          </Space>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={rechargeLoading}
              block
              icon={<DollarOutlined />}
              style={{
                height: 44,
                borderRadius: 10,
                fontWeight: 600,
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                border: 'none',
              }}
            >
              确认充值
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </motion.div>
  );
}
