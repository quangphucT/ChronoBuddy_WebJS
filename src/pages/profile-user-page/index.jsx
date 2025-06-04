import "./index.scss";
import {
  Row,
  Col,
  Card,
  Avatar,
  Progress,
  Button,
  Statistic,
  Modal,
  Form,
  Input,
} from "antd";
import { EditOutlined, LogoutOutlined } from "@ant-design/icons";
import { Bar } from "@ant-design/charts";
import { useDispatch } from "react-redux";
import { removeInformation } from "../../redux/feature/userSlice";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useForm } from "antd/es/form/Form";
import { toast } from "react-toastify";
import api from "../../config/api";
const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = useForm();
  const username = useSelector((store) => store?.user?.username);
  const user_id = useSelector((store) => store?.user?.id);
  const imageUrl = useSelector((store) => store?.user?.imageUrl);
  console.log("ID:", user_id)

   const dataUserOnRedux = useSelector((store) => store?.user)
  // Dữ liệu giả cho biểu đồ cột Weekly Performance
  const barData = [
    { day: "Mon", tasks: 5 },
    { day: "Tue", tasks: 8 },
    { day: "Wed", tasks: 3 },
    { day: "Thu", tasks: 6 },
    { day: "Fri", tasks: 4 },
    { day: "Sat", tasks: 2 },
    { day: "Sun", tasks: 1 },
  ];

  const barConfig = {
    data: barData,
    xField: "tasks",
    yField: "day",
    color: "#ff9800", // Cam đậm
    label: {
      position: "middle",
      style: { fill: "#fff" },
    },
  };
  const handleLogout = () => {
    dispatch(removeInformation());
    navigate("/login-page");
    localStorage.setItem("token", "");
  };
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
         
      await api.put(`user/${user_id}`, values)
      toast.success("Updated successfully!");
      form.resetFields();
      setOpenModal(false);
    } catch (error) {
      toast.error(error.response.data);
    }
    setLoading(false);
  };
  return (
    <div className="profile-page">
      <div className="profile-content">
       <Row gutter={[24, 24]} justify="center">
  {/* LEFT: Avatar */}
  <Col xs={24} md={6}>
    <Card className="avatar-card">
      <Avatar size={128} src={imageUrl} />
      <h3>{username}</h3>
    </Card>
  </Col>

  {/* RIGHT: Info Cards */}
  <Col xs={24} md={18}>
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12}>
        <Card className="progress-card">
          <Statistic title="Completed Tasks" value={75} suffix="%" />
          <Progress
            type="circle"
            percent={75}
            format={(percent) => `${percent}%`}
            strokeColor={{
              '0%': '#ff6a00',
              '100%': '#ee0979',
            }}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12}>
        <Card className="actions-card">
          <Button
            onClick={() => {
              setOpenModal(true);
              form.setFieldsValue(dataUserOnRedux);
            }}
            icon={<EditOutlined />}
            className="edit-btn"
            block
          >
            Edit Profile
          </Button>
          <Button
            onClick={handleLogout}
            icon={<LogoutOutlined />}
            className="logout-btn mt-2"
            block
          >
            Logout
          </Button>
        </Card>
      </Col>

      <Col span={24}>
        <Card className="chart-card">
          <h3>Weekly Performance</h3>
          <Bar {...barConfig} />
        </Card>
      </Col>
    </Row>
  </Col>
</Row>


        <Modal
          open={openModal}
          onCancel={() => {
            setOpenModal(false);
            form.resetFields();
          }}
          footer={[
            <Button
              onClick={() => {
                setOpenModal(false);
                form.resetFields();
              }}
            >
              Cancel
            </Button>,
            <Button
              loading={loading}
              onClick={() => {
                form.submit();
              }}
            >
              Save
            </Button>,
          ]}
          title="Update your personal information"
        >
          <Form labelCol={{span: 24}} onFinish={handleSubmit} form={form}>
           

           
            <Form.Item
              label="imageUrl"
              name={"imageUrl"}
              rules={[
                {
                  required: true,
                  message: "imageUrl is required!",
                },
              ]}
            >
              <Input placeholder="Enter your imageUrl" />
            </Form.Item>

              <Form.Item
              label="Name"
              name={"name"}
              rules={[
                {
                  required: true,
                  message: "Name is required!",
                },
              ]}
            >
              <Input placeholder="Enter your name" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default ProfilePage;
