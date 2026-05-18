import { useEffect, useState } from 'react';
import { Button, Card, Col, Empty, message, Popconfirm, Row, Space as ASpace, Statistic, Table, Tag, Typography, Input } from 'antd';
import {
  BankOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
  SearchOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { adminApi } from '@/api';
import { spaceStatusMap, spaceStatusColorMap, spaceTypeMap } from '@/constants/domain';
import type { Space } from '@/types';
import { logError } from '@/utils/logError';

const { Title, Text } = Typography;

const statusIcons: Record<string, React.ReactNode> = {
  ACTIVE: <CheckCircleOutlined />,
  DISABLED: <CloseCircleOutlined />,
  MAINTENANCE: <ToolOutlined />,
};

export default function AdminSpacesPage() {
  const [loading, setLoading] = useState(true);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminApi.space.list();
      setSpaces(res.data.data);
    } catch (error) {
      logError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const changeStatus = async (spaceId: number, action: 'activate' | 'disable' | 'maintenance') => {
    setActionLoading(spaceId);
    try {
      if (action === 'activate') {
        await adminApi.space.activate(spaceId);
        message.success('空间已启用');
      } else if (action === 'disable') {
        await adminApi.space.disable(spaceId);
        message.success('空间已停用');
      } else {
        await adminApi.space.maintenance(spaceId);
        message.success('已标记为维护中');
      }
      await load();
    } catch (error) {
      logError(error);
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = search
    ? spaces.filter((s) =>
        s.spaceName.toLowerCase().includes(search.toLowerCase()) ||
        s.spaceCode.toLowerCase().includes(search.toLowerCase()) ||
        (spaceTypeMap[s.spaceType] || '').includes(search)
      )
    : spaces;

  const stats = {
    total: spaces.length,
    active: spaces.filter((s) => s.status === 'ACTIVE').length,
    disabled: spaces.filter((s) => s.status === 'DISABLED').length,
    maintenance: spaces.filter((s) => s.status === 'MAINTENANCE').length,
  };

  const columns: ColumnsType<Space> = [
    {
      title: '空间编码',
      dataIndex: 'spaceCode',
      width: 120,
      render: (v) => <Text strong style={{ fontFamily: 'monospace' }}>{v}</Text>,
    },
    { title: '空间名称', dataIndex: 'spaceName', width: 160 },
    {
      title: '类型',
      dataIndex: 'spaceType',
      width: 110,
      render: (v) => (
        <Tag color="geekblue" style={{ borderRadius: 20, border: 'none' }}>
          {spaceTypeMap[v] || v}
        </Tag>
      ),
    },
    { title: '容量', dataIndex: 'capacity', width: 80, render: (v) => <Text strong>{v}</Text> },
    {
      title: '状态',
      dataIndex: 'status',
      width: 120,
      render: (v) => (
        <Tag
          icon={statusIcons[v]}
          color={spaceStatusColorMap[v]}
          style={{ borderRadius: 20, border: 'none' }}
        >
          {spaceStatusMap[v] || v}
        </Tag>
      ),
    },
    {
      title: '设备描述',
      dataIndex: 'equipmentDesc',
      ellipsis: true,
      render: (v) => v || '-',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 170,
      render: (v) => v ? dayjs(v).format('YYYY-MM-DD HH:mm') : '-',
    },
    {
      title: '操作',
      width: 260,
      fixed: 'right',
      render: (_, r) => {
        const isLoading = actionLoading === r.spaceId;
        return (
          <ASpace>
            <Popconfirm title="确认启用此空间？" onConfirm={() => changeStatus(r.spaceId, 'activate')} okText="确认" cancelText="取消">
              <Button
                type="primary"
                size="small"
                icon={<CheckCircleOutlined />}
                loading={isLoading}
                disabled={r.status === 'ACTIVE'}
                style={{ borderRadius: 8 }}
              >
                启用
              </Button>
            </Popconfirm>
            <Popconfirm title="确认标记为维护中？" onConfirm={() => changeStatus(r.spaceId, 'maintenance')} okText="确认" cancelText="取消">
              <Button
                size="small"
                icon={<ToolOutlined />}
                loading={isLoading}
                disabled={r.status === 'MAINTENANCE'}
                style={{ borderRadius: 8 }}
              >
                维护
              </Button>
            </Popconfirm>
            <Popconfirm title="确认停用此空间？" onConfirm={() => changeStatus(r.spaceId, 'disable')} okText="确认" cancelText="取消">
              <Button
                danger
                size="small"
                icon={<CloseCircleOutlined />}
                loading={isLoading}
                disabled={r.status === 'DISABLED'}
                style={{ borderRadius: 8 }}
              >
                停用
              </Button>
            </Popconfirm>
          </ASpace>
        );
      },
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <Title level={3} style={{ marginBottom: 4 }}>
            <BankOutlined style={{ marginRight: 8, color: '#2563eb' }} />
            空间管理
          </Title>
          <Text type="secondary">管理共享空间，设置启用/停用/维护状态</Text>
        </div>
        <Button icon={<ReloadOutlined />} onClick={load} style={{ borderRadius: 8 }}>
          刷新
        </Button>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {[
          { label: '总空间数', value: stats.total, icon: <BankOutlined />, color: '#2563eb' },
          { label: '可用', value: stats.active, icon: <CheckCircleOutlined />, color: '#10b981' },
          { label: '维护中', value: stats.maintenance, icon: <ToolOutlined />, color: '#f59e0b' },
          { label: '已停用', value: stats.disabled, icon: <CloseCircleOutlined />, color: '#ef4444' },
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
            placeholder="搜索空间编码、名称或类型..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            style={{ maxWidth: 320, borderRadius: 10 }}
          />
        </div>
        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="spaceId"
          loading={loading}
          pagination={{ pageSize: 10, showTotal: (t) => `共 ${t} 个空间`, showSizeChanger: false }}
          scroll={{ x: 1100 }}
          locale={{ emptyText: <Empty description="暂无空间数据" /> }}
        />
      </Card>
    </motion.div>
  );
}
