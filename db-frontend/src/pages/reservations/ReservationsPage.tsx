import { useCallback, useEffect, useState } from 'react';
import { Button, Card, Empty, Input, message, Popconfirm, Space, Table, Tag, Typography } from 'antd';
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

export default function ReservationsPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [sessions, setSessions] = useState<Record<number, UsageSession>>({});
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
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
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

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
      const actionMap: Record<typeof action, typeof sessionApi.checkIn> = {
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

  const stats = [
    { title: '全部预约', value: reservations.length, icon: <CalendarOutlined />, color: 'var(--primary)' },
    { title: '待签到', value: reservations.filter((r) => r.reservationStatus === 'CONFIRMED').length, icon: <ClockCircleOutlined />, color: 'var(--amber)' },
    { title: '使用中', value: reservations.filter((r) => r.reservationStatus === 'IN_USE').length, icon: <PlayCircleOutlined />, color: 'var(--blue)' },
    { title: '已完成', value: reservations.filter((r) => r.reservationStatus === 'FINISHED').length, icon: <CheckCircleOutlined />, color: 'var(--emerald)' },
  ];

  const columns: ColumnsType<Reservation> = [
    {
      title: '预约编号',
      dataIndex: 'reservationNo',
      width: 180,
      render: (v) => (
        <Text copyable className="monospace-code">
          {v}
        </Text>
      ),
    },
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
      width: 130,
      render: (v) => (
        <Tag
          icon={statusIcons[v]}
          color={reservationStatusColorMap[v]}
          className="status-tag"
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
            className="status-tag"
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
          className="status-tag"
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
        <Text strong className={v > 0 ? 'text-amount-pending' : 'text-amount-free'}>
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
              >
                签到
              </Button>
              <Popconfirm title="确认取消预约？" onConfirm={() => cancelReservation(r.reservationId)} okText="确认" cancelText="取消">
                <Button danger size="small" icon={<CloseCircleOutlined />}>
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
                >
                  恢复
                </Button>
              )}
              <Popconfirm title="确认签退？将自动结算费用。" onConfirm={() => sessionAction(r.reservationId, 'checkOut')} okText="确认" cancelText="取消">
                <Button danger size="small" icon={<LogoutOutlined />}>
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
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="page-enter"
    >
      <PageHeader
        title="我的预约"
        subtitle="管理您的预约，支持签到、暂离、签退操作"
        action={
          <Button icon={<ReloadOutlined />} onClick={load} className="btn-refresh">
            刷新
          </Button>
        }
      />

      <StatsCardRow stats={stats} loading={loading} />

      <Card className="admin-table-card">
        <div className="admin-search-bar">
          <Input
            prefix={<SearchOutlined style={{ color: 'var(--muted)' }} />}
            placeholder="搜索预约编号或状态..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            style={{ maxWidth: 320 }}
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
