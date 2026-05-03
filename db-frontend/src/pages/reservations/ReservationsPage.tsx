import { useEffect, useEffectEvent, useState } from 'react';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  LogoutOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { Button, Card, Input, Modal, Space, Table, Tag, Typography, message } from 'antd';
import dayjs from 'dayjs';
import { reservationApi, sessionApi } from '@/api';
import { reservationStatusMap, sessionStatusMap } from '@/constants/domain';
import { useAuthStore } from '@/stores/authStore';
import type { Reservation, UsageSession } from '@/types';
import { logError } from '@/utils/logError';

const { Title } = Typography;

export default function ReservationsPage() {
  const { user } = useAuthStore();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [sessions, setSessions] = useState<Record<number, UsageSession>>({});
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<number | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  const fetchReservations = useEffectEvent(async () => {
    if (!user) {
      return;
    }

    setLoading(true);
    try {
      const res = await reservationApi.listByUser(user.userId);
      const data = res.data.data;
      setReservations(data);

      const sessionCandidates = data.filter(
        (item) => item.reservationStatus === 'IN_USE' || item.reservationStatus === 'FINISHED'
      );

      const sessionResults = await Promise.all(
        sessionCandidates.map(async (item) => {
          try {
            const sessionRes = await sessionApi.getByReservation(item.reservationId);
            return { reservationId: item.reservationId, session: sessionRes.data.data };
          } catch (error) {
            logError(error);
            return null;
          }
        })
      );

      const nextSessions: Record<number, UsageSession> = {};
      sessionResults.forEach((item) => {
        if (item) {
          nextSessions[item.reservationId] = item.session;
        }
      });
      setSessions(nextSessions);
    } catch (error) {
      logError(error);
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    void fetchReservations();
  }, [user?.userId, reloadKey]);

  const handleCancel = async () => {
    if (!cancelTarget) {
      return;
    }

    try {
      await reservationApi.cancel(cancelTarget, cancelReason || undefined);
      message.success('预约已取消');
      setCancelModalOpen(false);
      setCancelReason('');
      setCancelTarget(null);
      setReloadKey((current) => current + 1);
    } catch (error) {
      logError(error);
    }
  };

  const handleSessionAction = async (
    reservationId: number,
    action: 'checkIn' | 'tempHold' | 'resume' | 'checkOut'
  ) => {
    const actionMap = {
      checkIn: sessionApi.checkIn,
      tempHold: sessionApi.tempHold,
      resume: sessionApi.resume,
      checkOut: sessionApi.checkOut,
    };

    const messageMap = {
      checkIn: '签到成功',
      tempHold: '暂离成功',
      resume: '恢复使用成功',
      checkOut: '签退成功',
    };

    try {
      await actionMap[action](reservationId);
      message.success(messageMap[action]);
      setReloadKey((current) => current + 1);
    } catch (error) {
      logError(error);
    }
  };

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>
        我的预约
      </Title>
      <Card style={{ borderRadius: 8 }}>
        <Table
          columns={[
            { title: '预约编号', dataIndex: 'reservationNo', key: 'reservationNo', width: 180 },
            { title: '空间 ID', dataIndex: 'spaceId', key: 'spaceId', width: 90 },
            {
              title: '开始时间',
              dataIndex: 'startTime',
              key: 'startTime',
              width: 160,
              render: (value: string) => dayjs(value).format('MM-DD HH:mm'),
            },
            {
              title: '结束时间',
              dataIndex: 'endTime',
              key: 'endTime',
              width: 160,
              render: (value: string) => dayjs(value).format('MM-DD HH:mm'),
            },
            {
              title: '预约状态',
              dataIndex: 'reservationStatus',
              key: 'reservationStatus',
              width: 110,
              render: (value: string) => {
                const item = reservationStatusMap[value] || { color: 'default', text: value };
                return <Tag color={item.color}>{item.text}</Tag>;
              },
            },
            {
              title: '预计费用',
              dataIndex: 'amountEstimated',
              key: 'amountEstimated',
              width: 100,
              render: (value: number) => `¥${value.toFixed(2)}`,
            },
            {
              title: '会话状态',
              key: 'sessionStatus',
              width: 110,
              render: (_: unknown, record: Reservation) => {
                const session = sessions[record.reservationId];
                if (!session) {
                  return '-';
                }
                const item = sessionStatusMap[session.sessionStatus] || {
                  color: 'default',
                  text: session.sessionStatus,
                };
                return <Tag color={item.color}>{item.text}</Tag>;
              },
            },
            {
              title: '操作',
              key: 'actions',
              width: 280,
              render: (_: unknown, record: Reservation) => {
                const session = sessions[record.reservationId];
                return (
                  <Space size={4} wrap>
                    {record.reservationStatus === 'CONFIRMED' && (
                      <>
                        <Button
                          size="small"
                          type="primary"
                          icon={<CheckCircleOutlined />}
                          onClick={() => {
                            void handleSessionAction(record.reservationId, 'checkIn');
                          }}
                        >
                          签到
                        </Button>
                        <Button
                          size="small"
                          danger
                          icon={<CloseCircleOutlined />}
                          onClick={() => {
                            setCancelTarget(record.reservationId);
                            setCancelModalOpen(true);
                          }}
                        >
                          取消
                        </Button>
                      </>
                    )}
                    {session?.sessionStatus === 'IN_USE' && (
                      <>
                        <Button
                          size="small"
                          icon={<PauseCircleOutlined />}
                          onClick={() => {
                            void handleSessionAction(record.reservationId, 'tempHold');
                          }}
                        >
                          暂离
                        </Button>
                        <Button
                          size="small"
                          icon={<LogoutOutlined />}
                          onClick={() => {
                            void handleSessionAction(record.reservationId, 'checkOut');
                          }}
                        >
                          签退
                        </Button>
                      </>
                    )}
                    {session?.sessionStatus === 'TEMP_HOLD' && (
                      <>
                        <Button
                          size="small"
                          type="primary"
                          icon={<PlayCircleOutlined />}
                          onClick={() => {
                            void handleSessionAction(record.reservationId, 'resume');
                          }}
                        >
                          恢复
                        </Button>
                        <Button
                          size="small"
                          icon={<LogoutOutlined />}
                          onClick={() => {
                            void handleSessionAction(record.reservationId, 'checkOut');
                          }}
                        >
                          签退
                        </Button>
                      </>
                    )}
                  </Space>
                );
              },
            },
          ]}
          dataSource={reservations}
          rowKey="reservationId"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1120 }}
        />
      </Card>

      <Modal
        title="取消预约"
        open={cancelModalOpen}
        onOk={() => {
          void handleCancel();
        }}
        onCancel={() => {
          setCancelModalOpen(false);
          setCancelReason('');
        }}
        okText="确认取消"
        cancelText="返回"
      >
        <Input.TextArea
          value={cancelReason}
          onChange={(event) => setCancelReason(event.target.value)}
          placeholder="请输入取消原因（选填）"
          rows={3}
          style={{ marginTop: 12 }}
        />
      </Modal>
    </div>
  );
}
