import { Row, Col } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";

import logoTODOLIST from "../../assets/images/business-team-meeting-boardroom.jpg";
import './index.scss'
const HomePageIntro = () => {

  return (
    <div className="min-h-screen flex items-center bg-white ">
      <Row gutter={[32, 32]} className="w-full">
        {/* BÊN TRÁI: HÌNH */}
        <Col xs={24} md={12} className="flex justify-center items-center">
          <img
            src={logoTODOLIST}
            alt="To-Do Logo"
            className="max-w-full h-auto rounded-xl shadow-lg"
          />
        </Col>

        {/* BÊN PHẢI: CHỮ */}
        <Col xs={24} md={12} className="flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1e88e5] mb-4">
            Task Management & To-Do List
          </h1>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            This productive tool is designed to help you better manage your tasks
            project-wise — all in one place!
          </p>
          <button
          
            type="primary"
            size="large"
            icon={<ArrowRightOutlined />}
            className="bg-[#1e88e5] hover:bg-[#1669c1] text-white px-[40px] py-[10px] cursor-pointer rounded-4xl font-bold"
          >
            Try Pro Package Below
          </button>
        </Col>
      </Row>
    </div>
  );
};

export default HomePageIntro;
