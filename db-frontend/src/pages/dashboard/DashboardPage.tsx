import { useEffect, useState } from 'react';
import { Card, Col, Empty, List, Row, Space, Spin, Tag, Tooltip, Typography } from 'antd';
import {
  BarChartOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  DollarOutlined,
  FireOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { reportApi } from '@/api';
import heroImage from '@/assets/workspace-hero.svg';
import { creditEventMap, creditEventColorMap } from '@/constants/domain';
import type { DashboardVO, TopSpaceVO, CreditEventStatVO } from '@/types';
import { logError } from '@/utils/logError';

const { Title, Text } = Typography;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const PIE_COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#0891b2', '#ec4899'];

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  gradient: string;
  delay?: number;
}

function StatCard({ title, value, icon, gradient, delay = 0 }: StatCardProps) {
  return (
    <motion.div variants={itemVariants} custom={delay}>
      <Card
        className="metric-card"
        style={{
          borderRadius: 12,
          border: 'none',
          overflow: 'hidden',
          position: 'relative',
          background: '#fff',
          height: '100%',
        }}
        styles={{ body: { padding: '24px' } }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: gradient,
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <Text style={{ color: '#64748b', fontSize: 13, fontWeight: 500 }}>{title}</Text>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#0f172a', marginTop: 4, lineHeight: 1.2 }}>
              {value}
            </div>
          </div>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 22,
              boxShadow: '0 12px 24px rgba(15, 23, 42, 0.16)',
            }}
          >
            {icon}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.9)',
          backdropFilter: 'blur(8px)',
          padding: '12px 16px',
          borderRadius: 10,
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        }}
      >
        <div style={{ color: '#e2e8f0', fontWeight: 600, marginBottom: 6 }}>{label}</div>
        {payload.map((p: any, i: number) => (
          <div key={i} style={{ color: p.color || '#94a3b8', fontSize: 13 }}>
            {p.name}: <strong style={{ color: '#fff' }}>{p.value}</strong>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardVO | null>(null);
  const [topSpaces, setTopSpaces] = useState<TopSpaceVO[]>([]);
  const [creditEvents, setCreditEvents] = useState<CreditEventStatVO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [dRes, tRes, cRes] = await Promise.all([
          reportApi.getDashboard(),
          reportApi.getTopSpaces(5),
          reportApi.getCreditEvents(),
        ]);
        setDashboard(dRes.data.data);
        setTopSpaces(tRes.data.data);
        setCreditEvents(cRes.data.data);
      } catch (error) {
        logError(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  const barData = topSpaces.map((s) => ({
    name: s.spaceName,
    预约次数: s.reservationCount,
  }));

  const pieData = creditEvents
    .filter((e) => e.eventCount > 0)
    .map((e) => ({
      name: creditEventMap[e.eventType] || e.eventType,
      value: e.eventCount,
    }));

  return (
    <motion.div className="dashboard-page" variants={containerVariants} initial="hidden" animate="visible">
      <div className="dashboard-hero">
        <div className="dashboard-hero-copy">
          <Text className="dashboard-hero-label">Operations Console</Text>
          <Title level={2} className="dashboard-hero-title">
            空间预约运营驾驶舱
          </Title>
          <Text className="dashboard-hero-text">
            聚合预约、签到、账单和信用事件，帮助管理员快速判断今日空间使用状态。
          </Text>
          <div className="dashboard-hero-actions">
            <span>自动刷新报表</span>
            <span>9 表业务模型</span>
            <span>FastAPI + React</span>
          </div>
        </div>
        <div className="dashboard-hero-visual">
          <img src={heroImage} alt="空间预约运营看板" />
          <div className="dashboard-hero-card">
            <span>今日预约</span>
            <strong>{dashboard?.todayReservationCount ?? 0}</strong>
          </div>
        </div>
      </div>

      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="今日预约数"
            value={dashboard?.todayReservationCount ?? 0}
            icon={<CalendarOutlined />}
            gradient="linear-gradient(135deg, #2563eb 0%, #0891b2 100%)"
            delay={0}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="今日签到数"
            value={dashboard?.todayCheckInCount ?? 0}
            icon={<CheckCircleOutlined />}
            gradient="linear-gradient(135deg, #10b981 0%, #34d399 100%)"
            delay={1}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="今日收入（元）"
            value={dashboard?.todayRevenue?.toFixed(2) ?? '0.00'}
            icon={<DollarOutlined />}
            gradient="linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)"
            delay={2}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="活跃用户数"
            value={dashboard?.activeUserCount ?? 0}
            icon={<TeamOutlined />}
            gradient="linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)"
            delay={3}
          />
        </Col>
      </Row>

      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="未结清账单"
            value={(dashboard as any)?.unpaidBillCount ?? dashboard?.unpaidBillCount ?? 0}
            icon={<WarningOutlined />}
            gradient="linear-gradient(135deg, #ef4444 0%, #f87171 100%)"
            delay={4}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="今日爽约数"
            value={(dashboard as any)?.todayNoShowCount ?? 0}
            icon={<ThunderboltOutlined />}
            gradient="linear-gradient(135deg, #f97316 0%, #fb923c 100%)"
            delay={5}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="今日充值（元）"
            value={((dashboard as any)?.todayRechargeAmount ?? 0).toFixed(2)}
            icon={<BarChartOutlined />}
            gradient="linear-gradient(135deg, #0891b2 0%, #a78bfa 100%)"
            delay={6}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="今日消费（元）"
            value={((dashboard as any)?.todayConsumeAmount ?? 0).toFixed(2)}
            icon={<FireOutlined />}
            gradient="linear-gradient(135deg, #ec4899 0%, #f472b6 100%)"
            delay={7}
          />
        </Col>
      </Row>

      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={14}>
          <motion.div variants={itemVariants}>
            <Card
              title={
                <Space>
                  <FireOutlined style={{ color: '#ef4444' }} />
                  <span style={{ fontWeight: 600 }}>热门空间排行 TOP 5</span>
                </Space>
              }
              style={{ borderRadius: 16, border: 'none', height: '100%' }}
              styles={{ body: { padding: '16px 24px 24px' } }}
            >
              {topSpaces.length > 0 ? (
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={barData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.06)' }} />
                    <Bar dataKey="预约次数" radius={[8, 8, 0, 0]} maxBarSize={48}>
                      {barData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Empty description="暂无数据" />
              )}
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} lg={10}>
          <motion.div variants={itemVariants}>
            <Card
              title={
                <Space>
                  <BarChartOutlined style={{ color: '#2563eb' }} />
                  <span style={{ fontWeight: 600 }}>信用事件分布</span>
                </Space>
              }
              style={{ borderRadius: 16, border: 'none', height: '100%' }}
              styles={{ body: { padding: '16px 24px 24px' } }}
            >
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                      label={({ name, percent }: any) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend
                      verticalAlign="bottom"
                      iconType="circle"
                      iconSize={8}
                      formatter={(value) => <span style={{ color: '#475569', fontSize: 12 }}>{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Empty description="暂无信用事件数据" />
              )}
            </Card>
          </motion.div>
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        <Col xs={24} lg={12}>
          <motion.div variants={itemVariants}>
            <Card
              title={
                <Space>
                  <FireOutlined style={{ color: '#f59e0b' }} />
                  <span style={{ fontWeight: 600 }}>热门空间详情</span>
                </Space>
              }
              style={{ borderRadius: 16, border: 'none' }}
              styles={{ body: { padding: '4px 0' } }}
            >
              {topSpaces.length > 0 ? (
                <List
                  dataSource={topSpaces}
                  renderItem={(item, index) => (
                    <List.Item style={{ padding: '14px 24px', borderBottom: index < topSpaces.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%' }}>
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            background: `${PIE_COLORS[index % PIE_COLORS.length]}15`,
                            color: PIE_COLORS[index % PIE_COLORS.length],
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: 15,
                            flexShrink: 0,
                          }}
                        >
                          {index + 1}
                        </div>
                        <div style={{ flex: 1 }}>
                          <Text strong style={{ fontSize: 14 }}>{item.spaceName}</Text>
                        </div>
                        <Tooltip title="累计预约次数">
                          <Tag
                            color="blue"
                            style={{
                              borderRadius: 20,
                              padding: '2px 12px',
                              fontSize: 13,
                              fontWeight: 600,
                            }}
                          >
                            {item.reservationCount} 次
                          </Tag>
                        </Tooltip>
                      </div>
                    </List.Item>
                  )}
                />
              ) : (
                <Empty description="暂无数据" />
              )}
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} lg={12}>
          <motion.div variants={itemVariants}>
            <Card
              title={
                <Space>
                  <BarChartOutlined style={{ color: '#2563eb' }} />
                  <span style={{ fontWeight: 600 }}>信用事件明细</span>
                </Space>
              }
              style={{ borderRadius: 16, border: 'none' }}
              styles={{ body: { padding: '4px 0' } }}
            >
              {creditEvents.length > 0 ? (
                <List
                  dataSource={creditEvents}
                  renderItem={(item, index) => (
                    <List.Item style={{ padding: '14px 24px', borderBottom: index < creditEvents.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%' }}>
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            background: '#f1f5f9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <BarChartOutlined style={{ color: '#64748b' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <Tag
                            color={creditEventColorMap[item.eventType] || 'default'}
                            style={{ borderRadius: 20, fontWeight: 500, border: 'none' }}
                          >
                            {creditEventMap[item.eventType] || item.eventType}
                          </Tag>
                        </div>
                        <Text strong style={{ fontSize: 15, color: '#334155' }}>
                          {item.eventCount} 次
                        </Text>
                      </div>
                    </List.Item>
                  )}
                />
              ) : (
                <Empty description="暂无数据" />
              )}
            </Card>
          </motion.div>
        </Col>
      </Row>
    </motion.div>
  );
}
