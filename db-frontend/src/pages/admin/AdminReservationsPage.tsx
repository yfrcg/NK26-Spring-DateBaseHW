import { useEffect, useState } from 'react';
import { Button, Card, Col, Empty, Input, message, Popconfirm, Row, Statistic, Table, Tag, Typography } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  ReloadOutlined,
  SearchOutlined,
  StopOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { adminApi } from '@/api';
import { reservationStatusMap, reservationStatusColorMap, chargeModeMap } from '@/constants/domain';
import type { Reservation } from '@/types';
import { logError } from '@/utils/logError';

const { Title, Text } = Typography;

const statusIcons: Record<string, React.ReactNode> = {
  CONFIRMED: <ClockCircleOutlined />,
  IN_USE: <CheckCircleOutlined />,
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

  const columns: ColumnsType<Reservation> = [
    {
      title: '预约编号',
      dataIndex: 'reservationNo',
      width: 180,
      render: (v) => <Text copyable style={{ fontFamily: 'monospace', fontSize: 12 }}>{v}</Text>,
    },
    { title: '用户ID', dataIndex: 'userId', width: 80 },
    { title: '空间ID', dataIndex: 'spaceId', width: 80 },
    {
      title: '预约时间',
      width: 220,
      render: (_, r) => (
        <div>
          <div style={{ fontSize: 13, fontWeight: 500 }}>{dayjs(r.startTime).format('MM-DD HH:mm')}</div>
          <div style={{ fontSize: 12, color: '#94a3b8' }}>至 {dayjs(r.endTime).format('MM-DD HH:mm')}</div>
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'reservationStatus',
      width: 120,
      render: (v) => (
        <Tag icon={statusIcons[v]} color={reservationStatusColorMap[v]} style={{ borderRadius: 20, border: 'none' }}>
          {reservationStatusMap[v] || v}
        </Tag>
      ),
    },
    {
      title: '计费模式',
      dataIndex: 'chargeModeSnapshot',
      width: 100,
      render: (v) => (
        <Tag color={v === 'FREE' ? 'green' : 'blue'} style={{ borderRadius: 20, border: 'none' }}>
          {chargeModeMap[v] || v}
        </Tag>
      ),
    },
    {
      title: '预估金额',
      dataIndex: 'amountEstimated',
      width: 100,
      render: (v) => <Text strong style={{ color: '#f59e0b' }}>¥{v?.toFixed(2) || '0.00'}</Text>,
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
            <Button danger size="small" icon={<StopOutlined />} loading={isLoading} style={{ borderRadius: 8 }}>
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
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <Title level={3} style={{ marginBottom: 4 }}>
            <FileTextOutlined style={{ marginRight: 8, color: '#4f46e5' }} />
            预约管理
          </Title>
          <Text type="secondary">查看所有用户的预约，支持管理员取消操作</Text>
        </div>
        <Button icon={<ReloadOutlined />} onClick={load} style={{ borderRadius: 8 }}>
          刷新
        </Button>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {[
          { label: '总预约数', value: stats.total, color: '#6366f1' },
          { label: '待签到', value: stats.confirmed, color: '#f59e0b' },
          { label: '使用中', value: stats.inUse, color: '#3b82f6' },
          { label: '已完成', value: stats.finished, color: '#10b981' },
          { label: '未签到', value: stats.noShow, color: '#ef4444' },
        ].map((s, i) => (
          <Col xs={12} sm={i < 4 ? 6 : 12} lg={i < 4 ? 6 : 6} key={i}>
            <Card style={{ borderRadius: 14, border: 'none' }} styles={{ body: { padding: '18px 20px' } }}>
              <Statistic
                title={<span style={{ fontSize: 12, color: '#64748b' }}>{s.label}</span>}
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
            placeholder="搜索预约编号、用户ID或状态..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            style={{ maxWidth: 320, borderRadius: 10 }}
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
