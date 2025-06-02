import './index.scss';
import { Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import logoTODOLIST from '../../assets/images/8019152.png'
import { useNavigate } from 'react-router-dom';
const HomePageIntro = () => {
  const navigate = useNavigate();
  return (
    <div className="home-page">
      <div className="home-content">
        <div className="left">
          <img src={logoTODOLIST} alt="Bee" className="bee-image" />
        </div>

        <div className="right">
          <h1 className="title">Task Management & To-Do List</h1>
          <p className="subtitle">
            This productive tool is designed to help you better manage your task<br />
            project-wise conveniently!
          </p>
          <Button onClick={() => navigate("/home-page-lets-start") }
            type="primary"
            size="large"
            className="start-btn"
            icon={<ArrowRightOutlined />}
          >
            Let’s Start
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePageIntro;
