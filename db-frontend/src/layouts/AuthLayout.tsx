import { Outlet } from 'react-router-dom';
import { ConfigProvider, Typography } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { motion } from 'framer-motion';

const { Text } = Typography;

export default function AuthLayout() {
  return (
    <ConfigProvider locale={zhCN}>
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #312e81 100%)',
          padding: 24,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-15%',
            left: '-5%',
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(118,75,162,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ position: 'relative', zIndex: 1 }}
        >
          <Outlet />
        </motion.div>

        <div
          style={{
            position: 'absolute',
            bottom: 24,
            left: 0,
            right: 0,
            textAlign: 'center',
          }}
        >
          <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
            Shared Space Booking System &copy; {new Date().getFullYear()}
          </Text>
        </div>
      </div>
    </ConfigProvider>
  );
}
