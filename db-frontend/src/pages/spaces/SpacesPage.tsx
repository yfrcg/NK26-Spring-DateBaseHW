import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Descriptions,
  Empty,
  Form,
  InputNumber,
  Modal,
  Row,
  Select,
  Space as AntSpace,
  Spin,
  Tag,
  TreeSelect,
  Typography,
  message,
} from 'antd';
import {
  BankOutlined,
  BuildOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import dayjs, { Dayjs } from 'dayjs';
import { locationApi, reservationApi, spaceApi } from '@/api';
import { spaceStatusColorMap, spaceStatusMap, spaceTypeIcon, spaceTypeMap } from '@/constants/domain';
import { useAuthStore } from '@/stores/authStore';
import type { LocationTreeVO, ReservationCreateRequest, Space } from '@/types';
import { logError } from '@/utils/logError';

const { Title } = Typography;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.26 } },
};

const spacePositions = ['0%', '25%', '50%', '75%', '100%'];
const fallbackSpaceNames = ['研讨室A', '多功能厅', '创客空间', '路演厅', '自习室B区'];

interface LocationTreeNode {
  value: number;
  title: string;
  children?: LocationTreeNode[];
}

function isReadableText(value?: string) {
  return !!value && !/[?]{2,}|�/.test(value);
}

function buildTreeData(nodes: LocationTreeVO[]): LocationTreeNode[] {
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
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    (async () => {
      try {
        const [locRes, spaceRes] = await Promise.all([locationApi.getTree(), spaceApi.listActive()]);
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
      for (const node of nodes) {
        ids.push(node.locationId);
        if (node.children) ids = ids.concat(collectIds(node.children));
      }
      return ids;
    };
    const findNode = (nodes: LocationTreeVO[]): LocationTreeVO | undefined => {
      for (const node of nodes) {
        if (node.locationId === selectedLocationId) return node;
        if (node.children) {
          const found = findNode(node.children);
          if (found) return found;
        }
      }
      return undefined;
    };
    const node = findNode(locations);
    const ids = node ? collectIds([node]) : [selectedLocationId];
    return spaces.filter((space) => ids.includes(space.locationId));
  }, [spaces, selectedLocationId, locations]);

  const openBooking = (space: Space) => {
    setSelectedSpace(space);
    form.resetFields();
    setBookingModalOpen(true);
  };

  const openDetail = (space: Space) => {
    setSelectedSpace(space);
    setDetailModalOpen(true);
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
      message.success('预约成功');
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
          <Title level={2} style={{ margin: 0 }}>
            空间浏览
          </Title>
          <p style={{ margin: '4px 0 0', color: '#667085' }}>
            按位置筛选可用空间，查看容量、设备和当前状态。
          </p>
        </div>
        <TreeSelect
          style={{ width: 280 }}
          placeholder="筛选位置"
          allowClear
          treeData={buildTreeData(locations)}
          value={selectedLocationId}
          onChange={setSelectedLocationId}
          treeDefaultExpandAll
        />
      </div>

      {filteredSpaces.length === 0 ? (
        <Card>
          <Empty description="暂无可展示的空间数据" />
        </Card>
      ) : (
        <Row gutter={[18, 18]}>
          {filteredSpaces.map((space, index) => {
            const active = space.status === 'ACTIVE';
            const style = { '--space-pos': spacePositions[index % spacePositions.length] } as CSSProperties;
            const displayName = isReadableText(space.spaceName)
              ? space.spaceName
              : fallbackSpaceNames[index % fallbackSpaceNames.length];
            const equipmentDesc = isReadableText(space.equipmentDesc) ? space.equipmentDesc : undefined;
            return (
              <Col xs={24} sm={12} lg={8} xl={6} key={space.spaceId}>
                <motion.div variants={itemVariants}>
                  <Card className="space-card" hoverable styles={{ body: { padding: 0 } }} style={style}>
                    <div className="space-card-cover" />
                    <div className="space-card-top">
                      <Tag color={spaceStatusColorMap[space.status]}>{spaceStatusMap[space.status] || space.status}</Tag>
                      <div className="space-capacity">{space.capacity}</div>
                    </div>
                    <div className="space-card-main">
                      <span className="space-card-meta">{space.spaceCode}</span>
                      <strong className="space-card-title">{displayName}</strong>
                      <AntSpace orientation="vertical" size={5} style={{ marginTop: 10 }}>
                        <span className="space-card-meta">
                          <BuildOutlined /> {spaceTypeMap[space.spaceType] || space.spaceType} · <TeamOutlined /> 容量 {space.capacity}
                        </span>
                        {equipmentDesc && (
                          <span className="space-card-meta">
                            <EnvironmentOutlined /> {equipmentDesc}
                          </span>
                        )}
                      </AntSpace>
                      <div className="space-actions">
                        <Button
                          icon={spaceTypeIcon[space.spaceType] || <BankOutlined />}
                          onClick={() => openDetail(space)}
                        >
                          查看详情
                        </Button>
                        <Button
                          type="primary"
                          icon={<CalendarOutlined />}
                          disabled={!active}
                          onClick={() => openBooking(space)}
                        >
                          {active ? '立即预约' : '暂不可用'}
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </Col>
            );
          })}
        </Row>
      )}

      <Modal
        title="空间详情"
        open={detailModalOpen}
        onCancel={() => setDetailModalOpen(false)}
        footer={
          selectedSpace?.status === 'ACTIVE' ? (
            <Button
              type="primary"
              icon={<CalendarOutlined />}
              onClick={() => {
                setDetailModalOpen(false);
                openBooking(selectedSpace);
              }}
            >
              立即预约
            </Button>
          ) : null
        }
        width={480}
      >
        {selectedSpace && (
          <Descriptions column={1} size="small" bordered>
            <Descriptions.Item label="空间名称">{selectedSpace.spaceName}</Descriptions.Item>
            <Descriptions.Item label="空间编号">{selectedSpace.spaceCode}</Descriptions.Item>
            <Descriptions.Item label="空间类型">
              {spaceTypeMap[selectedSpace.spaceType] || selectedSpace.spaceType}
            </Descriptions.Item>
            <Descriptions.Item label="容量">{selectedSpace.capacity}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={spaceStatusColorMap[selectedSpace.status]}>
                {spaceStatusMap[selectedSpace.status] || selectedSpace.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="设备">
              {selectedSpace.equipmentDesc || '-'}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      <Modal
        title={
          <AntSpace>
            <CalendarOutlined style={{ color: '#0f9f8f' }} />
            <span>预约空间 · {isReadableText(selectedSpace?.spaceName) ? selectedSpace?.spaceName : '共享空间'}</span>
          </AntSpace>
        }
        open={bookingModalOpen}
        onCancel={() => setBookingModalOpen(false)}
        footer={null}
        destroyOnHidden
        width={460}
      >
        <Form form={form} layout="vertical" onFinish={handleBooking} style={{ marginTop: 16 }}>
          <Form.Item name="date" label="预约日期" rules={[{ required: true, message: '请选择日期' }]}>
            <DatePicker style={{ width: '100%' }} disabledDate={(date) => date.isBefore(dayjs().startOf('day'))} />
          </Form.Item>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="startTime" label="开始时间" rules={[{ required: true, message: '请选择开始时间' }]}>
                <Select
                  placeholder="选择时间"
                  options={Array.from({ length: 14 }, (_, i) => i + 8).map((hour) => ({
                    value: hour,
                    label: `${String(hour).padStart(2, '0')}:00`,
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
            <Button type="primary" htmlType="submit" loading={bookingLoading} block icon={<CalendarOutlined />}>
              确认预约
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </motion.div>
  );
}
