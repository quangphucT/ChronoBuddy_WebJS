import "./index.scss";
import {
  Row,
  Col,
  Card,
  Avatar,
  Progress,
  Button,
  Statistic,
  Modal,
  Form,
  Input,
  Badge,
  Divider,
  Typography,
  Space,
  Tooltip,
  Tag,
  Upload,
  Timeline,
  Empty
} from "antd";

import { 
  EditOutlined, 
  LogoutOutlined,
  UserOutlined,
  SettingOutlined,
  TrophyOutlined,
  CalendarOutlined,
  ProjectOutlined,
  TeamOutlined,
  UploadOutlined,
  CameraOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined
} from "@ant-design/icons";
import { Bar, Line } from "@ant-design/charts";
import { useDispatch } from "react-redux";
import { removeInformation } from "../../redux/feature/userSlice";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { useForm } from "antd/es/form/Form";
import { toast } from "react-toastify";
import api from "../../config/api";
import { useState } from "react";

const { Title, Text } = Typography;

const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [openAvatarModal, setOpenAvatarModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [form] = useForm();
  
  const username = useSelector((store) => store?.user?.username);
  const user_id = useSelector((store) => store?.user?.id);
  const imageUrl = useSelector((store) => store?.user?.imageUrl);
  const name = useSelector((store) => store?.user?.name);
  const dataUserOnRedux = useSelector((store) => store?.user);
  
  console.log("ID:", user_id);

  // Sample data for statistics
  const userStats = {
    totalTasks: 124,
    completedTasks: 89,
    inProgressTasks: 23,
    overdueTasks: 12,
    totalProjects: 8,
    activeProjects: 5,
    completionRate: 72,
    productivity: 85
  };

  // Sample data for recent activities
  const recentActivities = [
    {
      title: "Completed task: UI Design Review",
      time: "2 hours ago",
      type: "completed",
      icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
    },
    {
      title: "Started new project: Mobile App",
      time: "5 hours ago", 
      type: "started",
      icon: <ProjectOutlined style={{ color: '#1890ff' }} />
    },
    {
      title: "Updated profile information",
      time: "1 day ago",
      type: "updated",
      icon: <UserOutlined style={{ color: '#722ed1' }} />
    },
    {
      title: "Joined team: Development Squad",
      time: "2 days ago",
      type: "joined",
      icon: <TeamOutlined style={{ color: '#fa8c16' }} />
    }
  ];

  // Dữ liệu cho biểu đồ Weekly Performance
  const weeklyData = [
    { day: "Mon", completed: 5, inProgress: 2 },
    { day: "Tue", completed: 8, inProgress: 3 },
    { day: "Wed", completed: 3, inProgress: 4 },
    { day: "Thu", completed: 6, inProgress: 1 },
    { day: "Fri", completed: 4, inProgress: 3 },
    { day: "Sat", completed: 2, inProgress: 1 },
    { day: "Sun", completed: 1, inProgress: 0 },
  ];

  // Dữ liệu cho biểu đồ Monthly Trend
  const monthlyData = [
    { month: "Jan", productivity: 65 },
    { month: "Feb", productivity: 72 },
    { month: "Mar", productivity: 68 },
    { month: "Apr", productivity: 85 },
    { month: "May", productivity: 78 },
    { month: "Jun", productivity: 90 },
  ];

  const barConfig = {
    data: weeklyData,
    isStack: true,
    xField: "day",
    yField: ["completed", "inProgress"],
    seriesField: "type",
    color: ["#52c41a", "#faad14"],
    label: {
      position: "middle",
      style: { fill: "#fff", fontSize: 12 },
    },
    legend: {
      position: "top-right"
    }
  };

  const lineConfig = {
    data: monthlyData,
    xField: "month",
    yField: "productivity",
    smooth: true,
    color: "#722ed1",
    point: {
      size: 5,
      shape: "diamond",
      style: {
        fill: "white",
        stroke: "#722ed1",
        lineWidth: 2,
      },
    },
    area: {
      style: {
        fill: "l(270) 0:#ffffff 0.5:#722ed1 1:#722ed1",
        fillOpacity: 0.3,
      },
    },
  };
  const handleLogout = () => {
  
        dispatch(removeInformation());
        navigate("/login-page");
        localStorage.removeItem("token");
        toast.success("Logged out successfully!");
    
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await api.put(`user/${user_id}`, values);
      toast.success("Profile updated successfully!");
      form.resetFields();
      setOpenModal(false);
    } catch (error) {
      toast.error(error.response?.data || "Update failed!");
    }
    setLoading(false);
  };

  const handleAvatarUpload = (info) => {
    if (info.file.status === 'uploading') {
      setUploadLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      setUploadLoading(false);
      // Handle successful upload
      toast.success("Avatar updated successfully!");
    }
    if (info.file.status === 'error') {
      setUploadLoading(false);
      toast.error("Avatar upload failed!");
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-content">
        {/* Header Section */}
        <div className="profile-header">
          <div className="profile-header-bg"></div>
          <div className="profile-header-content">
            <Row align="middle" justify="space-between">
              <Col>
                <Space size="large" align="center">
                  <div className="avatar-container">
                    <Badge 
                      count={
                        <Button 
                          type="primary" 
                          shape="circle" 
                          size="small"
                          icon={<CameraOutlined />}
                          onClick={() => setOpenAvatarModal(true)}
                          className="avatar-edit-btn"
                        />
                      }
                    >
                      <Avatar 
                        size={120} 
                        src={imageUrl} 
                        icon={<UserOutlined />}
                        className="profile-avatar"
                      />
                    </Badge>
                  </div>
                  <div className="profile-info">
                    <Title level={2} className="profile-name">
                      {name || username}
                    </Title>
                    <Text className="profile-username">@{username}</Text>
                    <div className="profile-badges">
                      <Tag color="blue" icon={<UserOutlined />}>ID: {user_id}</Tag>
                      <Tag color="green" icon={<TrophyOutlined />}>Pro User</Tag>
                    </div>
                  </div>
                </Space>
              </Col>
              <Col>
                <Space>
                  <Tooltip title="Edit Profile">
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={() => {
                        setOpenModal(true);
                        form.setFieldsValue(dataUserOnRedux);
                      }}
                      className="edit-profile-btn"
                    >
                      Edit Profile
                    </Button>
                  </Tooltip>
                  <Tooltip title="Settings">
                    <Button
                      icon={<SettingOutlined />}
                      className="settings-btn"
                    />
                  </Tooltip>
                  <Tooltip title="Logout">
                    <Button
                      danger
                      icon={<LogoutOutlined />}
                      onClick={handleLogout}
                      className="logout-btn"
                    >
                      Logout
                    </Button>
                  </Tooltip>
                </Space>
              </Col>
            </Row>
          </div>
        </div>

        {/* Statistics Cards */}
        <Row gutter={[24, 24]} className="stats-section">
          <Col xs={24} sm={12} lg={6}>
            <Card className="stat-card completed">
              <Statistic
                title="Completed Tasks"
                value={userStats.completedTasks}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
              <div className="stat-trend">
                <Text type="success">+12% from last month</Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="stat-card in-progress">
              <Statistic
                title="In Progress"
                value={userStats.inProgressTasks}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
              <div className="stat-trend">
                <Text type="warning">Active tasks</Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="stat-card overdue">
              <Statistic
                title="Overdue"
                value={userStats.overdueTasks}
                prefix={<ExclamationCircleOutlined />}
                valueStyle={{ color: '#ff4d4f' }}
              />
              <div className="stat-trend">
                <Text type="danger">Needs attention</Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="stat-card productivity">
              <Statistic
                title="Productivity"
                value={userStats.productivity}
                suffix="%"
                prefix={<TrophyOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
              <div className="stat-trend">
                <Text type="success">Excellent!</Text>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Main Content */}
        <Row gutter={[24, 24]} className="main-content">
          {/* Left Column */}
          <Col xs={24} lg={16}>
            {/* Performance Charts */}
            <Row gutter={[16, 16]}>
              <Col xs={24} xl={12}>
                <Card 
                  title={
                    <Space>
                      <CalendarOutlined />
                      Weekly Performance
                    </Space>
                  } 
                  className="chart-card"
                >
                  <Bar {...barConfig} height={300} />
                </Card>
              </Col>
              <Col xs={24} xl={12}>
                <Card 
                  title={
                    <Space>
                      <ProjectOutlined />
                      Monthly Trend
                    </Space>
                  } 
                  className="chart-card"
                >
                  <Line {...lineConfig} height={300} />
                </Card>
              </Col>
            </Row>

            {/* Progress Overview */}
            <Card 
              title="Progress Overview" 
              className="progress-overview-card"
              style={{ marginTop: 16 }}
            >
              <Row gutter={[24, 24]} align="middle">
                <Col xs={24} md={8}>
                  <div className="progress-circle-container">
                    <Progress
                      type="circle"
                      percent={userStats.completionRate}
                      size={160}
                      strokeColor={{
                        "0%": "#722ed1",
                        "100%": "#eb2f96",
                      }}
                      format={(percent) => (
                        <div className="progress-content">
                          <div className="progress-percent">{percent}%</div>
                          <div className="progress-label">Complete</div>
                        </div>
                      )}
                    />
                  </div>
                </Col>
                <Col xs={24} md={16}>
                  <div className="progress-details">
                    <div className="progress-item">
                      <Text strong>Total Tasks</Text>
                      <div className="progress-bar">
                        <Progress 
                          percent={100} 
                          showInfo={false} 
                          strokeColor="#1890ff"
                        />
                        <Text>{userStats.totalTasks}</Text>
                      </div>
                    </div>
                    <div className="progress-item">
                      <Text strong>Completed</Text>
                      <div className="progress-bar">
                        <Progress 
                          percent={(userStats.completedTasks / userStats.totalTasks) * 100} 
                          showInfo={false} 
                          strokeColor="#52c41a"
                        />
                        <Text>{userStats.completedTasks}</Text>
                      </div>
                    </div>
                    <div className="progress-item">
                      <Text strong>In Progress</Text>
                      <div className="progress-bar">
                        <Progress 
                          percent={(userStats.inProgressTasks / userStats.totalTasks) * 100} 
                          showInfo={false} 
                          strokeColor="#faad14"
                        />
                        <Text>{userStats.inProgressTasks}</Text>
                      </div>
                    </div>
                    <div className="progress-item">
                      <Text strong>Projects</Text>
                      <div className="progress-bar">
                        <Progress 
                          percent={(userStats.activeProjects / userStats.totalProjects) * 100} 
                          showInfo={false} 
                          strokeColor="#722ed1"
                        />
                        <Text>{userStats.activeProjects}/{userStats.totalProjects}</Text>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Right Column */}
          <Col xs={24} lg={8}>
            {/* Recent Activities */}
            <Card 
              title={
                <Space>
                  <ClockCircleOutlined />
                  Recent Activities
                </Space>
              } 
              className="activities-card"
            >
              {recentActivities.length > 0 ? (
                <Timeline
                  items={recentActivities.map((activity, index) => ({
                    dot: activity.icon,
                    children: (
                      <div key={index} className="activity-item">
                        <Text strong className="activity-title">
                          {activity.title}
                        </Text>
                        <br />
                        <Text type="secondary" className="activity-time">
                          {activity.time}
                        </Text>
                      </div>
                    ),
                  }))}
                />
              ) : (
                <Empty 
                  description="No recent activities"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )}
            </Card>

            {/* Quick Actions */}
            <Card 
              title="Quick Actions" 
              className="quick-actions-card"
              style={{ marginTop: 16 }}
            >
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <Button 
                  type="primary" 
                  block 
                  icon={<ProjectOutlined />}
                  className="action-btn primary"
                >
                  Create New Project
                </Button>
                <Button 
                  block 
                  icon={<TeamOutlined />}
                  className="action-btn secondary"
                >
                  Invite Team Members
                </Button>
                <Button 
                  block 
                  icon={<CalendarOutlined />}
                  className="action-btn tertiary"
                >
                  View Calendar
                </Button>
                <Divider />
                <Button 
                  type="text" 
                  block 
                  icon={<SettingOutlined />}
                  className="action-btn text"
                >
                  Account Settings
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* Edit Profile Modal */}
        <Modal
          title={
            <Space>
              <EditOutlined />
              Update Profile Information
            </Space>
          }
          open={openModal}
          onCancel={() => {
            setOpenModal(false);
            form.resetFields();
          }}
          footer={[
            <Button
              key="cancel"
              onClick={() => {
                setOpenModal(false);
                form.resetFields();
              }}
            >
              Cancel
            </Button>,
            <Button
              key="save"
              type="primary"
              loading={loading}
              onClick={() => form.submit()}
            >
              Save Changes
            </Button>,
          ]}
          className="profile-modal"
        >
          <Form 
            layout="vertical" 
            onFinish={handleSubmit} 
            form={form}
            className="profile-form"
          >
            <Form.Item
              label="Profile Image URL"
              name="imageUrl"
              rules={[
                {
                  required: true,
                  message: "Profile image URL is required!",
                },
                {
                  type: "url",
                  message: "Please enter a valid URL!",
                }
              ]}
            >
              <Input 
                placeholder="Enter your profile image URL" 
                prefix={<UserOutlined />}
              />
            </Form.Item>

            <Form.Item
              label="Full Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Name is required!",
                },
                {
                  min: 2,
                  message: "Name must be at least 2 characters!",
                }
              ]}
            >
              <Input 
                placeholder="Enter your full name" 
                prefix={<UserOutlined />}
              />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
            >
              <Input 
                placeholder="Enter your email" 
                type="email"
                disabled
              />
            </Form.Item>
          </Form>
        </Modal>

        {/* Avatar Upload Modal */}
        <Modal
          title={
            <Space>
              <CameraOutlined />
              Update Profile Picture
            </Space>
          }
          open={openAvatarModal}
          onCancel={() => setOpenAvatarModal(false)}
          footer={null}
          className="avatar-modal"
        >
          <div className="avatar-upload-container">
            <div className="current-avatar">
              <Avatar 
                size={120} 
                src={imageUrl} 
                icon={<UserOutlined />}
              />
              <Text type="secondary">Current Avatar</Text>
            </div>
            <Divider />
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              beforeUpload={() => false}
              onChange={handleAvatarUpload}
              disabled={uploadLoading}
            >
              <div>
                {uploadLoading ? <LoadingOutlined /> : <UploadOutlined />}
                <div style={{ marginTop: 8 }}>
                  {uploadLoading ? 'Uploading...' : 'Upload New'}
                </div>
              </div>
            </Upload>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ProfilePage;
