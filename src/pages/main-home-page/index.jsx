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
import { deleteWorkSpace } from "../../apis/deleteWorkSpaceApi";
import { editWorkSpace } from "../../apis/editWorkspaceApi";
import { addTaskToWS } from "../../apis/addTaskToWSApi";
import { useNavigate } from "react-router-dom";
import Carousel from "../../components/carousel";
import AboutSection from "../../components/subTitleMainHome";
import { addMemberApi } from "../../apis/addMemberToWorkSpaceApi";

const HomePage = () => {
  const [isOpenModalAddmember, setOpenModalAddMember] = useState(false);
  const [formAddMember] = Form.useForm();
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
  const handleOpenModalAddMemberToWorkSpace = (id) => {
    setWorkSpaceId(id);
    setOpenModalAddMember(true);
  };

  const handleNavigatePageMember = (id) =>{
    navigate(`MembersInWorkSpace/${id}`)
  }
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

        <h3 className="text-2xl font-semibold mb-6 text-gray-800">
          Your Workspaces
        </h3>
        <Row gutter={[16, 16]}>
          {workSpaces.length === 0 ? (
            <Col span={24}>
              <div className="p-6 bg-gray-100 rounded shadow text-center text-gray-500 font-medium">
                No workspace found.
              </div>
            </Col>
          ) : (
            workSpaces.map((workspace) => (
              <Col xs={24} sm={12} md={8} key={workspace.id}>
                <div className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-xl transition-shadow duration-300">
                  <h4 className="text-xl font-bold mb-3 text-indigo-700">
                    {workspace.name}
                  </h4>

                  <div className="flex flex-col space-y-3 mb-4">
                    <button
                      onClick={() => handleAddTaskToWorkSpace(workspace.id)}
                      className="bg-indigo-600 cursor-pointer hover:bg-indigo-700 text-white font-semibold py-2 rounded-md transition-colors duration-200"
                    >
                      Add Tasks To Your WorkSpace
                    </button>
                    <div className="flex space-x-1.5">
                      <button
                        onClick={() =>
                          handleNavigateToTaskDetails(workspace.id)
                        }
                        className="bg-gray-200 cursor-pointer flex-1/2 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-md transition-colors duration-200"
                      >
                        View Tasks
                      </button>

                      <button
                        className="bg-blue-500 cursor-pointer hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-md transition-colors duration-200"
                        onClick={() => handleNavigatePageMember(workspace.id)}
                      >
                        View Members
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-500 mb-4">
                    <strong className="text-gray-700">Created At:</strong>{" "}
                    {dayjs(workspace.createdAt).format("DD/MM/YYYY")}
                  </p>
                  <button
                    className="bg-gradient-to-r cursor-pointer mb-2 from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 
             text-white font-semibold text-sm sm:text-base px-6 sm:px-8 py-2 sm:py-2.5 
             rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out"
                    onClick={() => {
                      handleOpenModalAddMemberToWorkSpace(workspace.id);
                    }}
                  >
                    <span className="inline-flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Add Other Members
                    </span>
                  </button>
                  <div className="flex gap-4">
                    <button
                      className="bg-green-600 cursor-pointer hover:bg-green-700 text-white font-extrabold px-8 py-2 rounded-md transition-colors duration-200"
                      onClick={() => {
                        setOpenModalUpdate(true);
                        formUpdate.setFieldsValue(workspace);
                      }}
                    >
                      Edit
                    </button>

                    <Popconfirm
                      title="Are you sure to delete this workspace?"
                      onConfirm={() => handleDeleteWorkSpace(workspace.id)}
                    >
                      <button
                        disabled={loading}
                        className={`bg-red-600 cursor-pointer hover:bg-red-700 text-white font-bold px-8 py-2 rounded-md transition-colors duration-200 ${
                          loading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        Delete
                      </button>
                    </Popconfirm>
                  </div>
                </div>
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
              onClick={() => {
                setOpenModalAddMember(false);
                formAddMember.resetFields();
              }}
            >
              Cancel
            </Button>,
            <Button
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
    </div>
  );
};

export default HomePage;
