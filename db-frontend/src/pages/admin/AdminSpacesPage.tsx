import { useEffect, useEffectEvent, useState } from 'react';
import { CheckCircleOutlined, StopOutlined, ToolOutlined } from '@ant-design/icons';
import { Button, Card, Popconfirm, Space as AntSpace, Table, Tag, Typography, message } from 'antd';
import dayjs from 'dayjs';
import { adminApi } from '@/api';
import { spaceStatusMap, spaceTypeMap } from '@/constants/domain';
import type { Space } from '@/types';
import { logError } from '@/utils/logError';

const { Title } = Typography;

export default function AdminSpacesPage() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  const fetchSpaces = useEffectEvent(async () => {
    setLoading(true);
    try {
      const res = await adminApi.space.list();
      setSpaces(res.data.data);
    } catch (error) {
      logError(error);
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    void fetchSpaces();
  }, [reloadKey]);

  const handleAction = async (spaceId: number, action: 'disable' | 'activate' | 'maintenance') => {
    try {
      const fn = {
        disable: adminApi.space.disable,
        activate: adminApi.space.activate,
        maintenance: adminApi.space.maintenance,
      }[action];
      await fn(spaceId);
      message.success(
        action === 'disable' ? '空间已停用' : action === 'activate' ? '空间已启用' : '空间已设为维护中'
      );
      setReloadKey((current) => current + 1);
    } catch (error) {
      logError(error);
    }
  };

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>
        空间管理
      </Title>
      <Card style={{ borderRadius: 8 }}>
        <Table
          columns={[
            { title: 'ID', dataIndex: 'spaceId', key: 'spaceId', width: 60 },
            { title: '空间编号', dataIndex: 'spaceCode', key: 'spaceCode', width: 120 },
            { title: '空间名称', dataIndex: 'spaceName', key: 'spaceName', width: 160 },
            {
              title: '类型',
              dataIndex: 'spaceType',
              key: 'spaceType',
              width: 100,
              render: (value: string) => <Tag color="blue">{spaceTypeMap[value] || value}</Tag>,
            },
            {
              title: '容量',
              dataIndex: 'capacity',
              key: 'capacity',
              width: 70,
              render: (value: number) => `${value} 人`,
            },
            {
              title: '设备',
              dataIndex: 'equipmentDesc',
              key: 'equipmentDesc',
              width: 180,
              ellipsis: true,
              render: (value: string | null) => value || '-',
            },
            {
              title: '状态',
              dataIndex: 'status',
              key: 'status',
              width: 100,
              render: (value: string) => {
                const item = spaceStatusMap[value] || { color: 'default', text: value };
                return <Tag color={item.color}>{item.text}</Tag>;
              },
            },
            {
              title: '创建时间',
              dataIndex: 'createdAt',
              key: 'createdAt',
              width: 160,
              render: (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm'),
            },
            {
              title: '操作',
              key: 'actions',
              width: 220,
              render: (_: unknown, record: Space) => (
                <AntSpace size={4} wrap>
                  {record.status !== 'ACTIVE' && (
                    <Popconfirm
                      title="确认启用该空间吗？"
                      onConfirm={() => {
                        void handleAction(record.spaceId, 'activate');
                      }}
                    >
                      <Button size="small" type="primary" icon={<CheckCircleOutlined />}>
                        启用
                      </Button>
                    </Popconfirm>
                  )}
                  {record.status !== 'DISABLED' && (
                    <Popconfirm
                      title="确认停用该空间吗？"
                      onConfirm={() => {
                        void handleAction(record.spaceId, 'disable');
                      }}
                    >
                      <Button size="small" danger icon={<StopOutlined />}>
                        停用
                      </Button>
                    </Popconfirm>
                  )}
                  {record.status !== 'MAINTENANCE' && (
                    <Popconfirm
                      title="确认设为维护中吗？"
                      onConfirm={() => {
                        void handleAction(record.spaceId, 'maintenance');
                      }}
                    >
                      <Button size="small" icon={<ToolOutlined />}>
                        维护
                      </Button>
                    </Popconfirm>
                  )}
                </AntSpace>
              ),
            },
          ]}
          dataSource={spaces}
          rowKey="spaceId"
          loading={loading}
          pagination={{ pageSize: 15 }}
          scroll={{ x: 1220 }}
        />
      </Card>
    </div>
  );
}
