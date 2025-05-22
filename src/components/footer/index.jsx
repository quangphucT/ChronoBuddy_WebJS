import './index.scss';
import { Row, Col } from 'antd';
import { HomeOutlined, PlusOutlined, CalendarOutlined, TeamOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="footer">
      <Row justify="space-around" align="middle" className="nav-icons">
        <Col>
          <HomeOutlined onClick={() => navigate("")} className="footer-icon active" />
        </Col>
        <Col>
          <PlusOutlined onClick={() => navigate("add-projects-tasks")} className="footer-icon" />
        </Col>
        <Col>
          <CalendarOutlined className="footer-icon" />
        </Col>
        <Col>
          <TeamOutlined className="footer-icon" />
        </Col>
      </Row>
      <div className="copyright">
        <p>© 2025 Todo List - Powered by Creativity.</p>
      </div>
    </footer>
  );
};

export default Footer;