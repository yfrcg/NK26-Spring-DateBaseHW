import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { Button, Empty, Spin, Tag, Typography } from 'antd';
import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  HomeOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { reportApi } from '@/api';
import { useAuthStore } from '@/stores/authStore';
import type { CreditEventStatVO, DashboardVO, TopSpaceVO } from '@/types';
import { logError } from '@/utils/logError';

const { Title } = Typography;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.28 } },
};

interface MetricTileProps {
  title: string;
  value: string | number;
  note: string;
  icon: ReactNode;
  tone: 'green' | 'blue' | 'amber';
}

const toneMap = {
  green: { bg: '#dcfce7', color: '#0f9f8f' },
  blue: { bg: '#dbeafe', color: '#2563eb' },
  amber: { bg: '#fef3c7', color: '#d97706' },
};

function MetricTile({ title, value, note, icon, tone }: MetricTileProps) {
  const color = toneMap[tone];
  return (
    <motion.div variants={itemVariants} className="metric-tile">
      <div className="metric-tile-icon" style={{ background: color.bg, color: color.color }}>
        {icon}
      </div>
      <span>{title}</span>
      <strong>{value}</strong>
      <small style={{ color: '#667085' }}>{note}</small>
    </motion.div>
  );
}

const roomNames = ['研讨室A', '多功能厅', '创客空间', '路演厅', '自习室B区'];
const spacePositions = ['0%', '25%', '50%', '75%', '100%'];

export default function DashboardPage() {
  const navigate = useNavigate();
  const { isAdmin } = useAuthStore();
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
        setTopSpaces(dRes.data.data.topSpaces?.length ? dRes.data.data.topSpaces : tRes.data.data);
        setCreditEvents(dRes.data.data.creditEvents?.length ? dRes.data.data.creditEvents : cRes.data.data);
      } catch (error) {
        logError(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const previewSpaces = useMemo(() => {
    const source = topSpaces.length
      ? topSpaces
      : roomNames.map((name, index) => ({ spaceId: index + 1, spaceName: name, reservationCount: 0 }));
    return source.slice(0, 5).map((space, index) => ({
      ...space,
      capacity: [6, 30, 12, 50, 40][index] ?? 8,
      pos: spacePositions[index] ?? '50%',
    }));
  }, [topSpaces]);

  const reviews = [
    { time: '05-20 09:15', room: '研讨室A', user: '李同学', range: '14:00-16:00', status: '待审核' },
    { time: '05-20 08:47', room: '多功能厅', user: '学生会', range: '09:00-12:00', status: '待审核' },
    { time: '05-19 17:32', room: '创客空间', user: '王同学', range: '10:00-12:00', status: '待确认' },
    { time: '05-19 16:05', room: '路演厅', user: '创业团队', range: '13:30-17:30', status: '待审核' },
  ];
  const reservationsPath = isAdmin ? '/admin/reservations' : '/reservations';

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <motion.div className="dashboard-grid" variants={containerVariants} initial="hidden" animate="visible">
      <div className="page-section-title">
        <div>
          <Title level={2}>今日概览</Title>
          <p>集中查看预约、签到、空间使用和信用事件。</p>
        </div>
        <Button type="primary" icon={<CalendarOutlined />} onClick={() => navigate(reservationsPath)}>
          查看全部预约
        </Button>
      </div>

      <div className="metric-strip">
        <MetricTile
          title="今日预约总数"
          value={dashboard?.todayReservationCount ?? 0}
          note="较昨日 +12%"
          icon={<CalendarOutlined />}
          tone="green"
        />
        <MetricTile
          title="今日签到人数"
          value={dashboard?.todayCheckInCount ?? 0}
          note="使用中空间持续同步"
          icon={<CheckCircleOutlined />}
          tone="blue"
        />
        <MetricTile
          title="活跃用户"
          value={dashboard?.activeUserCount ?? 0}
          note="学生与教师账号"
          icon={<TeamOutlined />}
          tone="green"
        />
        <MetricTile
          title="待处理预约"
          value={reviews.length}
          note="含审核与确认"
          icon={<ClockCircleOutlined />}
          tone="amber"
        />
        <MetricTile
          title="信用事件"
          value={creditEvents.reduce((sum, item) => sum + item.eventCount, 0)}
          note="履约记录自动累计"
          icon={<SafetyCertificateOutlined />}
          tone="green"
        />
      </div>

      <div className="ops-grid">
        <motion.section variants={itemVariants} className="timeline-card">
          <div className="panel-head">
            <div>
              <strong>可预约空间</strong>
              <span>2026年5月20日</span>
            </div>
            <Tag color="green">周视图</Tag>
          </div>
          <div className="timeline-board">
            <div className="timeline-days">
              <span />
              {['一 19', '二 20', '三 21', '四 22', '五 23', '六 24', '日 25'].map((day, index) => (
                <b key={day} style={index === 1 ? { color: '#fff', background: '#0f9f8f' } : undefined}>
                  {day}
                </b>
              ))}
            </div>
            {roomNames.map((room, index) => (
              <div className="timeline-row" key={room}>
                <div className="timeline-room">{room}</div>
                <div className="timeline-track">
                  <div
                    className="timeline-block"
                    style={{ gridColumn: `${(index % 4) + 1} / span ${index === 4 ? 9 : 2}` }}
                  >
                    08:00 可预约
                  </div>
                  <div
                    className="timeline-block booked"
                    style={{ gridColumn: `${index + 5} / span 2` }}
                  >
                    已预约
                  </div>
                  {index < 4 && (
                    <div className="timeline-block" style={{ gridColumn: `${index + 8} / span 2` }}>
                      16:30 可预约
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section variants={itemVariants} className="review-card">
          <div className="panel-head">
            <div>
              <strong>待处理预约</strong>
              <span>共 {reviews.length} 条</span>
            </div>
            <Button type="link" onClick={() => navigate(reservationsPath)}>查看全部</Button>
          </div>
          <div className="review-list">
            {reviews.map((item) => (
              <div className="review-row" key={`${item.time}-${item.room}`}>
                <div>
                  <strong>{item.room} · {item.user}</strong>
                  <span>{item.time} 申请，{item.range}</span>
                </div>
                <Tag color={item.status === '待确认' ? 'gold' : 'orange'}>{item.status}</Tag>
              </div>
            ))}
          </div>
        </motion.section>
      </div>

      <motion.section variants={itemVariants} className="space-preview-panel">
        <div className="panel-head">
          <div>
            <strong>空间浏览</strong>
            <span>热门空间与预约次数</span>
          </div>
          <Button type="link" icon={<HomeOutlined />} onClick={() => navigate('/spaces')}>
            查看详情
          </Button>
        </div>
        {previewSpaces.length ? (
          <div className="space-preview-grid">
            {previewSpaces.map((space) => (
              <div
                key={space.spaceId}
                className="mini-space-card"
                style={{ '--space-pos': space.pos } as CSSProperties}
              >
                <div>
                  <strong>{space.spaceName}</strong>
                  <span>可容纳 {space.capacity} 人 · 预约 {space.reservationCount} 次</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Empty description="暂无空间数据" />
        )}
      </motion.section>
    </motion.div>
  );
}
