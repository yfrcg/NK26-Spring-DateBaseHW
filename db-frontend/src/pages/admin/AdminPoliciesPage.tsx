import { useEffect, useEffectEvent, useState } from 'react';
import { CheckCircleOutlined, StopOutlined } from '@ant-design/icons';
import { Button, Card, Popconfirm, Space, Table, Tag, Typography, message } from 'antd';
import dayjs from 'dayjs';
import { adminApi } from '@/api';
import { chargeModeMap } from '@/constants/domain';
import type { PricingPolicy } from '@/types';
import { logError } from '@/utils/logError';

const { Title } = Typography;

export default function AdminPoliciesPage() {
  const [policies, setPolicies] = useState<PricingPolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  const fetchPolicies = useEffectEvent(async () => {
    setLoading(true);
    try {
      const res = await adminApi.policy.list();
      setPolicies(res.data.data);
    } catch (error) {
      logError(error);
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    void fetchPolicies();
  }, [reloadKey]);

  const handleToggle = async (policyId: number, action: 'enable' | 'disable') => {
    try {
      const fn = action === 'enable' ? adminApi.policy.enable : adminApi.policy.disable;
      await fn(policyId);
      message.success(action === 'enable' ? '策略已启用' : '策略已停用');
      setReloadKey((current) => current + 1);
    } catch (error) {
      logError(error);
    }
  };

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>
        计费策略管理
      </Title>
      <Card style={{ borderRadius: 8 }}>
        <Table
          columns={[
            { title: 'ID', dataIndex: 'policyId', key: 'policyId', width: 60 },
            { title: '策略编码', dataIndex: 'policyCode', key: 'policyCode', width: 140 },
            { title: '策略名称', dataIndex: 'policyName', key: 'policyName', width: 180 },
            {
              title: '计费模式',
              dataIndex: 'chargeMode',
              key: 'chargeMode',
              width: 110,
              render: (value: string) => <Tag color="blue">{chargeModeMap[value] || value}</Tag>,
            },
            {
              title: '时价',
              dataIndex: 'hourlyPrice',
              key: 'hourlyPrice',
              width: 90,
              render: (value: number) => `¥${value.toFixed(2)}`,
            },
            {
              title: '免费分钟',
              dataIndex: 'freeMinutes',
              key: 'freeMinutes',
              width: 90,
              render: (value: number) => `${value} 分钟`,
            },
            {
              title: '最大预约时长',
              dataIndex: 'maxReserveHours',
              key: 'maxReserveHours',
              width: 120,
              render: (value: number) => `${value} 小时`,
            },
            {
              title: '押金',
              dataIndex: 'depositAmount',
              key: 'depositAmount',
              width: 90,
              render: (value: number) => `¥${value.toFixed(2)}`,
            },
            {
              title: '超时倍率',
              dataIndex: 'overtimePriceMultiplier',
              key: 'overtimePriceMultiplier',
              width: 90,
              render: (value: number) => `${value}x`,
            },
            {
              title: '允许暂离',
              dataIndex: 'allowTempHold',
              key: 'allowTempHold',
              width: 90,
              render: (value: number) =>
                value ? <Tag color="green">是</Tag> : <Tag color="red">否</Tag>,
            },
            {
              title: '状态',
              dataIndex: 'isActive',
              key: 'isActive',
              width: 80,
              render: (value: number) =>
                value ? <Tag color="green">启用</Tag> : <Tag color="red">停用</Tag>,
            },
            {
              title: '有效期',
              key: 'validPeriod',
              width: 220,
              render: (_: unknown, record: PricingPolicy) =>
                `${dayjs(record.validFrom).format('YYYY-MM-DD')} ~ ${
                  record.validTo ? dayjs(record.validTo).format('YYYY-MM-DD') : '无限期'
                }`,
            },
            {
              title: '操作',
              key: 'actions',
              width: 120,
              render: (_: unknown, record: PricingPolicy) => (
                <Space size={4}>
                  {record.isActive ? (
                    <Popconfirm
                      title="确认停用该策略吗？"
                      onConfirm={() => {
                        void handleToggle(record.policyId, 'disable');
                      }}
                    >
                      <Button size="small" danger icon={<StopOutlined />}>
                        停用
                      </Button>
                    </Popconfirm>
                  ) : (
                    <Popconfirm
                      title="确认启用该策略吗？"
                      onConfirm={() => {
                        void handleToggle(record.policyId, 'enable');
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
          dataSource={policies}
          rowKey="policyId"
          loading={loading}
          pagination={{ pageSize: 15 }}
          scroll={{ x: 1460 }}
          size="small"
        />
      </Card>
    </div>
  );
}
