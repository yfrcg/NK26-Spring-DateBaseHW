import { Outlet } from 'react-router-dom';
import { Typography } from 'antd';
import { motion } from 'framer-motion';

const { Text } = Typography;

export default function AuthLayout() {
  return (
    <div className="auth-shell">
      {/* Background animated particles container */}
      <div className="auth-particles" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="auth-stage"
      >
        <Outlet />
      </motion.div>

      <Text className="auth-footer">
        共享空间预约系统 &copy; {new Date().getFullYear()}
      </Text>
    </div>
  );
}
