import { useEffect, useMemo, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Empty,
  Form,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Space as AntSpace,
  Spin,
  Tag,
  TreeSelect,
  Typography,
} from 'antd';
import {
  BankOutlined,
  BuildOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import dayjs, { Dayjs } from 'dayjs';
import { locationApi, reservationApi, runtimeApi, spaceApi } from '@/api';
import { runtimeStatusMap, spaceStatusColorMap, spaceTypeMap, spaceTypeIcon } from '@/constants/domain';
import { useAuthStore } from '@/stores/authStore';
import type { LocationTreeVO, ReservationCreateRequest, Space, SpaceRuntimeStatus } from '@/types';
import { logError } from '@/utils/logError';

const { Title, Text } = Typography;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const statusConfig: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
  IDLE: { color: '#10b981', bg: '#ecfdf5', icon: <CheckCircleOutlined /> },
  IN_USE: { color: '#6366f1', bg: '#eef2ff', icon: <ClockCircleOutlined /> },
  TEMP_HOLD: { color: '#f59e0b', bg: '#fffbeb', icon: <ClockCircleOutlined /> },
};

function buildTreeData(nodes: LocationTreeVO[]): any[] {
  return nodes.map((node) => ({
    value: node.locationId,
    title: node.locationName,
    children: node.children && node.children.length > 0 ? buildTreeData(node.children) : undefined,
  }));
}

export default function SpacesPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState<LocationTreeVO[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [runtimeMap, setRuntimeMap] = useState<Record<number, SpaceRuntimeStatus>>({});
  const [selectedLocationId, setSelectedLocationId] = useState<number | undefined>();
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    (async () => {
      try {
        const [locRes, spaceRes, runtimeRes] = await Promise.all([
          locationApi.getTree(),
          spaceApi.listActive(),
          runtimeApi.listSpaces(),
        ]);
        setLocations(locRes.data.data);
        setSpaces(spaceRes.data.data);
        const map: Record<number, SpaceRuntimeStatus> = {};
        runtimeRes.data.data.forEach((r) => { map[r.spaceId] = r; });
        setRuntimeMap(map);
      } catch (error) {
        logError(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredSpaces = useMemo(() => {
    if (!selectedLocationId) return spaces;
    const collectIds = (nodes: LocationTreeVO[]): number[] => {
      let ids: number[] = [];
      for (const n of nodes) {
        ids.push(n.locationId);
        if (n.children) ids = ids.concat(collectIds(n.children));
      }
      return ids;
    };
    const findNode = (nodes: LocationTreeVO[]): LocationTreeVO | undefined => {
      for (const n of nodes) {
        if (n.locationId === selectedLocationId) return n;
        if (n.children) {
          const found = findNode(n.children);
          if (found) return found;
        }
      }
      return undefined;
    };
    const node = findNode(locations);
    const ids = node ? collectIds([node]) : [selectedLocationId];
    return spaces.filter((s) => ids.includes(s.locationId));
  }, [spaces, selectedLocationId, locations]);

  const openBooking = (space: Space) => {
    setSelectedSpace(space);
    form.resetFields();
    setBookingModalOpen(true);
  };

  const handleBooking = async (values: { date: Dayjs; startTime: number; duration: number }) => {
    if (!user || !selectedSpace) return;
    setBookingLoading(true);
    try {
      const start = values.date.hour(Math.floor(values.startTime)).minute((values.startTime % 1) * 60).second(0);
      const end = start.add(values.duration, 'hour');
      const req: ReservationCreateRequest = {
        userId: user.userId,
        spaceId: selectedSpace.spaceId,
        startTime: start.format('YYYY-MM-DDTHH:mm:ss'),
        endTime: end.format('YYYY-MM-DDTHH:mm:ss'),
      };
      await reservationApi.create(req);
      message.success('预约成功！');
      setBookingModalOpen(false);
      runtimeApi.listSpaces().then((res) => {
        const map: Record<number, SpaceRuntimeStatus> = {};
        res.data.data.forEach((r) => { map[r.spaceId] = r; });
        setRuntimeMap(map);
      });
    } catch (error) {
      logError(error);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <Title level={3} style={{ marginBottom: 4 }}>
            <HomeOutlined style={{ marginRight: 8, color: '#4f46e5' }} />
            空间浏览
          </Title>
          <Text type="secondary">查看所有可用空间，选择并预约</Text>
        </div>
        <TreeSelect
          style={{ width: 260 }}
          placeholder="筛选位置"
          allowClear
          treeData={buildTreeData(locations)}
          value={selectedLocationId}
          onChange={setSelectedLocationId}
          treeDefaultExpandAll
        />
      </div>

      {filteredSpaces.length === 0 ? (
        <Card style={{ borderRadius: 16, border: 'none' }}>
          <Empty description="暂无可展示的空间数据" />
        </Card>
      ) : (
        <Row gutter={[20, 20]}>
          {filteredSpaces.map((space, index) => {
            const runtime = runtimeMap[space.spaceId];
            const displayStatus = runtime?.currentStatus || 'IDLE';
            const cfg = statusConfig[displayStatus] || statusConfig.IDLE;
            const isIdle = displayStatus === 'IDLE';

            return (
              <Col xs={24} sm={12} lg={8} xl={6} key={space.spaceId}>
                <motion.div variants={itemVariants} custom={index}>
                  <Badge.Ribbon
                    text={
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        {cfg.icon}
                        {runtimeStatusMap[displayStatus] || '空闲'}
                      </span>
                    }
                    color={cfg.color}
                  >
                    <Card
                      style={{
                        borderRadius: 16,
                        border: 'none',
                        height: '100%',
                        background: '#fff',
                        overflow: 'hidden',
                      }}
                      styles={{ body: { padding: '20px' } }}
                      hoverable
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                        <div
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: 12,
                            background: isIdle ? '#eef2ff' : '#f1f5f9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 22,
                            color: isIdle ? '#4f46e5' : '#94a3b8',
                            flexShrink: 0,
                          }}
                        >
                          {spaceTypeIcon[space.spaceType] || <BankOutlined />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <Text strong style={{ fontSize: 15, display: 'block', lineHeight: 1.3 }}>
                            {space.spaceName}
                          </Text>
                          <Tag color={spaceStatusColorMap[space.status]} style={{ marginTop: 4, borderRadius: 20, border: 'none' }}>
                            {space.status === 'ACTIVE' ? '可用' : space.status === 'MAINTENANCE' ? '维护中' : '停用'}
                          </Tag>
                        </div>
                      </div>

                      <div style={{ marginBottom: 16 }}>
                        <AntSpace direction="vertical" size={6} style={{ width: '100%' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748b', fontSize: 13 }}>
                            <BuildOutlined style={{ color: '#94a3b8' }} />
                            <span>{spaceTypeMap[space.spaceType] || space.spaceType}</span>
                            <span style={{ color: '#cbd5e1' }}>·</span>
                            <TeamOutlined style={{ color: '#94a3b8' }} />
                            <span>容量 {space.capacity}</span>
                          </div>
                          {space.equipmentDesc && (
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, color: '#64748b', fontSize: 13 }}>
                              <EnvironmentOutlined style={{ color: '#94a3b8', marginTop: 3 }} />
                              <span style={{ flex: 1 }}>{space.equipmentDesc}</span>
                            </div>
                          )}
                        </AntSpace>
                      </div>

                      {runtime && (
                        <div
                          style={{
                            background: cfg.bg,
                            borderRadius: 10,
                            padding: '10px 12px',
                            marginBottom: 14,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            fontSize: 12,
                            color: cfg.color,
                            fontWeight: 500,
                          }}
                        >
                          {cfg.icon}
                          {runtimeStatusMap[displayStatus] || '空闲'}
                          {runtime.statusSince && (
                            <span style={{ marginLeft: 'auto', color: '#94a3b8', fontWeight: 400 }}>
                              {dayjs(runtime.statusSince).format('HH:mm')}
                            </span>
                          )}
                        </div>
                      )}

                      <Button
                        type="primary"
                        block
                        icon={<CalendarOutlined />}
                        disabled={space.status !== 'ACTIVE' || !isIdle}
                        onClick={() => openBooking(space)}
                        style={{
                          height: 40,
                          borderRadius: 10,
                          fontWeight: 500,
                          background: isIdle && space.status === 'ACTIVE'
                            ? 'linear-gradient(135deg, #4f46e5, #7c3aed)'
                            : undefined,
                          border: 'none',
                        }}
                      >
                        {space.status !== 'ACTIVE' ? '暂不可用' : isIdle ? '立即预约' : '使用中'}
                      </Button>
                    </Card>
                  </Badge.Ribbon>
                </motion.div>
              </Col>
            );
          })}
        </Row>
      )}

      <Modal
        title={
          <AntSpace>
            <CalendarOutlined style={{ color: '#4f46e5' }} />
            <span>预约空间 · {selectedSpace?.spaceName}</span>
          </AntSpace>
        }
        open={bookingModalOpen}
        onCancel={() => setBookingModalOpen(false)}
        footer={null}
        destroyOnClose
        width={440}
      >
        <Form form={form} layout="vertical" onFinish={handleBooking} style={{ marginTop: 16 }}>
          <Form.Item name="date" label="预约日期" rules={[{ required: true, message: '请选择日期' }]}>
            <DatePicker
              style={{ width: '100%' }}
              disabledDate={(d) => d.isBefore(dayjs().startOf('day'))}
            />
          </Form.Item>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="startTime" label="开始时间" rules={[{ required: true, message: '请选择开始时间' }]}>
                <Select
                  placeholder="选择时间"
                  options={Array.from({ length: 14 }, (_, i) => i + 8).map((h) => ({
                    value: h,
                    label: `${String(h).padStart(2, '0')}:00`,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="duration" label="时长（小时）" rules={[{ required: true, message: '请选择时长' }]}>
                <InputNumber min={1} max={8} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={bookingLoading}
              block
              icon={<CalendarOutlined />}
              style={{
                height: 44,
                borderRadius: 10,
                fontWeight: 600,
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                border: 'none',
              }}
            >
              确认预约
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </motion.div>
  );
}
