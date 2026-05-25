import { useEffect, useRef } from 'react';
import { Col, Row, Skeleton } from 'antd';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { containerVariants, itemVariants } from '@/constants/motionVariants';
import './StatsCardRow.css';

export interface StatCardConfig {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  suffix?: string;
  prefix?: string;
  loading?: boolean;
}

interface StatsCardRowProps {
  stats: StatCardConfig[];
  loading?: boolean;
  columns?: { xs: number; sm: number; lg?: number };
}

function AnimatedNumber({ value }: { value: number }) {
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (latest) => Math.round(latest));
  const displayRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const unsubscribe = rounded.on('change', (v) => {
      if (displayRef.current) {
        displayRef.current.textContent = v.toLocaleString();
      }
    });

    const controls = animate(motionVal, value, {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    });

    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [value, motionVal, rounded]);

  return <span ref={displayRef}>0</span>;
}

function StatCard({ config, isLoading }: { config: StatCardConfig; isLoading: boolean }) {
  const loading = isLoading || config.loading;

  if (loading) {
    return (
      <div className="stats-card-skeleton">
        <Skeleton active paragraph={{ rows: 1 }} title={{ width: '60%' }} />
      </div>
    );
  }

  const isNumeric = typeof config.value === 'number';

  return (
    <motion.div className="stats-card" variants={itemVariants}>
      <div className="stats-card-header">
        <p className="stats-card-title">{config.title}</p>
        <div
          className="stats-card-icon"
          style={{
            color: config.color,
            background: `${config.color}14`,
          }}
        >
          {config.icon}
        </div>
      </div>
      <div className="stats-card-value">
        {config.prefix && <span className="stats-card-prefix">{config.prefix}</span>}
        {isNumeric ? <AnimatedNumber value={config.value as number} /> : config.value}
        {config.suffix && <span className="stats-card-suffix">{config.suffix}</span>}
      </div>
    </motion.div>
  );
}

export default function StatsCardRow({
  stats,
  loading = false,
  columns = { xs: 12, sm: 8, lg: 6 },
}: StatsCardRowProps) {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <Row gutter={[14, 14]}>
        {stats.map((stat, index) => (
          <Col
            key={index}
            xs={columns.xs}
            sm={columns.sm}
            lg={columns.lg ?? columns.sm}
          >
            <StatCard config={stat} isLoading={loading} />
          </Col>
        ))}
      </Row>
    </motion.div>
  );
}
