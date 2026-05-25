import { InboxOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { fadeInVariants } from '@/constants/motionVariants';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({
  icon,
  title = '暂无数据',
  description = '当前没有可显示的内容',
  action,
}: EmptyStateProps) {
  return (
    <motion.div
      variants={fadeInVariants}
      initial="hidden"
      animate="visible"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '64px 24px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          display: 'grid',
          placeItems: 'center',
          marginBottom: 20,
          borderRadius: '50%',
          fontSize: 32,
          color: 'var(--muted)',
          background: 'var(--surface-soft)',
          border: '1px solid var(--border)',
        }}
      >
        {icon ?? <InboxOutlined />}
      </div>

      <h3
        style={{
          margin: '0 0 8px',
          color: 'var(--ink)',
          fontSize: 17,
          fontWeight: 700,
        }}
      >
        {title}
      </h3>

      <p
        style={{
          margin: 0,
          maxWidth: 320,
          color: 'var(--muted)',
          fontSize: 14,
          lineHeight: 1.6,
        }}
      >
        {description}
      </p>

      {action && <div style={{ marginTop: 20 }}>{action}</div>}
    </motion.div>
  );
}
