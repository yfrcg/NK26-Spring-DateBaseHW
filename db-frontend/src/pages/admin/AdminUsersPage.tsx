import { useEffect, useState } from 'react';
import { Button, Card, Col, Empty, message, Popconfirm, Row, Statistic, Table, Tag, Typography, Input } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
  SearchOutlined,
  TeamOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { adminApi } from '@/api';
import { userTypeMap, accountStatusMap, accountStatusColorMap } from '@/constants/domain';
import type { User } from '@/types';
import { logError } from '@/utils/logError';

const { Title, Text } = Typography;

export default function AdminUsersPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminApi.user.list();
      setUsers(res.data.data);
    } catch (error) {
      logError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleStatus = async (userId: number, activate: boolean) => {
    setActionLoading(userId);
    try {
      if (activate) {
        await adminApi.user.activate(userId);
        message.success('用户已启用');
      } else {
        await adminApi.user.suspend(userId);
        message.success('用户已停用');
      }
      await load();
    } catch (error) {
      logError(error);
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = search
    ? users.filter((u) =>
        u.realName.toLowerCase().includes(search.toLowerCase()) ||
        u.userNo.toLowerCase().includes(search.toLowerCase()) ||
        (userTypeMap[u.userType] || '').includes(search)
      )
    : users;

  const stats = {
    total: users.length,
    active: users.filter((u) => u.accountStatus === 'ACTIVE').length,
    admin: users.filter((u) => u.userType === 'ADMIN').length,
    suspended: users.filter((u) => u.accountStatus === 'SUSPENDED').length,
  };

  const columns: ColumnsType<User> = [
    {
      title: '用户编号',
      dataIndex: 'userNo',
      width: 130,
      render: (v) => <Text strong style={{ fontFamily: 'monospace' }}>{v}</Text>,
    },
    {
      title: '姓名',
      dataIndex: 'realName',
      width: 100,
    },
    {
      title: '类型',
      dataIndex: 'userType',
      width: 100,
      render: (v) => (
        <Tag color={v === 'ADMIN' ? 'purple' : v === 'STUDENT' ? 'blue' : 'cyan'} style={{ borderRadius: 20, border: 'none' }}>
          {userTypeMap[v] || v}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'accountStatus',
      width: 100,
      render: (v) => (
        <Tag color={accountStatusColorMap[v]} style={{ borderRadius: 20, border: 'none' }}>
          {accountStatusMap[v] || v}
        </Tag>
      ),
    },
    {
      title: '信用分',
      dataIndex: 'creditScore',
      width: 90,
      render: (v) => (
        <Text strong style={{ color: v >= 800 ? '#10b981' : v >= 600 ? '#f59e0b' : '#ef4444' }}>
          {v ?? '-'}
        </Text>
      ),
    },
    { title: '手机号', dataIndex: 'phone', width: 130, render: (v) => v || '-' },
    { title: '邮箱', dataIndex: 'email', width: 180, ellipsis: true, render: (v) => v || '-' },
    {
      title: '最后登录',
      dataIndex: 'lastLoginTime',
      width: 170,
      render: (v) => v ? dayjs(v).format('YYYY-MM-DD HH:mm') : '-',
    },
    {
      title: '操作',
      width: 130,
      fixed: 'right',
      render: (_, r) => {
        const isLoading = actionLoading === r.userId;
        const isActive = r.accountStatus === 'ACTIVE';
        return (
          <Popconfirm
            title={isActive ? '确认停用此用户？' : '确认启用此用户？'}
            onConfirm={() => toggleStatus(r.userId, !isActive)}
            okText="确认"
            cancelText="取消"
          >
            <Button
              type={isActive ? 'default' : 'primary'}
              danger={isActive}
              size="small"
              loading={isLoading}
              icon={isActive ? <CloseCircleOutlined /> : <CheckCircleOutlined />}
              style={{ borderRadius: 8 }}
            >
              {isActive ? '停用' : '启用'}
            </Button>
          </Popconfirm>
        );
      },
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <Title level={3} style={{ marginBottom: 4 }}>
            <TeamOutlined style={{ marginRight: 8, color: '#2563eb' }} />
            用户管理
          </Title>
          <Text type="secondary">管理系统用户，查看状态并进行启用/停用操作</Text>
        </div>
        <Button icon={<ReloadOutlined />} onClick={load} style={{ borderRadius: 8 }}>
          刷新
        </Button>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {[
          { label: '总用户数', value: stats.total, icon: <TeamOutlined />, color: '#2563eb' },
          { label: '正常用户', value: stats.active, icon: <CheckCircleOutlined />, color: '#10b981' },
          { label: '管理员', value: stats.admin, icon: <UserSwitchOutlined />, color: '#0891b2' },
          { label: '已停用', value: stats.suspended, icon: <CloseCircleOutlined />, color: '#ef4444' },
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
            placeholder="搜索用户编号、姓名或类型..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            style={{ maxWidth: 320, borderRadius: 10 }}
          />
        </div>
        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="userId"
          loading={loading}
          pagination={{ pageSize: 10, showTotal: (t) => `共 ${t} 个用户`, showSizeChanger: false }}
          scroll={{ x: 1100 }}
          locale={{ emptyText: <Empty description="暂无用户数据" /> }}
        />
      </Card>
    </motion.div>
  );
}
