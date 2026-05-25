import { useEffect, useState } from 'react';
import { Button, Card, Empty, message, Popconfirm, Table, Tag, Typography, Input } from 'antd';
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
import { pageVariants } from '@/constants/motionVariants';
import PageHeader from '@/components/PageHeader';
import StatsCardRow from '@/components/StatsCardRow';

const { Text } = Typography;

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

  const statsCardData = [
    { title: '总用户数', value: stats.total, icon: <TeamOutlined />, color: 'var(--primary)' },
    { title: '正常用户', value: stats.active, icon: <CheckCircleOutlined />, color: 'var(--emerald)' },
    { title: '管理员', value: stats.admin, icon: <UserSwitchOutlined />, color: 'var(--purple)' },
    { title: '已停用', value: stats.suspended, icon: <CloseCircleOutlined />, color: 'var(--danger)' },
  ];

  const columns: ColumnsType<User> = [
    {
      title: '用户编号',
      dataIndex: 'userNo',
      width: 130,
      render: (v) => <Text strong className="monospace-code">{v}</Text>,
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
        <Tag color={v === 'ADMIN' ? 'purple' : v === 'STUDENT' ? 'blue' : 'cyan'} className="status-tag">
          {userTypeMap[v] || v}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'accountStatus',
      width: 100,
      render: (v) => (
        <Tag color={accountStatusColorMap[v]} className="status-tag">
          {accountStatusMap[v] || v}
        </Tag>
      ),
    },
    {
      title: '信用分',
      dataIndex: 'creditScore',
      width: 90,
      render: (v) => {
        const isExcellent = (v ?? 0) >= 80;
        const isFair = (v ?? 0) >= 60;
        const color = isExcellent ? 'var(--emerald)' : isFair ? 'var(--amber)' : 'var(--danger)';
        return (
          <Text strong style={{ color }}>
            {v ?? '-'}
          </Text>
        );
      },
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
            >
              {isActive ? '停用' : '启用'}
            </Button>
          </Popconfirm>
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
        title="用户管理"
        subtitle="管理系统用户，查看状态并进行启用/停用操作"
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
            placeholder="搜索用户编号、姓名或类型..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            style={{ maxWidth: 320 }}
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
