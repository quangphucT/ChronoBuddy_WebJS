import './index.scss';
import { useNavigate } from 'react-router-dom';
import logoTODOLIST from '../../assets/images/8019152.png'
const HomePageLetStart = () => {
  const navigate = useNavigate();

  return (
    <div className="home-start-page">
      <div className="home-start-container">
        <img src={logoTODOLIST} alt="Bee" className="bee-image" />

        <h2 className="title">Let’s get you sorted</h2>
        <p className="subtitle">
          This productive tool is designed to help you better manage your task
          project-wise conveniently!
        </p>

        <button
          type="primary"
          className="sign-up-btn"
          size="large"
          onClick={() => navigate('/register-page')}
        >
          Sign up
        </button>

        <button
          className="log-in-btn"
          size="large"
          onClick={() => navigate('/login-page')}
        >
          Log in
        </button>
      </div>
    </div>
  );
};

export default HomePageLetStart;
