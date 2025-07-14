import "./index.scss";
import {
  Row,
  Col,
  Card,
  Button,
  Progress,
  Modal,
  Form,
  Input,
  Popconfirm,
  DatePicker,
  Image,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getWorkSpaceUser } from "../../apis/getWorkSpaceUser";
import dayjs from "dayjs";
import { useForm } from "antd/es/form/Form";
import { addWorkSpace } from "../../apis/addWorkspaceApi";
import { editWorkSpace } from "../../apis/editWorkspaceApi";

import { useNavigate } from "react-router-dom";
import Carousel from "../../components/carousel";
import AboutSection from "../../components/subTitleMainHome";
import { addMemberApi } from "../../apis/WorkSpaceUser/addMemberToWorkSpaceApi";
import { addTaskToWS } from "../../apis/task/addTaskToWSApi";

const HomePage = () => {
  const [isOpenModalAddmember, setOpenModalAddMember] = useState(false);
  const [formAddMember] = Form.useForm();
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const username = useSelector((store) => store?.user?.username);
  const user_id = useSelector((store) => store?.user?.id);
  const [loading, setLoading] = useState(false);
  const [workSpaces, setWorkSpaces] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [formUpdate] = useForm();
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [workSpaceId, setWorkSpaceId] = useState("");
  const [openAddTaskModal, setOpenAddTaskModal] = useState(false);
  const imageUserFromRedux = useSelector((store) => store?.user?.imageUrl);
  const navigate = useNavigate();
  const [form] = useForm();
  const [formAddTaskToWorkSpace] = useForm();

  const handleCloseModal = () => {
    setOpenModal(false);
    form.resetFields();
  };

  const handleCloseModalUpdate = () => {
    setOpenModalUpdate(false);
    formUpdate.resetFields();
  };

  const fetchWorkspaceUser = async () => {
    try {
      const response = await getWorkSpaceUser(user_id);
      setWorkSpaces(response.data.data);
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  useEffect(() => {
    if (user_id) {
      fetchWorkspaceUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user_id]);

  // const handleAddTaskToWorkSpace = async (workSpaceId) => {
  //   setWorkSpaceId(workSpaceId);
  //   setOpenAddTaskModal(true);
  // };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await addWorkSpace(values, user_id);
      toast.success("Add workSpace success!!");
      setOpenModal(false);
      form.resetFields();
      fetchWorkspaceUser();
    } catch (error) {
      toast.error(error.response.data.message.error);
      setOpenModal(false);
      form.resetFields();
    }
    setLoading(false);
  };

  // const handleDeleteWorkSpace = async (id) => {
  //   setLoading(true);
  //   try {
  //     await deleteWorkSpace(id);
  //     toast.success("Delete Sucess!");
  //     fetchWorkspaceUser();
  //   } catch (error) {
  //     toast.error(error.response.data);
  //   }
  //   setLoading(false);
  // };

  const handleSubmitUpdate = async (values) => {
    setLoading(true);
    try {
      const payload = {
        name: values.name,
      };
      await editWorkSpace(payload, values.id);
      toast.success("Updated success!!");
      setOpenModalUpdate(false);
      formUpdate.resetFields();
      fetchWorkspaceUser();
    } catch (error) {
      toast.error(error.response.data.message.error);
    }
    setLoading(false);
  };

  const handleSubmitFormAddTaskToWorkSpace = async (values) => {
    setLoading(true);
    try {
      const requestBody = {
        title: values.title,
        status: values.status,
        dueDate: values.dueDate.toISOString(),
      };
      await addTaskToWS(requestBody, workSpaceId);
      toast.success("Add Task To Your WorkSpace success!");
      formAddTaskToWorkSpace.resetFields();
      setOpenAddTaskModal(false);
      setWorkSpaceId("");
    } catch (error) {
      toast.error(error.response.data);
    }
    setLoading(false);
  };

  // const handleNavigateToTaskDetails = (workspaceId) => {
  //   navigate(`tasks-details/${workspaceId}`);
  // };

  const handleSubmitAddMember = async (values) => {
    setLoading(true);
    try {
      await addMemberApi(workSpaceId, values);
      toast.success("Added successfully!");
      formAddMember.resetFields();
      setOpenModalAddMember(false);
      setWorkSpaceId("");
    } catch (error) {
      toast.error(error?.response?.data?.message?.error);
    }
    setLoading(false);
  };

  // const handleOpenModalAddMemberToWorkSpace = (id) => {
  //   setWorkSpaceId(id);
  //   setOpenModalAddMember(true);
  // };

  // const handleNavigatePageMember = (id) => {
  //   navigate(`MembersInWorkSpace/${id}`);
  // };

  return (
    <div className="homepage">
      <Carousel />
      <AboutSection />
      
      {/* Header with greeting */}
      <div className="hero-section">
        <div className="hero-content">
          <Row align="middle">
            <Col xs={24} lg={16}>
              <div className="user-greeting">
                <div className="avatar-container">
                  <Image
                    onClick={() => navigate("profile-page")}
                    preview={false}
                    className="user-avatar"
                    src={imageUserFromRedux}
                    width={80}
                    height={80}
                  />
                  <div className="status-dot"></div>
                </div>
                <div className="greeting-text">
                  <h1 className="welcome-title">
                    Welcome back, <span className="username-highlight">{username}</span>! 👋
                  </h1>
                  <p className="welcome-subtitle">
                    {today} • Ready to tackle your goals today?
                  </p>
                </div>
              </div>
            </Col>
            <Col xs={24} lg={8} className="header-actions">
              <Button
                onClick={() => {navigate("/own-dashboard")}}
                type="primary"
                icon={<PlusOutlined />}
                size="large"
                className="add-workspace-btn"
              >
                Create Workspace
              </Button>
            </Col>
          </Row>
        </div>
      </div>

      {/* Task Summary Cards */}
      {/* <div className="dashboard-overview">
        <div className="section-header">
          <h2>📊 Today's Overview</h2>
          <p>Track your progress and stay organized</p>
        </div>
        
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} lg={8}>
            <Card className="stats-card today-tasks">
              <div className="card-icon">📋</div>
              <div className="card-content">
                <h3>Today's Tasks</h3>
                <div className="progress-container">
                  <Progress 
                    type="circle" 
                    percent={0} 
                    format={() => "0/2"}
                    strokeColor="#1890ff"
                    size={80}
                  />
                </div>
                <p className="card-subtitle">{today}</p>
              </div>
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={8}>
            <Card className="stats-card in-progress">
              <div className="card-icon">🚀</div>
              <div className="card-content">
                <h3>In Progress</h3>
                <div className="progress-item">
                  <div className="progress-title">Office Project</div>
                  <div className="progress-desc">Grocery shopping app design</div>
                  <Progress percent={75} strokeColor="#52c41a" showInfo={false} />
                </div>
              </div>
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={8}>
            <Card className="stats-card task-groups">
              <div className="card-icon">📁</div>
              <div className="card-content">
                <h3>Workspaces</h3>
                <div className="group-item">
                  <span>Office Project</span>
                  <span className="count">23 Tasks</span>
                </div>
                <div className="group-item">
                  <span>Personal Project</span>
                  <span className="count">2 Tasks</span>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div> */}

      {/* Workspaces Section */}
      <div className="workspaces-section">
        <div className="section-header">
          <h2>🏢 Your Workspaces</h2>
          <p>Manage and organize your projects</p>
        </div>
        
        <Row gutter={[24, 24]}>
          {workSpaces.length === 0 ? (
            <Col span={24}>
              <Card className="empty-state">
                <div className="empty-content">
                  <div className="empty-icon">📋</div>
                  <h3>No workspaces yet</h3>
                  <p>Create your first workspace to get started</p>
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={() => setOpenModal(true)}
                    size="large"
                  >
                    Create Workspace
                  </Button>
                </div>
              </Card>
            </Col>
          ) : (
            workSpaces.map((workspace) => (
              <Col xs={24} sm={12} lg={8} xl={6} key={workspace.id}>
                <Card 
                  className="workspace-card"
                  hoverable
                  title={
                    <div className="workspace-header">
                      <div className="workspace-icon">💼</div>
                      <span className="workspace-name">{workspace.name}</span>
                    </div>
                  }
                  // extra={
                  //   // <div className="workspace-actions">
                  //   //   <Button
                  //   //     size="small"
                  //   //     type="text"
                  //   //     onClick={() => {
                  //   //       setOpenModalUpdate(true);
                  //   //       formUpdate.setFieldsValue(workspace);
                  //   //     }}
                  //   //   >
                  //   //     ✏️
                  //   //   </Button>
                  //   //   <Popconfirm
                  //   //     title="Delete workspace?"
                  //   //     description="This action cannot be undone"
                  //   //     onConfirm={() => handleDeleteWorkSpace(workspace.id)}
                  //   //     okText="Delete"
                  //   //     cancelText="Cancel"
                  //   //   >
                  //   //     <Button size="small" type="text" danger>
                  //   //       🗑️
                  //   //     </Button>
                  //   //   </Popconfirm>
                  //   // </div>
                  // }
                >
                  <div className="workspace-content">
                    <div className="workspace-meta">
                      <span className="created-date">
                        📅 {dayjs(workspace.createdAt).format("DD/MM/YYYY")}
                      </span>
                    </div>
                    
                    {/* <div className="workspace-actions-grid">
                      <Button
                        className="action-btn primary"
                        icon="➕"
                        onClick={() => handleAddTaskToWorkSpace(workspace.id)}
                      >
                        Add Tasks
                      </Button>
                      
                      <Button
                        className="action-btn secondary"
                        icon="📋"
                        onClick={() => handleNavigateToTaskDetails(workspace.id)}
                      >
                        View Tasks
                      </Button>
                      
                      <Button
                        className="action-btn secondary"
                        icon="👥"
                        onClick={() => handleNavigatePageMember(workspace.id)}
                      >
                        Members
                      </Button>
                      
                      <Button
                        className="action-btn accent"
                        icon="👤"
                        onClick={() => handleOpenModalAddMemberToWorkSpace(workspace.id)}
                      >
                        Add Member
                      </Button>
                    </div> */}
                  </div>
                </Card>
              </Col>
            ))
          )}
        </Row>
      </div>

      {/* Modals */}
      {/* Add workSpace */}
      <Modal
        footer={[
          <Button key="cancel" onClick={handleCloseModal}>Cancel</Button>,
          <Button
            key="save"
            loading={loading}
            onClick={() => {
              form.submit();
            }}
          >
            Save
          </Button>,
        ]}
        open={openModal}
        onCancel={handleCloseModal}
        title="Workspace information"
      >
        <Form labelCol={{ span: 24 }} form={form} onFinish={handleSubmit}>
          <Form.Item
            name={"name"}
            label="Workspace name"
            rules={[
              {
                required: true,
                message: "Workspace name must not be blank!!",
              },
            ]}
          >
            <Input placeholder="Enter workspace name" />
          </Form.Item>
        </Form>
      </Modal>

      {/* edit workspace */}
      <Modal
        footer={[
          <Button key="cancel" onClick={handleCloseModalUpdate}>Cancel</Button>,
          <Button
            key="save"
            loading={loading}
            onClick={() => {
              formUpdate.submit();
            }}
          >
            Save
          </Button>,
        ]}
        open={openModalUpdate}
        onCancel={handleCloseModalUpdate}
        title="Update Workspace information"
      >
        <Form
          labelCol={{ span: 24 }}
          form={formUpdate}
          onFinish={handleSubmitUpdate}
        >
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            name={"name"}
            label="Workspace name"
            rules={[
              {
                required: true,
                message: "Workspace name must not be blank!!",
              },
            ]}
          >
            <Input placeholder="Enter workspace name" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Add new task to your workspace!"
        open={openAddTaskModal}
        onCancel={() => {
          setOpenAddTaskModal(false);
          formAddTaskToWorkSpace.resetFields();
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setOpenAddTaskModal(false);
              formAddTaskToWorkSpace.resetFields();
            }}
          >
            Cancel
          </Button>,
          <Button
            key="save"
            loading={loading}
            onClick={() => {
              formAddTaskToWorkSpace.submit();
            }}
          >
            Save
          </Button>,
        ]}
      >
        <Form
          labelCol={{ span: 24 }}
          form={formAddTaskToWorkSpace}
          onFinish={handleSubmitFormAddTaskToWorkSpace}
        >
          <Form.Item
            label="Title"
            name={"title"}
            rules={[
              {
                required: true,
                message: "Title is required!",
              },
            ]}
          >
            <Input placeholder="Enter title" />
          </Form.Item>

          <Form.Item
            label="Status"
            name={"status"}
            rules={[
              {
                required: true,
                message: "Status is required!",
              },
            ]}
          >
            <Input placeholder="Enter status" />
          </Form.Item>
          <Form.Item
            label="Due Date"
            name="dueDate"
            rules={[{ required: true, message: "Please pick due date" }]}
          >
            <DatePicker showTime style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>

      {/* add member */}
      <Modal
        title="Add other members"
        onCancel={() => {
          setOpenModalAddMember(false);
          formAddMember.resetFields();
        }}
        open={isOpenModalAddmember}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setOpenModalAddMember(false);
              formAddMember.resetFields();
            }}
          >
            Cancel
          </Button>,
          <Button
            key="save"
            loading={loading}
            onClick={() => {
              formAddMember.submit();
            }}
          >
            Save
          </Button>,
        ]}
      >
        <Form
          labelCol={{ span: 24 }}
          form={formAddMember}
          onFinish={handleSubmitAddMember}
        >
          <Form.Item
            label="User ID"
            name={"userId"}
            rules={[
              {
                required: true,
                message: "User ID is required!!",
              },
            ]}
          >
            <Input placeholder="Add userid" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default HomePage;
