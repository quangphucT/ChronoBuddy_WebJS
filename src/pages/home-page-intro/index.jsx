import './index.scss';
import { Button } from 'antd';
import { ArrowRightOutlined, PlayCircleOutlined } from '@ant-design/icons';
import logoTODOLIST from '../../assets/images/8019152.png'
import { useNavigate } from 'react-router-dom';

const HomePageIntro = () => {
  const navigate = useNavigate();
  
  return (
    <div className="home-page">
      <div className="home-content">
        <div className="left">
          <div className="image-container">
            <img src={logoTODOLIST} alt="Task Management Platform" className="bee-image" />
            <div className="floating-elements">
              <div className="floating-card card-1">
                <div className="task-item">
                  <span className="status completed"></span>
                  <span>Project Planning</span>
                </div>
              </div>
              <div className="floating-card card-2">
                <div className="task-item">
                  <span className="status in-progress"></span>
                  <span>Team Meeting</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="right">
          <div className="content-wrapper">
            <div className="badge">
              <span>🚀 Productivity Suite</span>
            </div>
            <h1 className="title">
              Streamline Your 
              <span className="highlight"> Workflow</span>
            </h1>
            <p className="subtitle">
              Boost productivity with our comprehensive task management platform. 
              Organize projects, collaborate seamlessly, and achieve your goals faster 
              than ever before.
            </p>
            <div className="features">
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Real-time collaboration</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Advanced analytics</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Smart notifications</span>
              </div>
            </div>
            <div className="cta-group">
              <Button 
                onClick={() => navigate("/home-page-lets-start")}
                type="primary"
                size="large"
                className="start-btn"
                icon={<ArrowRightOutlined />}
              >
                Get Started Free
              </Button>
              <Button 
                size="large"
                className="demo-btn"
                icon={<PlayCircleOutlined />}
              >
                Watch Demo
              </Button>
            </div>
            <div className="stats">
              <div className="stat-item">
                <span className="stat-number">50K+</span>
                <span className="stat-label">Active Users</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">99.9%</span>
                <span className="stat-label">Uptime</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePageIntro;
