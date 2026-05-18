import { useEffect, useMemo, useState } from 'react';
import {
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
  EnvironmentOutlined,
  HomeOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import dayjs, { Dayjs } from 'dayjs';
import { locationApi, reservationApi, spaceApi } from '@/api';
import { spaceStatusColorMap, spaceTypeMap, spaceTypeIcon } from '@/constants/domain';
import { useAuthStore } from '@/stores/authStore';
import type { LocationTreeVO, ReservationCreateRequest, Space } from '@/types';
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
  const [selectedLocationId, setSelectedLocationId] = useState<number | undefined>();
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    (async () => {
      try {
        const [locRes, spaceRes] = await Promise.all([
          locationApi.getTree(),
          spaceApi.listActive(),
        ]);
        setLocations(locRes.data.data);
        setSpaces(spaceRes.data.data);
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
      <div className="spaces-toolbar">
        <div>
          <Title level={3} style={{ marginBottom: 4 }}>
            <HomeOutlined style={{ marginRight: 8, color: '#2563eb' }} />
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
          {filteredSpaces.map((space, index) => (
            <Col xs={24} sm={12} lg={8} xl={6} key={space.spaceId}>
              <motion.div variants={itemVariants} custom={index}>
                <Card
                  className="space-card"
                  style={{
                    borderRadius: 12,
                    border: 'none',
                    height: '100%',
                    background: '#fff',
                    overflow: 'hidden',
                  }}
                  styles={{ body: { padding: '20px' } }}
                  hoverable
                >
                  <div className="space-card-visual">
                    <span>{space.spaceCode}</span>
                    <strong>{space.capacity}</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                    <div
                      className="space-card-icon"
                      style={{
                        width: 44,
                        height: 44,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 22,
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

                  <Button
                    type="primary"
                    block
                    icon={<CalendarOutlined />}
                    disabled={space.status !== 'ACTIVE'}
                    onClick={() => openBooking(space)}
                    style={{
                      height: 40,
                      borderRadius: 10,
                      fontWeight: 500,
                      background: space.status === 'ACTIVE'
                        ? 'linear-gradient(135deg, #2563eb, #0891b2)'
                        : undefined,
                      border: 'none',
                    }}
                  >
                    {space.status !== 'ACTIVE' ? '暂不可用' : '立即预约'}
                  </Button>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      )}

      <Modal
        title={
          <AntSpace>
            <CalendarOutlined style={{ color: '#2563eb' }} />
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
                background: 'linear-gradient(135deg, #2563eb, #0891b2)',
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
