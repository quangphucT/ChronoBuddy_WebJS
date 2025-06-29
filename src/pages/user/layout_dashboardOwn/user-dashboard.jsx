// src/pages/Dashboard.tsx

import {
  Layout,
  Menu,
  Card,
  Avatar,
  Button,
  Progress,
  Input,
  Image,
  Modal,
} from "antd";
import {
  DashboardOutlined,
  ProjectOutlined,
  SettingOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";

const { Header, Sider, Content } = Layout;
import icon from "../../../assets/images/icon_dashboard.svg";
import { useNavigate } from "react-router-dom";

import { useState } from "react";
import StatisticOwn from "../statistic";
import NhiemVu from "../Nhiemvu";
import { toast } from "react-toastify";
import AddWorkspaceModal from "../../../components/atoms/AddWorkspaceModal";
import { useSelector } from "react-redux";
import { addWorkSpace } from "../../../apis/addWorkspaceApi";
import Duan from "../Duan";
import { BiChat } from "react-icons/bi";
import ChatBox from "../../chatboxAI/chatbotform";

const OwnDashboard = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("dashboard");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const user_id = useSelector((store) => store?.user?.id);

  const handleCreate = async (values) => {
    setLoading(true);
    try {
      await addWorkSpace(values, user_id);
      toast.success("Tạo workspace thành công!");
      setOpenModal(false);
    } catch (error) {
      toast.error(error?.response?.data?.message?.error || "error");
    }
    setLoading(false);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider width={240} style={{ backgroundColor: "#F45C25" }}>
        <div className="flex justify-center mt-6">
          <Image
            className="text-center"
            preview={false}
            src={icon}
            width={80}
            height={80}
          />
        </div>

        <Menu
          className="!w-[200px]"
          mode="vertical"
          onClick={(e) => setSelectedMenu(e.key)}
          style={{
            backgroundColor: "#F45C25",
            color: "white",
            borderRight: 0,
            display: "flex",
            flexDirection: "column",
            margin: "0 auto",
            marginTop: "80px",
            fontWeight: "600",
            fontSize: "16px",
          }}
        >
          <Menu.Item key="dashboard" icon={<DashboardOutlined width={30} />}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="tasks" icon={<ProjectOutlined />}>
            Nhiệm vụ
          </Menu.Item>
          <Menu.Item key="projects" icon={<ProjectOutlined />}>
            Dự án của tôi
          </Menu.Item>
          <Menu.Item key="settings" icon={<SettingOutlined />}>
            Cài đặt
          </Menu.Item>
          <Menu.Item key="home" icon={<SettingOutlined />}>
            Main Screen
          </Menu.Item>
          <Menu.Item key="chatbot" icon={<BiChat />}>
            Todo Assistant
          </Menu.Item>
        </Menu>
        <Button
          onClick={() => {
            setOpenModal(true);
          }}
          type="primary"
          style={{
            backgroundColor: "#FF7139",
            margin: 16,
            borderRadius: 8,
            width: "calc(100% - 32px)",
          }}
        >
          Dự án của tôi +
        </Button>
      </Sider>

      {/* Main content */}
      <Layout style={{ background: "#F45C25", maxHeight: "100%" }}>
        {/* Header */}
        <Header
          style={{
            backgroundColor: "#F45C25",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 24px",
            height: "90px",
          }}
        >
          <Input.Search
            placeholder="Tìm kiếm dự án hoặc nhiệm vụ..."
            style={{ width: "400px" }}
          />
          <div className="flex items-center gap-4">
            <div className="text-white font-medium">Hthais Than</div>
            <Avatar src="https://i.pravatar.cc/100" />
          </div>
        </Header>

        {/* Content */}
        <Card style={{ borderTopLeftRadius: "40px", height: "100%" }}>
          <Content style={{ padding: "20px 24px", background: "#f9f9f9" }}>
            {selectedMenu === "dashboard" && (
              <div>
                <StatisticOwn onNavigateToProjects={() => setSelectedMenu("projects")} />
              </div>
            )}

            {selectedMenu === "tasks" && (
              <>
                <NhiemVu />
              </>
            )}

            {selectedMenu === "projects" && (
              <div>
                <Duan />
              </div>
            )}

            {selectedMenu === "settings" && (
              <div>
                <h1 className="text-xl font-semibold mb-4">Cài đặt</h1>
                <p>Hiển thị nội dung cài đặt tại đây...</p>
              </div>
            )}
            {selectedMenu === "home" && navigate("/home")}
          </Content>

          {selectedMenu === "chatbot" && (
            <div>
              <ChatBox />
            </div>
          )}
        </Card>
      </Layout>

      <AddWorkspaceModal
        loading={loading}
        open={openModal}
        onCancel={() => {
          setOpenModal(false);
        }}
        onCreate={handleCreate}
      />
    </Layout>
  );
};

export default OwnDashboard;
