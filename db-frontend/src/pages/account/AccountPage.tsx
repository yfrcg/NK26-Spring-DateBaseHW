import { useEffect, useEffectEvent, useState } from 'react';
import { ArrowDownOutlined, ArrowUpOutlined, DollarOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Form,
  InputNumber,
  Modal,
  Row,
  Statistic,
  Table,
  Tabs,
  Tag,
  Typography,
  message,
} from 'antd';
import dayjs from 'dayjs';
import { accountApi, billingApi } from '@/api';
import { billStatusMap } from '@/constants/domain';
import { useAuthStore } from '@/stores/authStore';
import type { AccountTransaction, BillingOrder, UserAccount } from '@/types';
import { logError } from '@/utils/logError';

const { Title } = Typography;

const txnTypeMap: Record<string, { color: string; text: string }> = {
  RECHARGE: { color: 'green', text: '充值' },
  CONSUME: { color: 'red', text: '消费' },
  REFUND: { color: 'blue', text: '退款' },
  FREEZE: { color: 'orange', text: '冻结' },
  UNFREEZE: { color: 'cyan', text: '解冻' },
};

const directionMap: Record<string, { color: string; text: string }> = {
  IN: { color: 'green', text: '收入' },
  OUT: { color: 'red', text: '支出' },
};

export default function AccountPage() {
  const { user } = useAuthStore();
  const [account, setAccount] = useState<UserAccount | null>(null);
  const [transactions, setTransactions] = useState<AccountTransaction[]>([]);
  const [bills, setBills] = useState<BillingOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [rechargeOpen, setRechargeOpen] = useState(false);
  const [recharging, setRecharging] = useState(false);
  const [form] = Form.useForm();

  const fetchData = useEffectEvent(async () => {
    if (!user) {
      return;
    }

    setLoading(true);
    try {
      const [accRes, txnRes, billRes] = await Promise.all([
        accountApi.getAccount(user.userId),
        accountApi.listTransactions(user.userId),
        billingApi.listByUser(user.userId),
      ]);
      setAccount(accRes.data.data);
      setTransactions(txnRes.data.data);
      setBills(billRes.data.data);
    } catch (error) {
      logError(error);
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    void fetchData();
  }, [user?.userId, reloadKey]);

  const handleRecharge = async (values: { amount: number }) => {
    if (!user) {
      return;
    }

    setRecharging(true);
    try {
      await accountApi.recharge(user.userId, { amount: values.amount });
      message.success('充值成功');
      setRechargeOpen(false);
      form.resetFields();
      setReloadKey((current) => current + 1);
    } catch (error) {
      logError(error);
    } finally {
      setRecharging(false);
    }
  };

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>
        账户中心
      </Title>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card style={{ borderRadius: 8 }}>
            <Statistic title="账户余额" value={account?.balance || 0} precision={2} prefix="¥" valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card style={{ borderRadius: 8 }}>
            <Statistic title="冻结金额" value={account?.frozenAmount || 0} precision={2} prefix="¥" valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card style={{ borderRadius: 8 }}>
            <Statistic title="欠费金额" value={account?.arrearsAmount || 0} precision={2} prefix="¥" valueStyle={{ color: '#ff4d4f' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card style={{ borderRadius: 8 }}>
            <Statistic
              title="累计充值"
              value={account?.totalRecharge || 0}
              precision={2}
              prefix={
                <>
                  <ArrowUpOutlined /> ¥
                </>
              }
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card style={{ borderRadius: 8 }}>
            <Statistic
              title="累计消费"
              value={account?.totalSpend || 0}
              precision={2}
              prefix={
                <>
                  <ArrowDownOutlined /> ¥
                </>
              }
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      <Button
        type="primary"
        icon={<DollarOutlined />}
        size="large"
        onClick={() => setRechargeOpen(true)}
        style={{ marginBottom: 24, borderRadius: 8 }}
      >
        账户充值
      </Button>

      <Card style={{ borderRadius: 8 }}>
        <Tabs
          items={[
            {
              key: 'transactions',
              label: '交易记录',
              children: (
                <Table
                  columns={[
                    { title: '流水号', dataIndex: 'txnNo', key: 'txnNo', width: 180, ellipsis: true },
                    {
                      title: '类型',
                      dataIndex: 'txnType',
                      key: 'txnType',
                      width: 100,
                      render: (value: string) => {
                        const item = txnTypeMap[value] || { color: 'default', text: value };
                        return <Tag color={item.color}>{item.text}</Tag>;
                      },
                    },
                    {
                      title: '方向',
                      dataIndex: 'direction',
                      key: 'direction',
                      width: 90,
                      render: (value: string) => {
                        const item = directionMap[value] || { color: 'default', text: value };
                        return <Tag color={item.color}>{item.text}</Tag>;
                      },
                    },
                    {
                      title: '金额',
                      dataIndex: 'amount',
                      key: 'amount',
                      width: 110,
                      render: (value: number) => `¥${value.toFixed(2)}`,
                    },
                    {
                      title: '余额变化',
                      key: 'balanceChange',
                      width: 180,
                      render: (_: unknown, record: AccountTransaction) =>
                        `¥${record.beforeBalance.toFixed(2)} -> ¥${record.afterBalance.toFixed(2)}`,
                    },
                    {
                      title: '备注',
                      dataIndex: 'remark',
                      key: 'remark',
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
                  dataSource={transactions}
                  rowKey="txnId"
                  loading={loading}
                  pagination={{ pageSize: 10 }}
                  scroll={{ x: 920 }}
                  size="small"
                />
              ),
            },
            {
              key: 'bills',
              label: '账单列表',
              children: (
                <Table
                  columns={[
                    { title: '账单号', dataIndex: 'billNo', key: 'billNo', width: 180, ellipsis: true },
                    {
                      title: '状态',
                      dataIndex: 'billStatus',
                      key: 'billStatus',
                      width: 100,
                      render: (value: string) => {
                        const item = billStatusMap[value] || { color: 'default', text: value };
                        return <Tag color={item.color}>{item.text}</Tag>;
                      },
                    },
                    {
                      title: '基础费用',
                      dataIndex: 'baseAmount',
                      key: 'baseAmount',
                      width: 100,
                      render: (value: number) => `¥${value.toFixed(2)}`,
                    },
                    {
                      title: '超时费用',
                      dataIndex: 'overtimeAmount',
                      key: 'overtimeAmount',
                      width: 100,
                      render: (value: number) => `¥${value.toFixed(2)}`,
                    },
                    {
                      title: '应付金额',
                      dataIndex: 'payableAmount',
                      key: 'payableAmount',
                      width: 110,
                      render: (value: number) => (
                        <span style={{ fontWeight: 600, color: '#ff4d4f' }}>¥{value.toFixed(2)}</span>
                      ),
                    },
                    {
                      title: '已付金额',
                      dataIndex: 'paidAmount',
                      key: 'paidAmount',
                      width: 110,
                      render: (value: number) => `¥${value.toFixed(2)}`,
                    },
                    {
                      title: '创建时间',
                      dataIndex: 'createdAt',
                      key: 'createdAt',
                      width: 160,
                      render: (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm'),
                    },
                  ]}
                  dataSource={bills}
                  rowKey="billId"
                  loading={loading}
                  pagination={{ pageSize: 10 }}
                  scroll={{ x: 940 }}
                  size="small"
                />
              ),
            },
          ]}
        />
      </Card>

      <Modal
        title="账户充值"
        open={rechargeOpen}
        onCancel={() => {
          setRechargeOpen(false);
          form.resetFields();
        }}
        footer={null}
        width={400}
      >
        <Form form={form} onFinish={handleRecharge} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="amount"
            label="充值金额"
            rules={[
              { required: true, message: '请输入充值金额' },
              { type: 'number', min: 0.01, message: '金额必须大于 0' },
            ]}
          >
            <InputNumber prefix="¥" min={0.01} step={10} style={{ width: '100%' }} placeholder="请输入充值金额" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" loading={recharging} block>
              确认充值
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
