import { useEffect, useEffectEvent, useMemo, useState } from 'react';
import { CalendarOutlined, EnvironmentOutlined, TeamOutlined, ToolOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Descriptions,
  Empty,
  Form,
  Modal,
  Row,
  Spin,
  Tag,
  Tree,
  Typography,
  message,
} from 'antd';
import type { TreeDataNode } from 'antd';
import dayjs from 'dayjs';
import { locationApi, reservationApi, runtimeApi, spaceApi } from '@/api';
import { runtimeStatusMap, spaceStatusMap, spaceTypeMap } from '@/constants/domain';
import { useAuthStore } from '@/stores/authStore';
import type { LocationTreeVO, ReservationCreateRequest, Space, SpaceRuntimeStatus } from '@/types';
import { logError } from '@/utils/logError';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

function getEffectiveStatus(space: Space, runtimeStatus?: SpaceRuntimeStatus) {
  if (space.status !== 'ACTIVE') {
    return {
      color: spaceStatusMap[space.status]?.color || 'default',
      text: spaceStatusMap[space.status]?.text || space.status,
      reservable: false,
    };
  }

  if (runtimeStatus && runtimeStatus.currentStatus !== 'IDLE') {
    const item = runtimeStatusMap[runtimeStatus.currentStatus] || {
      color: 'default',
      text: runtimeStatus.currentStatus,
    };
    return {
      color: item.color,
      text: item.text,
      reservable: false,
    };
  }

  return {
    color: spaceStatusMap.ACTIVE.color,
    text: spaceStatusMap.ACTIVE.text,
    reservable: true,
  };
}

export default function SpacesPage() {
  const { user } = useAuthStore();
  const [locations, setLocations] = useState<LocationTreeVO[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [allSpaces, setAllSpaces] = useState<Space[]>([]);
  const [runtimeStatusBySpace, setRuntimeStatusBySpace] = useState<Record<number, SpaceRuntimeStatus>>({});
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const loadBaseData = useEffectEvent(async () => {
    setLoading(true);
    try {
      const [locationRes, spaceRes, runtimeRes] = await Promise.all([
        locationApi.getTree(),
        spaceApi.listActive(),
        runtimeApi.listSpaces(),
      ]);

      const runtimeMap: Record<number, SpaceRuntimeStatus> = {};
      runtimeRes.data.data.forEach((item) => {
        runtimeMap[item.spaceId] = item;
      });

      setLocations(locationRes.data.data);
      setAllSpaces(spaceRes.data.data);
      setSpaces(spaceRes.data.data);
      setRuntimeStatusBySpace(runtimeMap);
    } catch (error) {
      logError(error);
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    void loadBaseData();
  }, [reloadKey]);

  const treeData = useMemo<TreeDataNode[]>(() => {
    const buildTree = (items: LocationTreeVO[]): TreeDataNode[] =>
      items.map((item) => ({
        key: String(item.locationId),
        title: (
          <span>
            <EnvironmentOutlined style={{ marginRight: 4 }} />
            {item.locationName}
          </span>
        ),
        children: item.children?.length ? buildTree(item.children) : undefined,
      }));

    return buildTree(locations);
  }, [locations]);

  const handleSelectLocation = async (locationId: string | null) => {
    if (!locationId) {
      setSpaces(allSpaces);
      return;
    }

    try {
      const res = await locationApi.listSpacesByLocation(Number(locationId));
      setSpaces(res.data.data);
    } catch (error) {
      logError(error);
      setSpaces([]);
    }
  };

  const handleReserve = async (values: { timeRange: [dayjs.Dayjs, dayjs.Dayjs] }) => {
    if (!user || !selectedSpace) {
      return;
    }

    setSubmitting(true);
    try {
      const payload: ReservationCreateRequest = {
        userId: user.userId,
        spaceId: selectedSpace.spaceId,
        startTime: values.timeRange[0].format('YYYY-MM-DDTHH:mm:ss'),
        endTime: values.timeRange[1].format('YYYY-MM-DDTHH:mm:ss'),
      };
      await reservationApi.create(payload);
      message.success('预约成功');
      setModalOpen(false);
      form.resetFields();
      setReloadKey((current) => current + 1);
    } catch (error) {
      logError(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>
        空间浏览
      </Title>

      <Row gutter={16}>
        <Col xs={24} md={6}>
          <Card
            title="场地导航"
            style={{ borderRadius: 8, marginBottom: 16 }}
            styles={{ body: { padding: '8px 12px', maxHeight: 600, overflow: 'auto' } }}
          >
            <Tree
              treeData={treeData}
              defaultExpandAll
              onSelect={(keys) => {
                if (keys.length > 0) {
                  void handleSelectLocation(String(keys[0]));
                } else {
                  void handleSelectLocation(null);
                }
              }}
            />
            <Button
              type="link"
              size="small"
              onClick={() => {
                void handleSelectLocation(null);
              }}
              style={{ marginTop: 8 }}
            >
              显示全部空间
            </Button>
          </Card>
        </Col>
        <Col xs={24} md={18}>
          {spaces.length === 0 ? (
            <Empty description="暂无可用空间" />
          ) : (
            <Row gutter={[16, 16]}>
              {spaces.map((space) => {
                const effectiveStatus = getEffectiveStatus(space, runtimeStatusBySpace[space.spaceId]);
                return (
                  <Col xs={24} sm={12} lg={8} key={space.spaceId}>
                    <Card
                      hoverable
                      style={{ borderRadius: 8, height: '100%' }}
                      styles={{ body: { display: 'flex', flexDirection: 'column', height: '100%' } }}
                    >
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 12,
                          }}
                        >
                          <Text strong style={{ fontSize: 16 }}>
                            {space.spaceName}
                          </Text>
                          <Tag color={effectiveStatus.color}>{effectiveStatus.text}</Tag>
                        </div>
                        <Descriptions column={1} size="small">
                          <Descriptions.Item label="编号">{space.spaceCode}</Descriptions.Item>
                          <Descriptions.Item label="类型">
                            {spaceTypeMap[space.spaceType] || space.spaceType}
                          </Descriptions.Item>
                          <Descriptions.Item label="容量">
                            <TeamOutlined style={{ marginRight: 4 }} />
                            {space.capacity} 人
                          </Descriptions.Item>
                          {space.equipmentDesc && (
                            <Descriptions.Item label="设备">
                              <ToolOutlined style={{ marginRight: 4 }} />
                              {space.equipmentDesc}
                            </Descriptions.Item>
                          )}
                        </Descriptions>
                      </div>
                      <Button
                        type="primary"
                        icon={<CalendarOutlined />}
                        block
                        style={{ marginTop: 12, borderRadius: 6 }}
                        disabled={!effectiveStatus.reservable}
                        onClick={() => {
                          setSelectedSpace(space);
                          setModalOpen(true);
                        }}
                      >
                        {effectiveStatus.reservable ? '立即预约' : '暂不可用'}
                      </Button>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          )}
        </Col>
      </Row>

      <Modal
        title={`预约 - ${selectedSpace?.spaceName || ''}`}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        width={480}
      >
        {selectedSpace && (
          <div>
            <Descriptions column={1} size="small" style={{ marginBottom: 16 }}>
              <Descriptions.Item label="空间">{selectedSpace.spaceName}</Descriptions.Item>
              <Descriptions.Item label="类型">
                {spaceTypeMap[selectedSpace.spaceType] || selectedSpace.spaceType}
              </Descriptions.Item>
              <Descriptions.Item label="容量">{selectedSpace.capacity} 人</Descriptions.Item>
            </Descriptions>
            <Form form={form} onFinish={handleReserve} layout="vertical">
              <Form.Item
                name="timeRange"
                label="预约时间段"
                rules={[{ required: true, message: '请选择预约时间' }]}
              >
                <RangePicker
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD HH:mm"
                  style={{ width: '100%' }}
                  disabledDate={(current) => !!current && current < dayjs().startOf('day')}
                />
              </Form.Item>
              <Form.Item style={{ marginBottom: 0 }}>
                <Button type="primary" htmlType="submit" loading={submitting} block>
                  确认预约
                </Button>
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
}
