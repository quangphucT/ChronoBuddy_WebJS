import { useState } from "react";
import {
  DesktopOutlined,
  PieChartOutlined,
  UserOutlined,
  DeleteOutlined,
  CrownOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  SettingOutlined,
  LogoutOutlined,
  DashboardOutlined
} from "@ant-design/icons";
import { Layout, Menu, Button, Avatar, Badge, Dropdown, Space, Typography } from "antd";
import { Link, Outlet, useLocation } from "react-router-dom";
import "./index.scss";
const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label: <Link to={`/dashboard/${key}`} className="menu-link">{label}</Link>,
  };
}

const items = [
  getItem("Dashboard", "overview", <DashboardOutlined />),
  getItem("Statistics", "statistic", <PieChartOutlined />),
  getItem("User Management", "user-management", <UserOutlined />),
  getItem("User Delete Management", "user-delete-management", <DeleteOutlined />),
  getItem("PackagePro Management", "manage-advancedPackage", <CrownOutlined />),
];
const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  // User dropdown menu
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile Settings',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Preferences',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
    },
  ];

  const getCurrentPageTitle = () => {
    const path = location.pathname;
    if (path.includes('statistic')) return 'Statistics Dashboard';
    if (path.includes('user-management')) return 'User Management';
    if (path.includes('user-delete-management')) return 'Delete Management';
    if (path.includes('manage-advancedPackage')) return 'Package Management';
    return 'Dashboard Overview';
  };
  return (
    <Layout style={{ minHeight: "100vh" }} className="dashboard-layout">
      <Sider
        width={280}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        className="dashboard-sider"
        theme="light"
      >
        {/* Logo Section */}
        <div className="logo-container">
          <div className="logo">
            <DashboardOutlined className="logo-icon" />
            {!collapsed && (
              <div className="logo-text">
                <Title level={4} className="brand-title">ChronoBuddy</Title>
                <Text type="secondary" className="brand-subtitle">Admin Panel</Text>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <Menu
          theme="light"
          defaultSelectedKeys={["statistic"]}
          mode="inline"
          items={items}
          className="dashboard-menu"
        />

        {/* Collapse Info */}
        {!collapsed && (
          <div className="sider-footer">
            <div className="version-info">
              <Text type="secondary">Version 2.0.1</Text>
            </div>
          </div>
        )}
      </Sider>

      <Layout className="site-layout">
        {/* Header */}
        <Header className="dashboard-header">
          <div className="header-left">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="trigger-btn"
            />
            <div className="page-title-section">
              <Title level={3} className="page-title">{getCurrentPageTitle()}</Title>
              <Text type="secondary">Manage your application efficiently</Text>
            </div>
          </div>

          <div className="header-right">
            <Space size="middle">
              {/* Notifications */}
              <Badge count={5} size="small">
                <Button
                  type="text"
                  icon={<BellOutlined />}
                  className="header-btn"
                />
              </Badge>

              {/* Settings */}
              <Button
                type="text"
                icon={<SettingOutlined />}
                className="header-btn"
              />

              {/* User Profile */}
              <Dropdown
                menu={{ items: userMenuItems }}
                placement="bottomRight"
                trigger={['click']}
              >
                <div className="user-profile">
                  <Avatar
                    size={40}
                    icon={<UserOutlined />}
                    className="user-avatar"
                  />
                  {!collapsed && (
                    <div className="user-info">
                      <Text strong>Admin User</Text>
                      <Text type="secondary" className="user-role">Administrator</Text>
                    </div>
                  )}
                </div>
              </Dropdown>
            </Space>
          </div>
        </Header>

        {/* Content */}
        <Content className="dashboard-content">
          <div className="content-wrapper">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
export default App;
