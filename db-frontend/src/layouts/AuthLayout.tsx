import { Outlet } from 'react-router-dom';
import { ConfigProvider, Typography } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { motion } from 'framer-motion';

const { Text } = Typography;

export default function AuthLayout() {
  return (
    <ConfigProvider locale={zhCN}>
      <div className="auth-shell">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="auth-stage"
        >
          <Outlet />
        </motion.div>

        <Text className="auth-footer">
          Shared Space Booking System &copy; {new Date().getFullYear()}
        </Text>
      </div>
    </ConfigProvider>
  );
}
