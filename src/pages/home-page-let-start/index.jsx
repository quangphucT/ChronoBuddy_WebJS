import './index.scss';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { UserOutlined, LoginOutlined, GoogleOutlined, GithubOutlined } from '@ant-design/icons';
import logoTODOLIST from '../../assets/images/8019152.png'

const HomePageLetStart = () => {
  const navigate = useNavigate();

  return (
    <div className="home-start-page">
      <div className="home-start-container">
        <div className="logo-section">
          <img src={logoTODOLIST} alt="ChronoBuddy Logo" className="bee-image" />
          <div className="logo-text">
            <h1>ChronoBuddy</h1>
            <span>Productivity Suite</span>
          </div>
        </div>

        <div className="content-section">
          <h2 className="title">Welcome Back!</h2>
          <p className="subtitle">
            Streamline your workflow and achieve remarkable results.
          </p>
        </div>

        <div className="auth-section">
          <Button
            type="primary"
            className="sign-up-btn"
            size="large"
            icon={<UserOutlined />}
            onClick={() => navigate('/register-page')}
            block
          >
            Create Account
          </Button>

          <Button
            className="log-in-btn"
            size="large"
            icon={<LoginOutlined />}
            onClick={() => navigate('/login-page')}
            block
          >
            Sign In
          </Button>

          {/* <div className="divider">
            <span>or continue with</span>
          </div>

          <div className="social-auth">
            <Button
              className="social-btn google-btn"
              icon={<GoogleOutlined />}
              size="large"
            >
              Google
            </Button>
            <Button
              className="social-btn github-btn"
              icon={<GithubOutlined />}
              size="large"
            >
              GitHub
            </Button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default HomePageLetStart;
