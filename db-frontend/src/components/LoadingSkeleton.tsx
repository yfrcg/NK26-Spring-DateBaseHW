import { Col, Row, Skeleton } from 'antd';

/**
 * Mimics a single stat card in its loading state.
 */
export function CardSkeleton() {
  return (
    <div
      style={{
        padding: 20,
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        background: 'var(--surface)',
      }}
    >
      <Skeleton active paragraph={{ rows: 1, width: '45%' }} title={{ width: '60%' }} />
    </div>
  );
}

/**
 * Renders a row of CardSkeletons.
 */
export function StatsRowSkeleton({ count = 4 }: { count?: number }) {
  const span = Math.floor(24 / count);

  return (
    <Row gutter={[14, 14]}>
      {Array.from({ length: count }).map((_, i) => (
        <Col key={i} xs={12} sm={span} lg={span}>
          <CardSkeleton />
        </Col>
      ))}
    </Row>
  );
}

/**
 * Mimics a data table with a header row and body rows.
 */
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div
      style={{
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        background: 'var(--surface)',
        overflow: 'hidden',
      }}
    >
      {/* Table header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
          gap: 16,
          padding: '14px 18px',
          background: 'var(--surface-soft)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton.Input
            key={i}
            active
            size="small"
            style={{ width: '100%', minWidth: 0, height: 16 }}
          />
        ))}
      </div>

      {/* Table rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
            gap: 16,
            padding: '16px 18px',
            borderBottom: rowIdx < rows - 1 ? '1px solid var(--border)' : 'none',
          }}
        >
          {Array.from({ length: 5 }).map((_, colIdx) => (
            <Skeleton.Input
              key={colIdx}
              active
              size="small"
              style={{
                width: colIdx === 0 ? '80%' : '60%',
                minWidth: 0,
                height: 14,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * Full page skeleton combining stats row and table.
 */
export function PageSkeleton({
  statsCount = 4,
  tableRows = 5,
}: {
  statsCount?: number;
  tableRows?: number;
}) {
  return (
    <div style={{ display: 'grid', gap: 24 }}>
      {/* Header skeleton */}
      <div>
        <Skeleton
          active
          paragraph={false}
          title={{ width: 180 }}
          style={{ marginBottom: 6 }}
        />
        <Skeleton
          active
          paragraph={false}
          title={{ width: 260, style: { height: 14 } }}
        />
      </div>

      {/* Stats row */}
      <StatsRowSkeleton count={statsCount} />

      {/* Table */}
      <TableSkeleton rows={tableRows} />
    </div>
  );
}
