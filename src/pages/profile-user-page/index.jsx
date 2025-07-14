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
  Badge,
  Divider,
  Typography,
  Space,
  Tooltip,
  Tag,
  Upload,
  Timeline,
  Empty
} from "antd";

import { 
  EditOutlined, 
  LogoutOutlined,
  UserOutlined,
 
  TrophyOutlined,
 
  UploadOutlined,
  CameraOutlined,
 
  LoadingOutlined
} from "@ant-design/icons";

import { useDispatch } from "react-redux";
import { removeInformation } from "../../redux/feature/userSlice";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { useForm } from "antd/es/form/Form";
import { toast } from "react-toastify";
import api from "../../config/api";
import { useState } from "react";

const { Title, Text } = Typography;

const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [openAvatarModal, setOpenAvatarModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [form] = useForm();
  
  const username = useSelector((store) => store?.user?.username);
  const user_id = useSelector((store) => store?.user?.id);
  const imageUrl = useSelector((store) => store?.user?.imageUrl);
  const name = useSelector((store) => store?.user?.name);
  const dataUserOnRedux = useSelector((store) => store?.user);
  

  



  const handleLogout = () => {
  
        dispatch(removeInformation());
        navigate("/login-page");
        localStorage.removeItem("token");
        toast.success("Logged out successfully!");
    
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await api.put(`user/${user_id}`, values);
      toast.success("Profile updated successfully!");
      form.resetFields();
      setOpenModal(false);
    } catch (error) {
      toast.error(error.response?.data || "Update failed!");
    }
    setLoading(false);
  };

  const handleAvatarUpload = (info) => {
    if (info.file.status === 'uploading') {
      setUploadLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      setUploadLoading(false);
      // Handle successful upload
      toast.success("Avatar updated successfully!");
    }
    if (info.file.status === 'error') {
      setUploadLoading(false);
      toast.error("Avatar upload failed!");
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-content">
        {/* Header Section */}
        <div className="profile-header">
          <div className="profile-header-bg"></div>
          <div className="profile-header-content">
            <Row align="middle" justify="space-between">
              <Col>
                <Space size="large" align="center">
                  {/* <div className="avatar-container">
                    <Badge 
                      count={
                        <Button 
                          type="primary" 
                          shape="circle" 
                          size="small"
                          icon={<CameraOutlined />}
                          onClick={() => setOpenAvatarModal(true)}
                          className="avatar-edit-btn"
                        />
                      }
                    >
                      <Avatar 
                        size={120} 
                        src={imageUrl} 
                        icon={<UserOutlined />}
                        className="profile-avatar"
                      />
                    </Badge>
                  </div> */}
                  <div className="profile-info">
                    <Title level={2} className="profile-name">
                      {name || username}
                    </Title>
                    <Text className="profile-username">@{username}</Text>
                    <div className="profile-badges">
                      <Tag color="blue" icon={<UserOutlined />}>ID: {user_id}</Tag>
                      <Tag color="green" icon={<TrophyOutlined />}>Pro User</Tag>
                    </div>
                  </div>
                </Space>
              </Col>
              <Col>
                <Space>
                  <Tooltip title="Edit Profile">
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={() => {
                        setOpenModal(true);
                        form.setFieldsValue(dataUserOnRedux);
                      }}
                      className="edit-profile-btn"
                    >
                      Edit Profile
                    </Button>
                  </Tooltip>
                 
                  <Tooltip title="Logout">
                    <Button
                      danger
                      icon={<LogoutOutlined />}
                      onClick={handleLogout}
                      className="logout-btn"
                    >
                      Logout
                    </Button>
                  </Tooltip>
                </Space>
              </Col>
            </Row>
          </div>
        </div>

    
       

        {/* Edit Profile Modal */}
        <Modal
          title={
            <Space>
              <EditOutlined />
              Update Profile Information
            </Space>
          }
          open={openModal}
          onCancel={() => {
            setOpenModal(false);
            form.resetFields();
          }}
          footer={[
            <Button
              key="cancel"
              onClick={() => {
                setOpenModal(false);
                form.resetFields();
              }}
            >
              Cancel
            </Button>,
            <Button
              key="save"
              type="primary"
              loading={loading}
              onClick={() => form.submit()}
            >
              Save Changes
            </Button>,
          ]}
          className="profile-modal"
        >
          <Form 
            layout="vertical" 
            onFinish={handleSubmit} 
            form={form}
            className="profile-form"
          >
            <Form.Item
              label="Profile Image URL"
              name="imageUrl"
              rules={[
                {
                  required: true,
                  message: "Profile image URL is required!",
                },
                {
                  type: "url",
                  message: "Please enter a valid URL!",
                }
              ]}
            >
              <Input 
                placeholder="Enter your profile image URL" 
                prefix={<UserOutlined />}
              />
            </Form.Item>

            <Form.Item
              label="Full Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Name is required!",
                },
                {
                  min: 2,
                  message: "Name must be at least 2 characters!",
                }
              ]}
            >
              <Input 
                placeholder="Enter your full name" 
                prefix={<UserOutlined />}
              />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
            >
              <Input 
                placeholder="Enter your email" 
                type="email"
                disabled
              />
            </Form.Item>
          </Form>
        </Modal>

        {/* Avatar Upload Modal */}
        <Modal
          title={
            <Space>
              <CameraOutlined />
              Update Profile Picture
            </Space>
          }
          open={openAvatarModal}
          onCancel={() => setOpenAvatarModal(false)}
          footer={null}
          className="avatar-modal"
        >
          <div className="avatar-upload-container">
            <div className="current-avatar">
              <Avatar 
                size={120} 
                src={imageUrl} 
                icon={<UserOutlined />}
              />
              <Text type="secondary">Current Avatar</Text>
            </div>
            <Divider />
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              beforeUpload={() => false}
              onChange={handleAvatarUpload}
              disabled={uploadLoading}
            >
              <div>
                {uploadLoading ? <LoadingOutlined /> : <UploadOutlined />}
                <div style={{ marginTop: 8 }}>
                  {uploadLoading ? 'Uploading...' : 'Upload New'}
                </div>
              </div>
            </Upload>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ProfilePage;
