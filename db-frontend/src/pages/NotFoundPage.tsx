import { Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HomeOutlined } from '@ant-design/icons';
import { pageVariants } from '@/constants/motionVariants';

const { Title, Paragraph } = Typography;

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="not-found-container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        style={{ textAlign: 'center', maxWidth: 480, padding: '0 24px' }}
      >
        <div style={{ fontSize: 120, fontWeight: 900, lineHeight: 1, color: 'var(--primary)', letterSpacing: -2, marginBottom: 8 }}>
          404
        </div>

        <Title level={2} style={{ margin: '0 0 12px', color: 'var(--ink)' }}>
          页面未找到
        </Title>

        <Paragraph style={{ color: 'var(--muted)', fontSize: 16, marginBottom: 32 }}>
          您访问的页面不存在、已被移除或没有访问权限。
        </Paragraph>

        <Button
          type="primary"
          size="large"
          icon={<HomeOutlined />}
          onClick={() => navigate('/dashboard')}
          className="primary-gradient-btn"
          style={{ height: 48, padding: '0 32px', fontSize: 15, fontWeight: 600 }}
        >
          返回首页
        </Button>
      </motion.div>
    </div>
  );
}
