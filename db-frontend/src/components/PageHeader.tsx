import { Breadcrumb } from 'antd';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { fadeInVariants } from '@/constants/motionVariants';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

export default function PageHeader({ title, subtitle, action, breadcrumbs }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      className="page-header"
      variants={fadeInVariants}
      initial="hidden"
      animate="visible"
    >
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb
          className="page-header-breadcrumb"
          items={breadcrumbs.map((item) => ({
            title: item.path ? (
              <a
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.path!);
                }}
              >
                {item.label}
              </a>
            ) : (
              item.label
            ),
          }))}
        />
      )}

      <div className="page-header-content">
        <div className="page-header-text">
          <h2 className="page-header-title">{title}</h2>
          {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
        </div>
        {action && <div className="page-header-action">{action}</div>}
      </div>

      <style>{`
        .page-header {
          margin-bottom: 24px;
        }

        .page-header-breadcrumb {
          margin-bottom: 12px;
        }

        .page-header-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
        }

        .page-header-text {
          min-width: 0;
          flex: 1;
        }

        .page-header-title {
          margin: 0;
          color: var(--ink);
          font-size: 22px;
          font-weight: 800;
          line-height: 1.3;
        }

        .page-header-subtitle {
          margin: 6px 0 0;
          color: var(--muted);
          font-size: 14px;
          line-height: 1.5;
        }

        .page-header-action {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        @media (max-width: 768px) {
          .page-header-content {
            flex-direction: column;
            align-items: stretch;
          }

          .page-header-action {
            align-self: flex-start;
          }
        }
      `}</style>
    </motion.div>
  );
}
