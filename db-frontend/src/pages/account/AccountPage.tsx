import { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Card,
  InputNumber,
  message,
  Modal,
  Space as AntSpace,
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
import { pageVariants } from '@/constants/motionVariants';
import PageHeader from '@/components/PageHeader';
import StatsCardRow from '@/components/StatsCardRow';

const { Text } = Typography;

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

  const fetchData = useCallback(async () => {
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
  }, [user]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const handleRecharge = async () => {
    if (!user || !rechargeAmount || rechargeAmount <= 0) return;
    setRecharging(true);
    try {
      await accountApi.recharge(user.userId, { amount: rechargeAmount });
      message.success(`充值成功！已充入 ¥${rechargeAmount.toFixed(2)}`);
      setRechargeOpen(false);
      void fetchData();
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
      render: (v: string) => <Tag className="status-tag">{txnTypeMap[v] || v}</Tag>,
    },
    {
      title: '方向',
      dataIndex: 'direction',
      key: 'direction',
      width: 120,
      render: (v: string) =>
        v === 'IN' ? (
          <Tag icon={<ArrowUpOutlined />} color="success" className="status-tag">收入</Tag>
        ) : v === 'OUT' ? (
          <Tag icon={<ArrowDownOutlined />} color="error" className="status-tag">支出</Tag>
        ) : (
          <Tag className="status-tag">—</Tag>
        ),
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (_: number | undefined, r: Transaction) =>
        r.amount != null ? (
          <Text className={r.direction === 'IN' ? 'amount-in' : 'amount-out'}>
            {r.direction === 'IN' ? '+' : '-'}¥{r.amount.toFixed(2)}
          </Text>
        ) : r.creditDelta != null ? (
          <Text className={r.direction === 'IN' ? 'amount-in' : 'amount-out'}>
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

  const stats = [
    { title: '可用余额', value: account?.balance ?? 0, icon: <WalletOutlined />, color: 'var(--primary)', prefix: '¥' },
    { title: '累计充值', value: account?.totalRecharge ?? 0, icon: <ArrowUpOutlined />, color: 'var(--emerald)', prefix: '¥' },
    { title: '累计消费', value: account?.totalSpend ?? 0, icon: <ArrowDownOutlined />, color: 'var(--amber)', prefix: '¥' },
    { title: '欠费金额', value: account?.arrearsAmount ?? 0, icon: <DollarOutlined />, color: 'var(--danger)', prefix: '¥' },
  ];

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="page-enter"
    >
      <PageHeader
        title="我的钱包"
        subtitle="查看账户余额、充值及交易明细"
        action={
          <AntSpace>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setRechargeOpen(true)}
              className="primary-gradient-btn"
            >
              账户充值
            </Button>
            <Button onClick={fetchData} className="btn-refresh">
              刷新
            </Button>
          </AntSpace>
        }
      />

      <StatsCardRow stats={stats} loading={loading} />

      <Card
        className="admin-table-card"
        title={
          <AntSpace>
            <AccountBookOutlined style={{ color: 'var(--primary)' }} />
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
            <DollarOutlined style={{ color: 'var(--primary)' }} />
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
            style={{ width: '100%', borderRadius: 'var(--radius)' }}
            min={1}
            max={10000}
            precision={2}
            value={rechargeAmount}
            onChange={(v) => setRechargeAmount(v ?? 100)}
            prefix="¥"
            size="large"
          />
          <AntSpace style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap' }}>
            {[50, 100, 200, 500].map((v) => (
              <Button
                key={v}
                type={rechargeAmount === v ? 'primary' : 'default'}
                onClick={() => setRechargeAmount(v)}
                style={{ borderRadius: 'var(--radius-pill)' }}
              >
                ¥{v}
              </Button>
            ))}
          </AntSpace>
        </div>
      </Modal>
    </motion.div>
  );
}
