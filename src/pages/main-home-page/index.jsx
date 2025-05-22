import './index.scss';
import { Row, Col, Card, Button, Progress, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';



const HomePage = () => {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }); // Hiển thị ngày hiện tại
  const username = useSelector((store) => store?.user?.username)
  return (
    <div className="homepage">
      <div className="header-home-main">
        <Row align="middle" gutter={16}>
          <Col>
            <Avatar size={64} icon={<UserOutlined />} />
          </Col>
          <Col>
            <h2>Hello! <span className="username">{username}</span></h2>
          </Col>
        </Row>
      </div>
      <div className="main-content">
        <Card className="today-task-card">
          <h3>Your today’s task</h3>
          <p>almost done!</p>
          <Progress type="circle" percent={0} format={() => '0/2'} />
          <p className="task-day">{today}</p>
          <Button type="primary" className="view-task-btn">
            View Task
          </Button>
        </Card>
        <h3>In Progress</h3>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Card className="in-progress-card">
              <h4>Office Project</h4>
              <p>Grocery shopping app design</p>
            </Card>
          </Col>
          <Col xs={24} sm={12}>
            <Card className="in-progress-card">
              <h4>Personal Project</h4>
              <p>Design logo</p>
            </Card>
          </Col>
        </Row>
        <h3>Task Groups</h3>
        <Card className="task-group-card">
          <p>Office Project <span>23 Task</span></p>
        </Card>
        <Card className="task-group-card">
          <p>Personal Project <span>2 Task</span></p>
        </Card>
        <Card className="task-group-card">
          <p>Team Project <span>3 Task</span></p>
        </Card>
      </div>

    </div>
  );
};

export default HomePage;