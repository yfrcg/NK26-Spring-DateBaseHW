import { useEffect, useEffectEvent, useState } from 'react';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Button, Card, Input, Modal, Table, Tag, Typography, message } from 'antd';
import dayjs from 'dayjs';
import { adminApi } from '@/api';
import { reservationStatusMap } from '@/constants/domain';
import type { Reservation } from '@/types';
import { logError } from '@/utils/logError';

const { Title } = Typography;

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<number | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  const fetchReservations = useEffectEvent(async () => {
    setLoading(true);
    try {
      const res = await adminApi.reservation.list();
      setReservations(res.data.data);
    } catch (error) {
      logError(error);
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    void fetchReservations();
  }, [reloadKey]);

  const handleCancel = async () => {
    if (!cancelTarget) {
      return;
    }

    try {
      await adminApi.reservation.cancel(cancelTarget, cancelReason || undefined);
      message.success('预约已取消');
      setCancelModalOpen(false);
      setCancelReason('');
      setCancelTarget(null);
      setReloadKey((current) => current + 1);
    } catch (error) {
      logError(error);
    }
  };

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>
        预约管理
      </Title>
      <Card style={{ borderRadius: 8 }}>
        <Table
          columns={[
            { title: 'ID', dataIndex: 'reservationId', key: 'reservationId', width: 60 },
            { title: '预约编号', dataIndex: 'reservationNo', key: 'reservationNo', width: 180, ellipsis: true },
            { title: '用户 ID', dataIndex: 'userId', key: 'userId', width: 80 },
            { title: '空间 ID', dataIndex: 'spaceId', key: 'spaceId', width: 80 },
            {
              title: '开始时间',
              dataIndex: 'startTime',
              key: 'startTime',
              width: 150,
              render: (value: string) => dayjs(value).format('MM-DD HH:mm'),
            },
            {
              title: '结束时间',
              dataIndex: 'endTime',
              key: 'endTime',
              width: 150,
              render: (value: string) => dayjs(value).format('MM-DD HH:mm'),
            },
            {
              title: '状态',
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
              title: '取消原因',
              dataIndex: 'cancelReason',
              key: 'cancelReason',
              width: 160,
              ellipsis: true,
              render: (value: string | null) => value || '-',
            },
            {
              title: '创建时间',
              dataIndex: 'createdAt',
              key: 'createdAt',
              width: 150,
              render: (value: string) => dayjs(value).format('MM-DD HH:mm'),
            },
            {
              title: '操作',
              key: 'actions',
              width: 110,
              render: (_: unknown, record: Reservation) => {
                if (
                  record.reservationStatus === 'CANCELLED' ||
                  record.reservationStatus === 'FINISHED' ||
                  record.reservationStatus === 'NO_SHOW'
                ) {
                  return '-';
                }

                return (
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
                );
              },
            },
          ]}
          dataSource={reservations}
          rowKey="reservationId"
          loading={loading}
          pagination={{ pageSize: 15 }}
          scroll={{ x: 1320 }}
        />
      </Card>

      <Modal
        title="管理员取消预约"
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
