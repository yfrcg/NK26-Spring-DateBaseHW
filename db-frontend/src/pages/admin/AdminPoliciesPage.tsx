import { useEffect, useState } from 'react';
import { Button, Card, Col, Empty, message, Popconfirm, Row, Statistic, Table, Tag, Typography, Input } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  LockOutlined,
  ReloadOutlined,
  SearchOutlined,
  SettingOutlined,
  UnlockOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import type { ColumnsType } from 'antd/es/table';
import { adminApi } from '@/api';
import { chargeModeMap } from '@/constants/domain';
import type { PricingPolicy } from '@/types';
import { logError } from '@/utils/logError';

const { Title, Text } = Typography;

export default function AdminPoliciesPage() {
  const [loading, setLoading] = useState(true);
  const [policies, setPolicies] = useState<PricingPolicy[]>([]);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminApi.policy.list();
      setPolicies(res.data.data);
    } catch (error) {
      logError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const togglePolicy = async (policyId: number, enable: boolean) => {
    setActionLoading(policyId);
    try {
      if (enable) {
        await adminApi.policy.enable(policyId);
        message.success('策略已启用');
      } else {
        await adminApi.policy.disable(policyId);
        message.success('策略已禁用');
      }
      await load();
    } catch (error) {
      logError(error);
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = search
    ? policies.filter((p) =>
        p.policyName.toLowerCase().includes(search.toLowerCase()) ||
        p.policyCode.toLowerCase().includes(search.toLowerCase())
      )
    : policies;

  const stats = {
    total: policies.length,
    active: policies.filter((p) => p.isActive === 1).length,
    free: policies.filter((p) => p.chargeMode === 'FREE').length,
    paid: policies.filter((p) => p.chargeMode === 'PAID').length,
  };

  const columns: ColumnsType<PricingPolicy> = [
    {
      title: '策略编码',
      dataIndex: 'policyCode',
      width: 130,
      render: (v) => <Text strong style={{ fontFamily: 'monospace' }}>{v}</Text>,
    },
    { title: '策略名称', dataIndex: 'policyName', width: 160 },
    {
      title: '计费模式',
      dataIndex: 'chargeMode',
      width: 100,
      render: (v) => (
        <Tag color={v === 'FREE' ? 'green' : 'blue'} style={{ borderRadius: 20, border: 'none' }}>
          {chargeModeMap[v] || v}
        </Tag>
      ),
    },
    {
      title: '时价（元/h）',
      dataIndex: 'hourlyPrice',
      width: 110,
      render: (v) => v != null ? <Text strong>¥{v}</Text> : '-',
    },
    {
      title: '免费分钟',
      dataIndex: 'freeMinutes',
      width: 100,
      render: (v) => v || '-',
    },
    {
      title: '押金（元）',
      dataIndex: 'depositAmount',
      width: 100,
      render: (v) => v ? <Text>¥{v}</Text> : '-',
    },
    {
      title: '暂离',
      dataIndex: 'allowTempHold',
      width: 80,
      render: (v) => v === 1 ? (
        <Tag color="green" style={{ borderRadius: 20, border: 'none' }}>允许</Tag>
      ) : (
        <Tag color="default" style={{ borderRadius: 20, border: 'none' }}>禁止</Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      width: 90,
      render: (v) => (
        <Tag
          icon={v === 1 ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          color={v === 1 ? 'success' : 'default'}
          style={{ borderRadius: 20, border: 'none' }}
        >
          {v === 1 ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      ellipsis: true,
      render: (v) => v || '-',
    },
    {
      title: '操作',
      width: 120,
      fixed: 'right',
      render: (_, r) => {
        const isActive = r.isActive === 1;
        const isLoading = actionLoading === r.policyId;
        return (
          <Popconfirm
            title={isActive ? '确认禁用此策略？' : '确认启用此策略？'}
            onConfirm={() => togglePolicy(r.policyId, !isActive)}
            okText="确认"
            cancelText="取消"
          >
            <Button
              type={isActive ? 'default' : 'primary'}
              danger={isActive}
              size="small"
              icon={isActive ? <LockOutlined /> : <UnlockOutlined />}
              loading={isLoading}
              style={{ borderRadius: 8 }}
            >
              {isActive ? '禁用' : '启用'}
            </Button>
          </Popconfirm>
        );
      },
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <Title level={3} style={{ marginBottom: 4 }}>
            <SettingOutlined style={{ marginRight: 8, color: '#4f46e5' }} />
            计费策略管理
          </Title>
          <Text type="secondary">管理空间计费规则，控制策略的启用与禁用</Text>
        </div>
        <Button icon={<ReloadOutlined />} onClick={load} style={{ borderRadius: 8 }}>
          刷新
        </Button>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {[
          { label: '总策略数', value: stats.total, icon: <SettingOutlined />, color: '#6366f1' },
          { label: '已启用', value: stats.active, icon: <CheckCircleOutlined />, color: '#10b981' },
          { label: '免费策略', value: stats.free, icon: <DollarOutlined />, color: '#3b82f6' },
          { label: '付费策略', value: stats.paid, icon: <DollarOutlined />, color: '#f59e0b' },
        ].map((s, i) => (
          <Col xs={12} sm={6} key={i}>
            <Card style={{ borderRadius: 14, border: 'none' }} styles={{ body: { padding: '18px 20px' } }}>
              <Statistic
                title={<span style={{ fontSize: 12, color: '#64748b' }}>{s.icon} {s.label}</span>}
                value={s.value}
                valueStyle={{ fontSize: 28, fontWeight: 700, color: s.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Card style={{ borderRadius: 16, border: 'none' }} styles={{ body: { padding: 0 } }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9' }}>
          <Input
            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
            placeholder="搜索策略编码或名称..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            style={{ maxWidth: 320, borderRadius: 10 }}
          />
        </div>
        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="policyId"
          loading={loading}
          pagination={{ pageSize: 10, showTotal: (t) => `共 ${t} 条策略`, showSizeChanger: false }}
          scroll={{ x: 1200 }}
          locale={{ emptyText: <Empty description="暂无策略数据" /> }}
        />
      </Card>
    </motion.div>
  );
}
