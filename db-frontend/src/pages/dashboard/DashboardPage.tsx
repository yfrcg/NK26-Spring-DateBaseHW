import { useEffect, useEffectEvent, useState } from 'react';
import {
  CalendarOutlined,
  CheckCircleOutlined,
  DollarOutlined,
  ExclamationCircleOutlined,
  TeamOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { Card, Col, Row, Spin, Statistic, Table, Tag, Typography } from 'antd';
import { reportApi } from '@/api';
import { creditEventMap } from '@/constants/domain';
import type { CreditEventStatVO, DashboardVO, TopSpaceVO } from '@/types';
import { logError } from '@/utils/logError';

const { Title } = Typography;

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardVO | null>(null);
  const [topSpaces, setTopSpaces] = useState<TopSpaceVO[]>([]);
  const [creditEvents, setCreditEvents] = useState<CreditEventStatVO[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useEffectEvent(async () => {
    setLoading(true);
    try {
      const [dashRes, topRes, creditRes] = await Promise.all([
        reportApi.getDashboard(),
        reportApi.getTopSpaces(5),
        reportApi.getCreditEvents(),
      ]);
      setDashboard(dashRes.data.data);
      setTopSpaces(topRes.data.data);
      setCreditEvents(creditRes.data.data);
    } catch (error) {
      logError(error);
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    void fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  const statCards = dashboard
    ? [
        {
          title: '今日预约',
          value: dashboard.todayReservationCount,
          icon: <CalendarOutlined style={{ fontSize: 28 }} />,
          color: '#1890ff',
        },
        {
          title: '今日签到',
          value: dashboard.todayCheckInCount,
          icon: <CheckCircleOutlined style={{ fontSize: 28 }} />,
          color: '#52c41a',
        },
        {
          title: '今日收入',
          value: dashboard.todayRevenue,
          icon: <DollarOutlined style={{ fontSize: 28 }} />,
          color: '#faad14',
          prefix: '¥',
        },
        {
          title: '未付账单',
          value: dashboard.unpaidBillCount,
          icon: <ExclamationCircleOutlined style={{ fontSize: 28 }} />,
          color: '#ff4d4f',
        },
        {
          title: '活跃用户',
          value: dashboard.activeUserCount,
          icon: <TeamOutlined style={{ fontSize: 28 }} />,
          color: '#722ed1',
        },
      ]
    : [];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>
        系统概览
      </Title>

      <Row gutter={[16, 16]}>
        {statCards.map((item) => (
          <Col xs={24} sm={12} md={8} lg={4} key={item.title}>
            <Card hoverable style={{ borderRadius: 8 }}>
              <Statistic
                title={item.title}
                value={item.value}
                prefix={item.prefix || item.icon}
                valueStyle={{ color: item.color, fontSize: 24 }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={14}>
          <Card
            title={
              <span>
                <TrophyOutlined style={{ marginRight: 8, color: '#faad14' }} />
                热门空间 TOP 5
              </span>
            }
            style={{ borderRadius: 8 }}
          >
            <Table
              columns={[
                {
                  title: '排名',
                  key: 'rank',
                  width: 70,
                  render: (_: unknown, __: unknown, index: number) => (
                    <Tag color={index < 3 ? 'gold' : 'default'}>{index + 1}</Tag>
                  ),
                },
                { title: '空间名称', dataIndex: 'spaceName', key: 'spaceName' },
                {
                  title: '预约次数',
                  dataIndex: 'reservationCount',
                  key: 'reservationCount',
                  render: (value: number) => <span style={{ fontWeight: 600 }}>{value}</span>,
                },
              ]}
              dataSource={topSpaces}
              rowKey="spaceId"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card
            title={
              <span>
                <CheckCircleOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                信用事件统计
              </span>
            }
            style={{ borderRadius: 8 }}
          >
            <Table
              columns={[
                {
                  title: '事件类型',
                  dataIndex: 'eventType',
                  key: 'eventType',
                  render: (value: string) => {
                    const item = creditEventMap[value] || { color: 'default', text: value };
                    return <Tag color={item.color}>{item.text}</Tag>;
                  },
                },
                {
                  title: '事件次数',
                  dataIndex: 'eventCount',
                  key: 'eventCount',
                  render: (value: number) => <span style={{ fontWeight: 600 }}>{value}</span>,
                },
              ]}
              dataSource={creditEvents}
              rowKey="eventType"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
