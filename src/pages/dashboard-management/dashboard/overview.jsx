import React from 'react';
import { Card, Row, Col, Statistic, Progress, List, Avatar, Tag, Space, Typography } from 'antd';
import {
  UserOutlined,
  DollarOutlined,
  ShoppingOutlined,
  TrendingUpOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import './overview.scss';

const { Title, Text } = Typography;

const DashboardOverview = () => {
  // Mock data - replace with real API calls
  const stats = [
    {
      title: 'Total Users',
      value: 1234,
      prefix: <UserOutlined />,
      suffix: 'users',
      color: '#1890ff',
      growth: 12.5,
    },
    {
      title: 'Monthly Revenue',
      value: 45678,
      prefix: <DollarOutlined />,
      suffix: '₫',
      color: '#52c41a',
      growth: 8.2,
    },
    {
      title: 'Active Packages',
      value: 89,
      prefix: <ShoppingOutlined />,
      suffix: 'packages',
      color: '#722ed1',
      growth: -2.1,
    },
    {
      title: 'Growth Rate',
      value: 24.8,
      prefix: <TrendingUpOutlined />,
      suffix: '%',
      color: '#fa8c16',
      growth: 5.4,
    },
  ];

  const recentActivities = [
    {
      title: 'New user registration',
      description: 'john.doe@example.com registered',
      time: '2 minutes ago',
      avatar: <UserOutlined />,
      status: 'new',
    },
    {
      title: 'Package subscription',
      description: 'Premium package activated',
      time: '15 minutes ago',
      avatar: <ShoppingOutlined />,
      status: 'success',
    },
    {
      title: 'Payment received',
      description: '$299 payment processed',
      time: '1 hour ago',
      avatar: <DollarOutlined />,
      status: 'success',
    },
    {
      title: 'User deleted account',
      description: 'Account removal requested',
      time: '2 hours ago',
      avatar: <UserOutlined />,
      status: 'warning',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return '#1890ff';
      case 'success': return '#52c41a';
      case 'warning': return '#faad14';
      case 'error': return '#ff4d4f';
      default: return '#d9d9d9';
    }
  };

  const getGrowthColor = (growth) => {
    return growth >= 0 ? '#52c41a' : '#ff4d4f';
  };

  return (
    <div className="dashboard-overview">
      {/* Welcome Section */}
      <div className="welcome-section">
        <Title level={2} className="welcome-title">
          Welcome back, Admin! 👋
        </Title>
        <Text type="secondary" className="welcome-subtitle">
          Here's what's happening with your application today.
        </Text>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[24, 24]} className="stats-section">
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card className="stat-card" hoverable>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={<span style={{ color: stat.color }}>{stat.prefix}</span>}
                suffix={stat.suffix}
                valueStyle={{ 
                  color: stat.color,
                  fontSize: '24px',
                  fontWeight: 'bold'
                }}
              />
              <div className="stat-growth">
                <Text 
                  type={stat.growth >= 0 ? 'success' : 'danger'}
                  style={{ 
                    fontSize: '14px',
                    fontWeight: '500',
                    color: getGrowthColor(stat.growth)
                  }}
                >
                  {stat.growth >= 0 ? '+' : ''}{stat.growth}% from last month
                </Text>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Content Grid */}
      <Row gutter={[24, 24]} className="content-section">
        {/* Recent Activities */}
        <Col xs={24} lg={14}>
          <Card
            title={
              <Space>
                <ClockCircleOutlined />
                <span>Recent Activities</span>
              </Space>
            }
            className="activity-card"
            extra={<Text type="secondary">Last 24 hours</Text>}
          >
            <List
              itemLayout="horizontal"
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        style={{ 
                          backgroundColor: getStatusColor(item.status),
                          color: 'white'
                        }}
                        icon={item.avatar}
                      />
                    }
                    title={<Text strong>{item.title}</Text>}
                    description={
                      <Space direction="vertical" size={4}>
                        <Text type="secondary">{item.description}</Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {item.time}
                        </Text>
                      </Space>
                    }
                  />
                  <Tag color={getStatusColor(item.status)}>
                    {item.status}
                  </Tag>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Performance Overview */}
        <Col xs={24} lg={10}>
          <Card
            title={
              <Space>
                <TrendingUpOutlined />
                <span>Performance Overview</span>
              </Space>
            }
            className="performance-card"
          >
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div className="metric-item">
                <div className="metric-header">
                  <Text strong>User Engagement</Text>
                  <Text strong style={{ color: '#52c41a' }}>85%</Text>
                </div>
                <Progress 
                  percent={85} 
                  strokeColor="#52c41a"
                  showInfo={false}
                />
              </div>

              <div className="metric-item">
                <div className="metric-header">
                  <Text strong>Server Performance</Text>
                  <Text strong style={{ color: '#1890ff' }}>92%</Text>
                </div>
                <Progress 
                  percent={92} 
                  strokeColor="#1890ff"
                  showInfo={false}
                />
              </div>

              <div className="metric-item">
                <div className="metric-header">
                  <Text strong>Customer Satisfaction</Text>
                  <Text strong style={{ color: '#722ed1' }}>78%</Text>
                </div>
                <Progress 
                  percent={78} 
                  strokeColor="#722ed1"
                  showInfo={false}
                />
              </div>

              <div className="metric-item">
                <div className="metric-header">
                  <Text strong>Revenue Target</Text>
                  <Text strong style={{ color: '#fa8c16' }}>67%</Text>
                </div>
                <Progress 
                  percent={67} 
                  strokeColor="#fa8c16"
                  showInfo={false}
                />
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row gutter={[24, 24]} className="actions-section">
        <Col span={24}>
          <Card
            title={
              <Space>
                <CheckCircleOutlined />
                <span>Quick Actions</span>
              </Space>
            }
            className="actions-card"
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Card.Grid className="action-item">
                  <UserOutlined className="action-icon" />
                  <Text strong>Manage Users</Text>
                </Card.Grid>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card.Grid className="action-item">
                  <ShoppingOutlined className="action-icon" />
                  <Text strong>Manage Packages</Text>
                </Card.Grid>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card.Grid className="action-item">
                  <TrendingUpOutlined className="action-icon" />
                  <Text strong>View Analytics</Text>
                </Card.Grid>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card.Grid className="action-item">
                  <DollarOutlined className="action-icon" />
                  <Text strong>Revenue Reports</Text>
                </Card.Grid>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardOverview;
