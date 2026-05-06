import { useEffect, useState } from 'react';
import { Button, Card, Col, Empty, Input, message, Popconfirm, Row, Space, Statistic, Table, Tag, Typography } from 'antd';
import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  LoginOutlined,
  LogoutOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  ReloadOutlined,
  SearchOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { reservationApi, sessionApi } from '@/api';
import { reservationStatusMap, reservationStatusColorMap, sessionStatusMap, sessionStatusColorMap } from '@/constants/domain';
import { useAuthStore } from '@/stores/authStore';
import type { Reservation, UsageSession } from '@/types';
import { logError } from '@/utils/logError';

const { Title, Text } = Typography;

const statusIcons: Record<string, React.ReactNode> = {
  CONFIRMED: <ClockCircleOutlined />,
  IN_USE: <PlayCircleOutlined />,
  FINISHED: <CheckCircleOutlined />,
  CANCELLED: <CloseCircleOutlined />,
  NO_SHOW: <ThunderboltOutlined />,
};

export default function ReservationsPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [sessions, setSessions] = useState<Record<number, UsageSession>>({});
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  const load = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await reservationApi.listByUser(user.userId);
      setReservations(res.data.data);
      const sessionEntries: Record<number, UsageSession> = {};
      await Promise.all(
        res.data.data.map(async (r) => {
          try {
            const sRes = await sessionApi.getByReservation(r.reservationId);
            sessionEntries[r.reservationId] = sRes.data.data;
          } catch {
            /* ignore */
          }
        })
      );
      setSessions(sessionEntries);
    } catch (error) {
      logError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [user]);

  const cancelReservation = async (id: number) => {
    setActionLoading(id);
    try {
      await reservationApi.cancel(id);
      message.success('已取消预约');
      await load();
    } catch (error) {
      logError(error);
    } finally {
      setActionLoading(null);
    }
  };

  const sessionAction = async (id: number, action: 'checkIn' | 'checkOut' | 'tempHold' | 'resume') => {
    setActionLoading(id);
    try {
      const actionMap: Record<string, (rid: number) => Promise<any>> = {
        checkIn: sessionApi.checkIn,
        checkOut: sessionApi.checkOut,
        tempHold: sessionApi.tempHold,
        resume: sessionApi.resume,
      };
      await actionMap[action](id);
      const msgMap: Record<string, string> = {
        checkIn: '签到成功',
        checkOut: '签退成功',
        tempHold: '已暂离',
        resume: '已恢复使用',
      };
      message.success(msgMap[action]);
      await load();
    } catch (error) {
      logError(error);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredReservations = search
    ? reservations.filter(
        (r) =>
          r.reservationNo.toLowerCase().includes(search.toLowerCase()) ||
          (reservationStatusMap[r.reservationStatus] || '').includes(search)
      )
    : reservations;

  const stats = {
    total: reservations.length,
    confirmed: reservations.filter((r) => r.reservationStatus === 'CONFIRMED').length,
    inUse: reservations.filter((r) => r.reservationStatus === 'IN_USE').length,
    finished: reservations.filter((r) => r.reservationStatus === 'FINISHED').length,
    cancelled: reservations.filter((r) => r.reservationStatus === 'CANCELLED').length,
  };

  const columns: ColumnsType<Reservation> = [
    {
      title: '预约编号',
      dataIndex: 'reservationNo',
      width: 180,
      render: (v) => (
        <Text copyable style={{ fontFamily: 'monospace', fontSize: 13 }}>
          {v}
        </Text>
      ),
    },
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
      width: 130,
      render: (v) => (
        <Tag
          icon={statusIcons[v]}
          color={reservationStatusColorMap[v]}
          style={{ borderRadius: 20, border: 'none', fontWeight: 500 }}
        >
          {reservationStatusMap[v] || v}
        </Tag>
      ),
    },
    {
      title: '使用状态',
      width: 130,
      render: (_, r) => {
        const s = sessions[r.reservationId];
        if (!s) return <Text type="secondary">-</Text>;
        return (
          <Tag
            color={sessionStatusColorMap[s.sessionStatus]}
            style={{ borderRadius: 20, border: 'none', fontWeight: 500 }}
          >
            {sessionStatusMap[s.sessionStatus] || s.sessionStatus}
          </Tag>
        );
      },
    },
    {
      title: '计费模式',
      width: 100,
      render: (_, r) => (
        <Tag
          color={r.chargeModeSnapshot === 'FREE' ? 'green' : 'blue'}
          style={{ borderRadius: 20, border: 'none' }}
        >
          {r.chargeModeSnapshot === 'FREE' ? '免费' : `${r.hourlyPriceSnapshot}元/h`}
        </Tag>
      ),
    },
    {
      title: '预估金额',
      dataIndex: 'amountEstimated',
      width: 100,
      render: (v) => (
        <Text strong style={{ color: v > 0 ? '#f59e0b' : '#10b981' }}>
          ¥{v?.toFixed(2) || '0.00'}
        </Text>
      ),
    },
    {
      title: '操作',
      width: 240,
      fixed: 'right',
      render: (_, r) => {
        const s = sessions[r.reservationId];
        const isLoading = actionLoading === r.reservationId;

        if (r.reservationStatus === 'CONFIRMED') {
          return (
            <Space>
              <Button
                type="primary"
                size="small"
                icon={<LoginOutlined />}
                loading={isLoading}
                onClick={() => sessionAction(r.reservationId, 'checkIn')}
                style={{ borderRadius: 8 }}
              >
                签到
              </Button>
              <Popconfirm title="确认取消预约？" onConfirm={() => cancelReservation(r.reservationId)} okText="确认" cancelText="取消">
                <Button danger size="small" icon={<CloseCircleOutlined />} style={{ borderRadius: 8 }}>
                  取消
                </Button>
              </Popconfirm>
            </Space>
          );
        }

        if (r.reservationStatus === 'IN_USE' && s) {
          return (
            <Space>
              {s.sessionStatus === 'IN_USE' && (
                <Button
                  size="small"
                  icon={<PauseCircleOutlined />}
                  loading={isLoading}
                  onClick={() => sessionAction(r.reservationId, 'tempHold')}
                  style={{ borderRadius: 8 }}
                >
                  暂离
                </Button>
              )}
              {s.sessionStatus === 'TEMP_HOLD' && (
                <Button
                  type="primary"
                  size="small"
                  icon={<PlayCircleOutlined />}
                  loading={isLoading}
                  onClick={() => sessionAction(r.reservationId, 'resume')}
                  style={{ borderRadius: 8 }}
                >
                  恢复
                </Button>
              )}
              <Popconfirm title="确认签退？将自动结算费用。" onConfirm={() => sessionAction(r.reservationId, 'checkOut')} okText="确认" cancelText="取消">
                <Button danger size="small" icon={<LogoutOutlined />} style={{ borderRadius: 8 }}>
                  签退
                </Button>
              </Popconfirm>
            </Space>
          );
        }

        return <Text type="secondary">-</Text>;
      },
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <Title level={3} style={{ marginBottom: 4 }}>
            <CalendarOutlined style={{ marginRight: 8, color: '#4f46e5' }} />
            我的预约
          </Title>
          <Text type="secondary">管理您的预约，支持签到、暂离、签退操作</Text>
        </div>
        <Button icon={<ReloadOutlined />} onClick={load} style={{ borderRadius: 8 }}>
          刷新
        </Button>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {[
          { label: '全部预约', value: stats.total, color: '#6366f1', bg: '#eef2ff' },
          { label: '待签到', value: stats.confirmed, color: '#f59e0b', bg: '#fffbeb' },
          { label: '使用中', value: stats.inUse, color: '#3b82f6', bg: '#eff6ff' },
          { label: '已完成', value: stats.finished, color: '#10b981', bg: '#ecfdf5' },
        ].map((s, i) => (
          <Col xs={12} sm={6} key={i}>
            <Card
              style={{ borderRadius: 14, border: 'none', background: '#fff' }}
              styles={{ body: { padding: '18px 20px' } }}
            >
              <Statistic
                title={<span style={{ fontSize: 12, color: '#64748b' }}>{s.label}</span>}
                value={s.value}
                valueStyle={{ fontSize: 28, fontWeight: 700, color: s.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Card
        style={{ borderRadius: 16, border: 'none' }}
        styles={{ body: { padding: 0 } }}
      >
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9' }}>
          <Input
            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
            placeholder="搜索预约编号或状态..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            style={{ maxWidth: 320, borderRadius: 10 }}
          />
        </div>
        <Table
          columns={columns}
          dataSource={filteredReservations}
          rowKey="reservationId"
          loading={loading}
          pagination={{ pageSize: 8, showTotal: (t) => `共 ${t} 条记录`, showSizeChanger: false }}
          scroll={{ x: 1000 }}
          locale={{ emptyText: <Empty description="暂无预约记录" /> }}
        />
      </Card>
    </motion.div>
  );
}
