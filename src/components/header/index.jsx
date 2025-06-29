import { useEffect, useState } from "react";
import { Image, Dropdown, Badge, Space, Button } from "antd";
import "./index.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  UserOutlined, 
  BellOutlined, 
  SettingOutlined, 
  LogoutOutlined,
  DashboardOutlined,
  CrownOutlined,
  HistoryOutlined
} from "@ant-design/icons";
import { useSelector } from "react-redux";

const Header = () => {
  const location = useLocation();

  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const imageUrlAfterLogin = useSelector((store) => store?.user?.imageUrl);
  const nameOnRedux = useSelector((store) => store?.user?.username);
  const isHomePage = location.pathname === "/home";
  
 // userInformation on Redux
   const userInformation = useSelector((store) => store?.user);


  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    if (isHomePage) {
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isHomePage]);

  const handleNavigate = () => {
    navigate("profile-page");
  };

  // User dropdown menu items
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile Settings',
      onClick: () => navigate("profile-page"),
    },
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'My Dashboard',
      onClick: () => navigate("/own-dashboard"),
    },
    {
      type: 'divider',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
    },
  ];

  const headerClasses =
    isHomePage && !scrolled
      ? "header-transparent"
      : "header-solid";

  return (
    <header className={`modern-header ${headerClasses}`}>
      <div className="header-container">
        {/* Logo Section */}
        <div className="logo-section" onClick={() => navigate("/")}>
          <div className="logo-icon">
            <DashboardOutlined />
          </div>
          <h1 className="brand-title">
            ChronoBuddy
          </h1>
        </div>

        {/* Navigation Actions */}
        <div className="nav-actions">
          {/* Quick Action Buttons */}
          <div className="action-buttons">
            <Button
              type="text"
              icon={<HistoryOutlined />}
              onClick={() => navigate("transaction-history")}
              className="action-btn history-btn"
            >
              <span className="btn-text">History</span>
            </Button>

            <Button
              type="primary"
              icon={<CrownOutlined />}
              onClick={() => navigate("PageProListPage")}
              className="action-btn upgrade-btn"
            >
              Upgrade Pro
            </Button>

            <Button
              icon={<DashboardOutlined />}
              onClick={() => navigate("/own-dashboard")}
              className="action-btn dashboard-btn"
            >
              <span className="btn-text">Dashboard</span>
            </Button>
          </div>

          {/* User Section */}
          <div className="user-section">
            {/* Notifications */}
            <Badge count={3} size="small">
              <Button
                type="text"
                icon={<BellOutlined />}
                className="notification-btn"
              />
            </Badge>

            {/* User Profile */}
            {userInformation ? (
              <Dropdown
                menu={{ items: userMenuItems }}
                placement="bottomRight"
                trigger={['click']}
                className="user-dropdown"
              >
                <div className="user-profile">
                  <div className="user-info">
                    <span className="user-name">{nameOnRedux}</span>
                    <span className="user-role">Member</span>
                  </div>
                  <Image
                    src={imageUrlAfterLogin}
                    alt="avatar"
                    width={40}
                    height={40}
                    preview={false}
                    className="user-avatar"
                  />
                </div>
              </Dropdown>
            ) : (
              <Button
                type="text"
                icon={<UserOutlined />}
                onClick={handleNavigate}
                className="login-btn"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
