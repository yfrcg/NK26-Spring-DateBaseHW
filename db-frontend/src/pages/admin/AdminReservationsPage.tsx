import { useEffect, useState } from 'react';
import { Button, Card, Empty, Input, message, Popconfirm, Table, Tag, Typography } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  ReloadOutlined,
  SearchOutlined,
  StopOutlined,
  ThunderboltOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { adminApi } from '@/api';
import { reservationStatusMap, reservationStatusColorMap, chargeModeMap } from '@/constants/domain';
import type { Reservation } from '@/types';
import { logError } from '@/utils/logError';
import { pageVariants } from '@/constants/motionVariants';
import PageHeader from '@/components/PageHeader';
import StatsCardRow from '@/components/StatsCardRow';

const { Text } = Typography;

const statusIcons: Record<string, React.ReactNode> = {
  CONFIRMED: <ClockCircleOutlined />,
  IN_USE: <PlayCircleOutlined />,
  FINISHED: <CheckCircleOutlined />,
  CANCELLED: <CloseCircleOutlined />,
  NO_SHOW: <ThunderboltOutlined />,
};

export default function AdminReservationsPage() {
  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminApi.reservation.list();
      setReservations(res.data.data);
    } catch (error) {
      logError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const cancelReservation = async (id: number) => {
    setActionLoading(id);
    try {
      await adminApi.reservation.cancel(id);
      message.success('预约已取消');
      await load();
    } catch (error) {
      logError(error);
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = search
    ? reservations.filter(
        (r) =>
          r.reservationNo.toLowerCase().includes(search.toLowerCase()) ||
          String(r.userId).includes(search) ||
          (reservationStatusMap[r.reservationStatus] || '').includes(search)
      )
    : reservations;

  const stats = {
    total: reservations.length,
    confirmed: reservations.filter((r) => r.reservationStatus === 'CONFIRMED').length,
    inUse: reservations.filter((r) => r.reservationStatus === 'IN_USE').length,
    finished: reservations.filter((r) => r.reservationStatus === 'FINISHED').length,
    noShow: reservations.filter((r) => r.reservationStatus === 'NO_SHOW').length,
  };

  const statsCardData = [
    { title: '总预约数', value: stats.total, icon: <FileTextOutlined />, color: 'var(--primary)' },
    { title: '待签到', value: stats.confirmed, icon: <ClockCircleOutlined />, color: 'var(--amber)' },
    { title: '使用中', value: stats.inUse, icon: <PlayCircleOutlined />, color: 'var(--blue)' },
    { title: '已完成', value: stats.finished, icon: <CheckCircleOutlined />, color: 'var(--emerald)' },
    { title: '未签到', value: stats.noShow, icon: <StopOutlined />, color: 'var(--danger)' },
  ];

  const columns: ColumnsType<Reservation> = [
    {
      title: '预约编号',
      dataIndex: 'reservationNo',
      width: 180,
      render: (v) => <Text copyable className="monospace-code">{v}</Text>,
    },
    { title: '用户ID', dataIndex: 'userId', width: 80 },
    { title: '空间ID', dataIndex: 'spaceId', width: 80 },
    {
      title: '预约时间',
      width: 220,
      render: (_, r) => (
        <div className="time-display-block">
          <div className="time-start">{dayjs(r.startTime).format('MM-DD HH:mm')}</div>
          <div className="time-end">至 {dayjs(r.endTime).format('MM-DD HH:mm')}</div>
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'reservationStatus',
      width: 120,
      render: (v) => (
        <Tag icon={statusIcons[v]} color={reservationStatusColorMap[v]} className="status-tag">
          {reservationStatusMap[v] || v}
        </Tag>
      ),
    },
    {
      title: '计费模式',
      dataIndex: 'chargeModeSnapshot',
      width: 100,
      render: (v) => (
        <Tag color={v === 'FREE' ? 'green' : 'blue'} className="status-tag">
          {chargeModeMap[v] || v}
        </Tag>
      ),
    },
    {
      title: '预估金额',
      dataIndex: 'amountEstimated',
      width: 100,
      render: (v) => <Text strong style={{ color: 'var(--amber)' }}>¥{v?.toFixed(2) || '0.00'}</Text>,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 170,
      render: (v) => v ? dayjs(v).format('YYYY-MM-DD HH:mm') : '-',
    },
    {
      title: '操作',
      width: 110,
      fixed: 'right',
      render: (_, r) => {
        const canCancel = r.reservationStatus === 'CONFIRMED' || r.reservationStatus === 'IN_USE';
        const isLoading = actionLoading === r.reservationId;
        return canCancel ? (
          <Popconfirm title="确认以管理员身份取消此预约？" onConfirm={() => cancelReservation(r.reservationId)} okText="确认" cancelText="取消">
            <Button danger size="small" icon={<StopOutlined />} loading={isLoading}>
              取消
            </Button>
          </Popconfirm>
        ) : (
          <Text type="secondary">-</Text>
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
        title="预约管理"
        subtitle="查看所有用户的预约，支持管理员取消操作"
        action={
          <Button icon={<ReloadOutlined />} onClick={load} className="btn-refresh">
            刷新
          </Button>
        }
      />

      <StatsCardRow stats={statsCardData} loading={loading} columns={{ xs: 12, sm: 8, lg: 4 }} />

      <Card className="admin-table-card">
        <div className="admin-search-bar">
          <Input
            prefix={<SearchOutlined style={{ color: 'var(--muted)' }} />}
            placeholder="搜索预约编号、用户ID或状态..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            style={{ maxWidth: 320 }}
          />
        </div>
        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="reservationId"
          loading={loading}
          pagination={{ pageSize: 10, showTotal: (t) => `共 ${t} 条预约`, showSizeChanger: false }}
          scroll={{ x: 1300 }}
          locale={{ emptyText: <Empty description="暂无预约数据" /> }}
        />
      </Card>
    </motion.div>
  );
}
