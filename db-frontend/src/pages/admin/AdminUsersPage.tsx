import { useEffect, useEffectEvent, useState } from 'react';
import { CheckCircleOutlined, StopOutlined } from '@ant-design/icons';
import { Button, Card, Popconfirm, Space, Table, Tag, Typography, message } from 'antd';
import dayjs from 'dayjs';
import { adminApi } from '@/api';
import { accountStatusMap, userTypeMap } from '@/constants/domain';
import type { User } from '@/types';
import { logError } from '@/utils/logError';

const { Title } = Typography;

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  const fetchUsers = useEffectEvent(async () => {
    setLoading(true);
    try {
      const res = await adminApi.user.list();
      setUsers(res.data.data);
    } catch (error) {
      logError(error);
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    void fetchUsers();
  }, [reloadKey]);

  const handleStatusChange = async (userId: number, action: 'suspend' | 'activate') => {
    const fn = action === 'suspend' ? adminApi.user.suspend : adminApi.user.activate;
    try {
      await fn(userId);
      message.success(action === 'suspend' ? '用户已停用' : '用户已启用');
      setReloadKey((current) => current + 1);
    } catch (error) {
      logError(error);
    }
  };

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>
        用户管理
      </Title>
      <Card style={{ borderRadius: 8 }}>
        <Table
          columns={[
            { title: 'ID', dataIndex: 'userId', key: 'userId', width: 60 },
            { title: '用户编号', dataIndex: 'userNo', key: 'userNo', width: 120 },
            { title: '姓名', dataIndex: 'realName', key: 'realName', width: 100 },
            {
              title: '手机号',
              dataIndex: 'phone',
              key: 'phone',
              width: 120,
              render: (value: string | null) => value || '-',
            },
            {
              title: '邮箱',
              dataIndex: 'email',
              key: 'email',
              width: 200,
              ellipsis: true,
              render: (value: string | null) => value || '-',
            },
            {
              title: '类型',
              dataIndex: 'userType',
              key: 'userType',
              width: 100,
              render: (value: string) => <Tag color="blue">{userTypeMap[value] || value}</Tag>,
            },
            {
              title: '状态',
              dataIndex: 'accountStatus',
              key: 'accountStatus',
              width: 110,
              render: (value: string) => {
                const item = accountStatusMap[value] || { color: 'default', text: value };
                return <Tag color={item.color}>{item.text}</Tag>;
              },
            },
            {
              title: '信用分',
              dataIndex: 'creditScore',
              key: 'creditScore',
              width: 90,
              render: (value: number) => (
                <span
                  style={{
                    color: value >= 80 ? '#52c41a' : value >= 60 ? '#faad14' : '#ff4d4f',
                    fontWeight: 600,
                  }}
                >
                  {value}
                </span>
              ),
            },
            {
              title: '注册时间',
              dataIndex: 'createdAt',
              key: 'createdAt',
              width: 160,
              render: (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm'),
            },
            {
              title: '操作',
              key: 'actions',
              width: 140,
              render: (_: unknown, record: User) => (
                <Space size={4}>
                  {record.accountStatus === 'ACTIVE' ? (
                    <Popconfirm
                      title="确认停用该用户吗？"
                      onConfirm={() => {
                        void handleStatusChange(record.userId, 'suspend');
                      }}
                    >
                      <Button size="small" danger icon={<StopOutlined />}>
                        停用
                      </Button>
                    </Popconfirm>
                  ) : (
                    <Popconfirm
                      title="确认启用该用户吗？"
                      onConfirm={() => {
                        void handleStatusChange(record.userId, 'activate');
                      }}
                    >
                      <Button size="small" type="primary" icon={<CheckCircleOutlined />}>
                        启用
                      </Button>
                    </Popconfirm>
                  )}
                </Space>
              ),
            },
          ]}
          dataSource={users}
          rowKey="userId"
          loading={loading}
          pagination={{ pageSize: 15 }}
          scroll={{ x: 1180 }}
        />
      </Card>
    </div>
  );
}
