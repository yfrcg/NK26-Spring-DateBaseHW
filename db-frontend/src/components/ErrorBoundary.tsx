import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { WarningOutlined, HomeOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            padding: 24,
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 440,
              padding: '48px 36px',
              textAlign: 'center',
              borderRadius: 'var(--radius)',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              boxShadow: '0 16px 38px rgba(16, 24, 40, 0.07)',
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                display: 'grid',
                placeItems: 'center',
                margin: '0 auto 20px',
                borderRadius: '50%',
                fontSize: 28,
                color: '#f59e0b',
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
              }}
            >
              <WarningOutlined />
            </div>

            <h2
              style={{
                margin: '0 0 8px',
                color: 'var(--ink)',
                fontSize: 20,
                fontWeight: 800,
              }}
            >
              页面出错了
            </h2>

            <p
              style={{
                margin: '0 0 28px',
                color: 'var(--muted)',
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
              {this.state.error?.message || '抱歉，页面遇到了意外错误，请稍后重试。'}
            </p>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={this.handleRetry}
                size="middle"
              >
                重试
              </Button>
              <Button
                icon={<HomeOutlined />}
                onClick={this.handleGoHome}
                size="middle"
              >
                返回首页
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
