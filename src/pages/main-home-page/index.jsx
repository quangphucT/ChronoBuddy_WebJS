import "./index.scss";
import {
  Row,
  Col,
  Card,
  Button,
  Progress,
  Avatar,
  Modal,
  Form,
  Input,
  Popconfirm,
  DatePicker,
  Image,
} from "antd";
import { PlusOutlined, UserOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getWorkSpaceUser } from "../../apis/getWorkSpaceUser";
import dayjs from "dayjs";
import { useForm } from "antd/es/form/Form";
import { addWorkSpace } from "../../apis/addWorkspaceApi";
import { deleteWorkSpace } from "../../apis/deleteWorkSpaceApi";
import { editWorkSpace } from "../../apis/editWorkspaceApi";
import { addTaskToWS } from "../../apis/addTaskToWSApi";
import { useNavigate } from "react-router-dom";
import Carousel from "../../components/carousel";
import AboutSection from "../../components/subTitleMainHome";

const HomePage = () => {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" }); // Hiển thị ngày hiện tại
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
    fetchWorkspaceUser();
  }, []);
  const handleAddTaskToWorkSpace = async (workSpaceId) => {
    setWorkSpaceId(workSpaceId);
    setOpenAddTaskModal(true);
  };
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
  const handleDeleteWorkSpace = async (id) => {
    setLoading(true);
    try {
      await deleteWorkSpace(id);
      toast.success("Delete Sucess!");
      fetchWorkspaceUser();
    } catch (error) {
      toast.error(error.response.data);
    }
    setLoading(false);
  };
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
        dueDate: values.dueDate.toISOString(), // Convert to ISO string
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
  const handleNavigateToTaskDetails = (workspaceId) => {
    navigate(`tasks-details/${workspaceId}`);
  };
  return (
    <div>
      <Carousel />
      <AboutSection />
      <div className="homepage">
        <div className="header-home-main">
          <Button
            style={{
              display: "flex",
              margin: "0 auto",
              background:
                "linear-gradient(90deg, #ff0080, #ff8c00, #40e0d0, #8a2be2)",
              color: "#fff",
              border: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              fontWeight: 600,
              backgroundSize: "300% 300%",
              animation: "rainbow 6s ease infinite",
            }}
            onClick={() => setOpenModal(true)}
            type="primary"
            icon={<PlusOutlined />}
            className="add-task-btn"
            size="large"
          >
            Add Your WorkSpace
          </Button>

          <Row align="middle" gutter={16}>
            <Col>
              <Image
                onClick={() => {
                  navigate("profile-page");
                }}
                preview={false}
                className="rounded-[50%] cursor-pointer"
                src={imageUserFromRedux}
                width={55}
                height={55}
              />
            </Col>
            <Col>
              <h2>
                Hello! <span className="username">{username}</span>
              </h2>
            </Col>
          </Row>
        </div>
        <div className="main-content">
          <Card className="today-task-card">
            <h3>Your today’s task</h3>
            <p>almost done!</p>
            <Progress type="circle" percent={0} format={() => "0/2"} />
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
            <p>
              Office Project <span>23 Task</span>
            </p>
          </Card>
          <Card className="task-group-card">
            <p>
              Personal Project <span>2 Task</span>
            </p>
          </Card>
          <Card className="task-group-card">
            <p>
              Team Project <span>3 Task</span>
            </p>
          </Card>
        </div>

        <h3>Your Workspaces</h3>
        <Row gutter={[16, 16]}>
          {workSpaces.length === 0 ? (
            <Col span={24}>
              <Card>No workspace found.</Card>
            </Col>
          ) : (
            workSpaces.map((workspace) => (
              <Col xs={24} sm={12} md={8} key={workspace.id}>
                <Card
                  style={{ background: "#f0f3f6", cursor: "pointer" }}
                  title={workspace.name}
                >
      
                  <Button
                    style={{ margin: "10px 0" }}
                    onClick={() => {
                      handleAddTaskToWorkSpace(workspace.id);
                    }}
                  >
                    Add Tasks To Your WorkSpace
                  </Button>
                  <Button
                    onClick={() => {
                      handleNavigateToTaskDetails(workspace.id);
                    }}
                  >
                    View Tasks
                  </Button>

                  <p>
                    <strong>Created At:</strong>{" "}
                    {dayjs(workspace.createdAt).format("DD/MM/YYYY")}
                  </p>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <Button
                      onClick={() => {
                        setOpenModalUpdate(true);
                        formUpdate.setFieldsValue(workspace);
                      }}
                      type="primary"
                      style={{ padding: "20px", fontWeight: "bold" }}
                    >
                      Edit
                    </Button>
                    <Popconfirm
                      title="Are you sure to delete this workspace?"
                      onConfirm={() => {
                        handleDeleteWorkSpace(workspace.id);
                      }}
                    >
                      <Button
                        loading={loading}
                        type="primary"
                        danger
                        style={{
                          padding: "20px",
                          fontWeight: "bold",
                          borderRadius: "20px",
                        }}
                      >
                        Delete
                      </Button>
                    </Popconfirm>
                  </div>
                </Card>
              </Col>
            ))
          )}
        </Row>
        {/* Add workSpace */}
        <Modal
          footer={[
            <Button onClick={handleCloseModal}>Cancel</Button>,
            <Button
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
            <Button onClick={handleCloseModalUpdate}>Cancel</Button>,
            <Button
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
              onClick={() => {
                setOpenAddTaskModal(false);
                formAddTaskToWorkSpace.resetFields();
              }}
            >
              Cancel
            </Button>,
            <Button
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
      </div>
    </div>
  );
};

export default HomePage;
