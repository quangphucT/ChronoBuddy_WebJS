import './index.scss';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import logoBee from '../../assets/images/1740063267602.gif'
const HomePageLetStart = () => {
  const navigate = useNavigate();

  return (
    <div className="home-start-page">
      <div className="home-start-container">
        <img src={logoBee} alt="Bee" className="bee-image" />

        <h2 className="title">Let’s get you sorted</h2>
        <p className="subtitle">
          This productive tool is designed to help you better manage your task
          project-wise conveniently!
        </p>

        <Button
          type="primary"
          className="sign-up-btn"
          size="large"
          onClick={() => navigate('/register-page')}
        >
          Sign up
        </Button>

        <Button
          className="log-in-btn"
          size="large"
          onClick={() => navigate('/login-page')}
        >
          Log in
        </Button>
      </div>
    </div>
  );
};

export default HomePageLetStart;
