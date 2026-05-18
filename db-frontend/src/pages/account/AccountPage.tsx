import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Col,
  InputNumber,
  message,
  Modal,
  Row,
  Space as AntSpace,
  Statistic,
  Table,
  Tag,
  Typography,
} from 'antd';
import {
  AccountBookOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  DollarOutlined,
  PlusOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { accountApi } from '@/api';
import { useAuthStore } from '@/stores/authStore';
import type { Transaction, UserAccount } from '@/types';
import { logError } from '@/utils/logError';

const { Title, Text } = Typography;

const txnTypeMap: Record<string, string> = {
  RECHARGE: '充值',
  CONSUME: '消费',
  REFUND: '退款',
  ADJUST: '调整',
  NO_SHOW: '爽约',
  OVERTIME: '超时',
  HOLD_TIMEOUT: '暂离超时',
  MANUAL_RESTORE: '手动恢复',
};

export default function AccountPage() {
  const { user } = useAuthStore();
  const [account, setAccount] = useState<UserAccount | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [rechargeOpen, setRechargeOpen] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState<number>(100);
  const [recharging, setRecharging] = useState(false);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [accRes, txnRes] = await Promise.all([
        accountApi.getAccount(user.userId),
        accountApi.getTransactions(user.userId),
      ]);
      setAccount(accRes.data.data);
      setTransactions(txnRes.data.data);
    } catch (error) {
      logError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleRecharge = async () => {
    if (!user || !rechargeAmount || rechargeAmount <= 0) return;
    setRecharging(true);
    try {
      await accountApi.recharge(user.userId, { amount: rechargeAmount });
      message.success(`充值成功！已充入 ¥${rechargeAmount.toFixed(2)}`);
      setRechargeOpen(false);
      fetchData();
    } catch (error) {
      logError(error);
    } finally {
      setRecharging(false);
    }
  };

  const columns = [
    {
      title: '时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (v: string) => new Date(v).toLocaleString('zh-CN'),
    },
    {
      title: '类型',
      dataIndex: 'txnType',
      key: 'txnType',
      width: 120,
      render: (v: string) => <Tag>{txnTypeMap[v] || v}</Tag>,
    },
    {
      title: '方向',
      dataIndex: 'direction',
      key: 'direction',
      width: 80,
      render: (v: string) =>
        v === 'IN' ? (
          <Tag icon={<ArrowUpOutlined />} color="success">收入</Tag>
        ) : v === 'OUT' ? (
          <Tag icon={<ArrowDownOutlined />} color="error">支出</Tag>
        ) : (
          <Tag>—</Tag>
        ),
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (_: number | undefined, r: Transaction) =>
        r.amount != null ? (
          <Text style={{ color: r.direction === 'IN' ? '#10b981' : '#ef4444', fontWeight: 600 }}>
            {r.direction === 'IN' ? '+' : '-'}¥{r.amount.toFixed(2)}
          </Text>
        ) : r.creditDelta != null ? (
          <Text style={{ color: r.direction === 'IN' ? '#10b981' : '#ef4444', fontWeight: 600 }}>
            {r.direction === 'IN' ? '+' : ''}{r.creditDelta}分
          </Text>
        ) : (
          <Text type="secondary">—</Text>
        ),
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      ellipsis: true,
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div style={{ marginBottom: 28 }}>
        <Title level={3} style={{ marginBottom: 4 }}>
          <WalletOutlined style={{ marginRight: 8, color: '#2563eb' }} />
          我的钱包
        </Title>
        <Text type="secondary">查看账户余额、充值及交易明细</Text>
      </div>

      <Row gutter={20} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 16, border: 'none' }} styles={{ body: { padding: '24px' } }}>
            <Statistic
              title="可用余额"
              value={account?.balance ?? 0}
              precision={2}
              prefix="¥"
              valueStyle={{ color: '#2563eb', fontWeight: 700, fontSize: 28 }}
              suffix={
                <Button
                  type="primary"
                  size="small"
                  icon={<PlusOutlined />}
                  onClick={() => setRechargeOpen(true)}
                  style={{ marginLeft: 8, borderRadius: 8 }}
                >
                  充值
                </Button>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 16, border: 'none' }} styles={{ body: { padding: '24px' } }}>
            <Statistic
              title="累计充值"
              value={account?.totalRecharge ?? 0}
              precision={2}
              prefix="¥"
              valueStyle={{ color: '#10b981', fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 16, border: 'none' }} styles={{ body: { padding: '24px' } }}>
            <Statistic
              title="累计消费"
              value={account?.totalSpend ?? 0}
              precision={2}
              prefix="¥"
              valueStyle={{ color: '#f59e0b', fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 16, border: 'none' }} styles={{ body: { padding: '24px' } }}>
            <Statistic
              title="欠费金额"
              value={account?.arrearsAmount ?? 0}
              precision={2}
              prefix="¥"
              valueStyle={{ color: '#ef4444', fontWeight: 600 }}
            />
          </Card>
        </Col>
      </Row>

      <Card
        style={{ borderRadius: 16, border: 'none' }}
        title={
          <AntSpace>
            <AccountBookOutlined style={{ color: '#2563eb' }} />
            <span style={{ fontWeight: 600 }}>交易明细</span>
          </AntSpace>
        }
      >
        <Table
          dataSource={transactions}
          columns={columns}
          rowKey="txnId"
          loading={loading}
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: '暂无交易记录' }}
        />
      </Card>

      <Modal
        title={
          <AntSpace>
            <DollarOutlined style={{ color: '#2563eb' }} />
            <span>账户充值</span>
          </AntSpace>
        }
        open={rechargeOpen}
        onCancel={() => setRechargeOpen(false)}
        onOk={handleRecharge}
        confirmLoading={recharging}
        okText="确认充值"
        cancelText="取消"
      >
        <div style={{ padding: '16px 0' }}>
          <Text style={{ display: 'block', marginBottom: 12 }}>请输入充值金额：</Text>
          <InputNumber
            style={{ width: '100%' }}
            min={1}
            max={10000}
            precision={2}
            value={rechargeAmount}
            onChange={(v) => setRechargeAmount(v ?? 100)}
            prefix="¥"
            size="large"
          />
          <AntSpace style={{ marginTop: 12 }}>
            {[50, 100, 200, 500].map((v) => (
              <Button key={v} onClick={() => setRechargeAmount(v)}>
                ¥{v}
              </Button>
            ))}
          </AntSpace>
        </div>
      </Modal>
    </motion.div>
  );
}
