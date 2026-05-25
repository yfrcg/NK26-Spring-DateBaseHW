import { useEffect, useState } from 'react';
import { Button, Card, Empty, message, Popconfirm, Space as ASpace, Table, Tag, Typography, Input } from 'antd';
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
import { pageVariants } from '@/constants/motionVariants';
import PageHeader from '@/components/PageHeader';
import StatsCardRow from '@/components/StatsCardRow';

const { Text } = Typography;

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

  const statsCardData = [
    { title: '总空间数', value: stats.total, icon: <BankOutlined />, color: 'var(--primary)' },
    { title: '可用空间', value: stats.active, icon: <CheckCircleOutlined />, color: 'var(--emerald)' },
    { title: '维护中', value: stats.maintenance, icon: <ToolOutlined />, color: 'var(--amber)' },
    { title: '已停用', value: stats.disabled, icon: <CloseCircleOutlined />, color: 'var(--danger)' },
  ];

  const columns: ColumnsType<Space> = [
    {
      title: '空间编码',
      dataIndex: 'spaceCode',
      width: 120,
      render: (v) => <Text strong className="monospace-code">{v}</Text>,
    },
    { title: '空间名称', dataIndex: 'spaceName', width: 160 },
    {
      title: '类型',
      dataIndex: 'spaceType',
      width: 110,
      render: (v) => (
        <Tag color="geekblue" className="status-tag">
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
          className="status-tag"
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
            {r.status !== 'ACTIVE' && (
              <Popconfirm title="确认启用此空间？" onConfirm={() => changeStatus(r.spaceId, 'activate')} okText="确认" cancelText="取消">
                <Button
                  type="primary"
                  size="small"
                  icon={<CheckCircleOutlined />}
                  loading={isLoading}
                >
                  启用
                </Button>
              </Popconfirm>
            )}
            {r.status !== 'MAINTENANCE' && (
              <Popconfirm title="确认标记为维护中？" onConfirm={() => changeStatus(r.spaceId, 'maintenance')} okText="确认" cancelText="取消">
                <Button
                  size="small"
                  icon={<ToolOutlined />}
                  loading={isLoading}
                >
                  维护
                </Button>
              </Popconfirm>
            )}
            {r.status !== 'DISABLED' && (
              <Popconfirm title="确认停用此空间？" onConfirm={() => changeStatus(r.spaceId, 'disable')} okText="确认" cancelText="取消">
                <Button
                  danger
                  size="small"
                  icon={<CloseCircleOutlined />}
                  loading={isLoading}
                >
                  停用
                </Button>
              </Popconfirm>
            )}
          </ASpace>
        );
      },
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
        title="空间管理"
        subtitle="管理共享空间，设置启用/停用/维护状态"
        action={
          <Button icon={<ReloadOutlined />} onClick={load} className="btn-refresh">
            刷新
          </Button>
        }
      />

      <StatsCardRow stats={statsCardData} loading={loading} />

      <Card className="admin-table-card">
        <div className="admin-search-bar">
          <Input
            prefix={<SearchOutlined style={{ color: 'var(--muted)' }} />}
            placeholder="搜索空间编码、名称或类型..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            style={{ maxWidth: 320 }}
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
