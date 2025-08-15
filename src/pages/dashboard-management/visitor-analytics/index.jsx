import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Progress, Button, Space, Typography, Spin, message } from 'antd';
import { 
  EyeOutlined, 
  UserOutlined, 
  GlobalOutlined, 
  MobileOutlined, 
  DesktopOutlined, 
  ReloadOutlined,
  DownloadOutlined,
  FireOutlined
} from '@ant-design/icons';
import { getVisitorAnalytics, exportAnalyticsData } from '../../../service/visitorAnalytics';
import usePageTracker from '../../../hooks/usePageTracker';

const { Title, Text } = Typography;

const VisitorAnalytics = () => {
  usePageTracker();
  
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load analytics data
  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await getVisitorAnalytics();
      setAnalytics(data);
      console.log('🔥 Firebase Analytics loaded:', data);
    } catch (error) {
      console.error('⚠️ Error loading analytics:', error);
      message.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  // Refresh analytics
  const refreshAnalytics = async () => {
    try {
      setRefreshing(true);
      const data = await getVisitorAnalytics();
      setAnalytics(data);
      message.success('🔥 Analytics refreshed from Firebase!');
    } catch (error) {
      console.error('⚠️ Error refreshing analytics:', error);
      message.error('Failed to refresh analytics');
    } finally {
      setRefreshing(false);
    }
  };

  // Export analytics data
  const handleExport = async () => {
    try {
      await exportAnalyticsData();
      message.success('📊 Analytics data exported successfully!');
    } catch (error) {
      console.error('⚠️ Error exporting analytics:', error);
      message.error('Failed to export analytics data');
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadAnalytics();
  }, []);

  // Columns for page views breakdown table
  const pageViewsColumns = [
    {
      title: 'Page Path',
      dataIndex: 'path',
      key: 'path',
      render: (path) => <Text code>{path}</Text>
    },
    {
      title: 'Views',
      dataIndex: 'count',
      key: 'count',
      align: 'right',
      render: (count) => <Text strong>{count.toLocaleString()}</Text>
    }
  ];

  // Columns for browser stats
  const browserColumns = [
    {
      title: 'Browser',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Usage',
      dataIndex: 'count',
      key: 'count',
      align: 'right',
      render: (count) => {
        const total = analytics?.browserStats?.browsers?.reduce((sum, item) => sum + item.count, 0) || 1;
        const percentage = Math.round((count / total) * 100);
        return (
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Text strong>{count} ({percentage}%)</Text>
            <Progress percent={percentage} size="small" showInfo={false} />
          </Space>
        );
      }
    }
  ];

  // Columns for device stats  
  const deviceColumns = [
    {
      title: 'Device Type',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Usage',
      dataIndex: 'count',
      key: 'count',
      align: 'right',
      render: (count) => {
        const total = analytics?.browserStats?.devices?.reduce((sum, item) => sum + item.count, 0) || 1;
        const percentage = Math.round((count / total) * 100);
        return (
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Text strong>{count} ({percentage}%)</Text>
            <Progress percent={percentage} size="small" showInfo={false} />
          </Space>
        );
      }
    }
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Spin size="large" tip="Loading Firebase analytics..." />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={2} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FireOutlined style={{ color: '#ff4d4f' }} />
            Firebase Realtime Visitor Analytics
          </Title>
          <Text type="secondary">Real-time website traffic insights powered by Firebase Realtime Database</Text>
        </div>
        <Space>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={refreshAnalytics}
            loading={refreshing}
          >
            Refresh
          </Button>
          <Button 
            type="primary"
            icon={<DownloadOutlined />} 
            onClick={handleExport}
          >
            Export Data
          </Button>
        </Space>
      </div>

      {/* Overview Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Today's Page Views"
              value={analytics?.todayPageViews || 0}
              prefix={<EyeOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Unique visitors: {analytics?.todayUniqueVisitors || 0}
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="This Week"
              value={analytics?.weekPageViews || 0}
              prefix={<UserOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Unique visitors: {analytics?.weekUniqueVisitors || 0}
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="This Month"
              value={analytics?.monthPageViews || 0}
              prefix={<GlobalOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1' }}
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Unique visitors: {analytics?.monthUniqueVisitors || 0}
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Page Views"
              value={analytics?.totalPageViews || 0}
              prefix={<FireOutlined style={{ color: '#fa541c' }} />}
              valueStyle={{ color: '#fa541c' }}
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              All time: {analytics?.totalUniqueVisitors || 0} visitors
            </Text>
          </Card>
        </Col>
      </Row>

      {/* Detailed Analytics */}
      <Row gutter={[16, 16]}>
        {/* Top Pages */}
        <Col xs={24} lg={8}>
          <Card title="Top Pages" size="small">
            <Table
              dataSource={analytics?.pageViewsBreakdown?.slice(0, 10) || []}
              columns={pageViewsColumns}
              pagination={false}
              size="small"
              rowKey="path"
            />
          </Card>
        </Col>

        {/* Browser Stats */}
        <Col xs={24} lg={8}>
          <Card title={<><DesktopOutlined /> Browser Usage</>} size="small">
            <Table
              dataSource={analytics?.browserStats?.browsers || []}
              columns={browserColumns}
              pagination={false}
              size="small"
              rowKey="name"
            />
          </Card>
        </Col>

        {/* Device Stats */}
        <Col xs={24} lg={8}>
          <Card title={<><MobileOutlined /> Device Types</>} size="small">
            <Table
              dataSource={analytics?.browserStats?.devices || []}
              columns={deviceColumns}
              pagination={false}
              size="small"
              rowKey="name"
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Activity */}
      <Card title="Recent Page Views" style={{ marginTop: '16px' }} size="small">
        <Table
          dataSource={analytics?.recentLogs?.slice(0, 20) || []}
          columns={[
            {
              title: 'Time',
              dataIndex: 'timeLocal',
              key: 'timeLocal',
              width: 180,
              render: (time) => <Text style={{ fontSize: '12px' }}>{time}</Text>
            },
            {
              title: 'Page',
              dataIndex: 'path',
              key: 'path',
              render: (path) => <Text code style={{ fontSize: '12px' }}>{path}</Text>
            },
            {
              title: 'Referrer',
              dataIndex: 'referrer',
              key: 'referrer',
              ellipsis: true,
              render: (referrer) => <Text type="secondary" style={{ fontSize: '12px' }}>{referrer || 'Direct'}</Text>
            }
          ]}
          pagination={{ pageSize: 10, size: 'small' }}
          size="small"
          rowKey="id"
        />
      </Card>
    </div>
  );
};

export default VisitorAnalytics;