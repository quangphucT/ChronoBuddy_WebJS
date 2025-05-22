import './index.scss';
import { Row, Col, Card, Avatar, Progress, Button, Statistic } from 'antd';
import { EditOutlined, LogoutOutlined } from '@ant-design/icons';
import { Bar } from '@ant-design/charts';
import { useDispatch } from 'react-redux';
import { removeInformation } from '../../redux/feature/userSlice';
import { useNavigate } from 'react-router-dom';


const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Dữ liệu giả cho biểu đồ cột Weekly Performance
  const barData = [
    { day: 'Mon', tasks: 5 },
    { day: 'Tue', tasks: 8 },
    { day: 'Wed', tasks: 3 },
    { day: 'Thu', tasks: 6 },
    { day: 'Fri', tasks: 4 },
    { day: 'Sat', tasks: 2 },
    { day: 'Sun', tasks: 1 },
  ];

  const barConfig = {
    data: barData,
    xField: 'tasks',
    yField: 'day',
    color: '#ff9800', // Cam đậm
    label: {
      position: 'middle',
      style: { fill: '#fff' },
    },
  };
  const handleLogout = () => {
    dispatch(removeInformation())
    navigate("/login-page");
    localStorage.setItem("token", '')
  }
  return (
    <div className="profile-page">

      <div className="profile-content">
        <Row gutter={[16, 16]} align="middle" justify="center">
          <Col xs={24} md={8} className="avatar-section">
            <Card className="avatar-card">
              <Avatar size={128} src="https://via.placeholder.com/128" />
              <h3>Phuong Thanh</h3>
              <p>phuongthanh@example.com</p>
            </Card>
          </Col>
          <Col xs={24} md={16}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Card className="progress-card">
                  <Statistic title="Completed Tasks" value={75} suffix="%" />
                  <Progress type="circle" percent={75} format={(percent) => `${percent}%`} />
                </Card>
              </Col>
              <Col xs={24} sm={12}>
                <Card className="actions-card">
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    className="action-btn edit-btn"
                    block
                  >
                    Edit Profile
                  </Button>
                  <Button onClick={handleLogout}
                    type="default"
                    icon={<LogoutOutlined />}
                    className="action-btn logout-btn"
                    block
                  >
                    Logout
                  </Button>
                </Card>
              </Col>
            </Row>
            <Card className="chart-card">
              <h3>Weekly Performance</h3>
              <Bar {...barConfig} />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ProfilePage;