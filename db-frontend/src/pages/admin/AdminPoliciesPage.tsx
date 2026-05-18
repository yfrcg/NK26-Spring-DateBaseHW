import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Space as AntSpace,
  Switch,
  Table,
  Tag,
  Typography,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import { adminApi } from '@/api';
import { chargeModeColorMap, chargeModeLabelMap } from '@/constants/domain';
import type { PricingPolicy } from '@/types';
import { logError } from '@/utils/logError';

const { Title, Text } = Typography;

export default function AdminPoliciesPage() {
  const [policies, setPolicies] = useState<PricingPolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<PricingPolicy | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await adminApi.policy.list();
      setPolicies(res.data.data);
    } catch (error) {
      logError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreate = () => {
    setEditingPolicy(null);
    form.resetFields();
    form.setFieldsValue({
      chargeMode: 'PAID',
      hourlyPrice: 0,
      freeMinutes: 0,
      maxReserveHours: 4,
      overtimePriceMultiplier: 1.5,
      allowTempHold: false,
      tempHoldLimitMinutes: 15,
      tempHoldMaxCount: 3,
    });
    setModalOpen(true);
  };

  const openEdit = (policy: PricingPolicy) => {
    setEditingPolicy(policy);
    form.setFieldsValue({
      ...policy,
      validFrom: policy.validFrom ? dayjs(policy.validFrom) : undefined,
      validTo: policy.validTo ? dayjs(policy.validTo) : undefined,
      allowTempHold: !!policy.allowTempHold,
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      const payload = {
        ...values,
        allowTempHold: values.allowTempHold ? 1 : 0,
        validFrom: values.validFrom?.format('YYYY-MM-DD HH:mm:ss'),
        validTo: values.validTo?.format('YYYY-MM-DD HH:mm:ss'),
      };

      if (editingPolicy) {
        await adminApi.policy.update(editingPolicy.policyId, payload);
        message.success('策略更新成功');
      } else {
        await adminApi.policy.create(payload);
        message.success('策略创建成功');
      }
      setModalOpen(false);
      fetchData();
    } catch (error) {
      logError(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (policy: PricingPolicy) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除策略「${policy.policyName}」吗？`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await adminApi.policy.delete(policy.policyId);
          message.success('策略已删除');
          fetchData();
        } catch (error) {
          logError(error);
        }
      },
    });
  };

  const columns = [
    {
      title: '策略名称',
      dataIndex: 'policyName',
      key: 'policyName',
      width: 180,
      render: (v: string) => <Text strong>{v}</Text>,
    },
    {
      title: '编码',
      dataIndex: 'policyCode',
      key: 'policyCode',
      width: 120,
      render: (v: string) => <Tag>{v}</Tag>,
    },
    {
      title: '计费模式',
      dataIndex: 'chargeMode',
      key: 'chargeMode',
      width: 100,
      render: (v: string) => <Tag color={chargeModeColorMap[v]}>{chargeModeLabelMap[v]}</Tag>,
    },
    {
      title: '时租',
      dataIndex: 'hourlyPrice',
      key: 'hourlyPrice',
      width: 90,
      render: (v: number, r: PricingPolicy) => r.chargeMode === 'PAID' ? `¥${v.toFixed(2)}` : '-',
    },
    {
      title: '免费时段',
      dataIndex: 'freeMinutes',
      key: 'freeMinutes',
      width: 90,
      render: (v: number) => v > 0 ? `${v}分钟` : '无',
    },
    {
      title: '可暂离',
      dataIndex: 'allowTempHold',
      key: 'allowTempHold',
      width: 80,
      render: (v: number) => v ? <Tag color="success">是</Tag> : <Tag>否</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 80,
      render: (v: number) => v ? <Tag color="success">启用</Tag> : <Tag>停用</Tag>,
    },
    {
      title: '操作',
      key: 'actions',
      width: 120,
      render: (_: unknown, record: PricingPolicy) => (
        <AntSpace>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => openEdit(record)}>
            编辑
          </Button>
          <Button type="link" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>
            删除
          </Button>
        </AntSpace>
      ),
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <Title level={3} style={{ marginBottom: 4 }}>
            <SafetyCertificateOutlined style={{ marginRight: 8, color: '#2563eb' }} />
            策略管理
          </Title>
          <Text type="secondary">管理计费策略、规则和费率</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>新增策略</Button>
      </div>

      <Card style={{ borderRadius: 16, border: 'none' }}>
        <Table
          dataSource={policies}
          columns={columns}
          rowKey="policyId"
          loading={loading}
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: '暂无策略数据' }}
        />
      </Card>

      <Modal
        title={editingPolicy ? '编辑策略' : '新增策略'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        confirmLoading={submitting}
        width={680}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="policyCode" label="策略编码" rules={[{ required: true }]}>
                <Input placeholder="如 FREE_STUDENT" disabled={!!editingPolicy} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="policyName" label="策略名称" rules={[{ required: true }]}>
                <Input placeholder="如 学生免费策略" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="chargeMode" label="计费模式" rules={[{ required: true }]}>
                <Select options={[
                  { value: 'FREE', label: '免费' },
                  { value: 'PAID', label: '付费' },
                ]} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="hourlyPrice" label="时租价格（元）">
                <InputNumber min={0} precision={2} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="freeMinutes" label="免费时段（分钟）">
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="maxReserveHours" label="最长预约（小时）">
                <InputNumber min={1} max={24} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="overtimePriceMultiplier" label="超时倍率">
                <InputNumber min={1} max={10} precision={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="allowTempHold" label="允许暂离" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
            <Col span={9}>
              <Form.Item name="tempHoldLimitMinutes" label="暂离时限（分钟）">
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={9}>
              <Form.Item name="tempHoldMaxCount" label="最大暂离次数">
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="remarks" label="备注">
            <Input.TextArea rows={2} placeholder="可选" />
          </Form.Item>
        </Form>
      </Modal>
    </motion.div>
  );
}
