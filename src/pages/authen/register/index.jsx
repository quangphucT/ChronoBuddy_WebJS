import "./index.scss";
import { Form, Input, Button, Typography } from "antd";

import logoToDoList from "../../../assets/images/8019152.png";
import { useNavigate } from "react-router-dom";
import { useForm } from "antd/es/form/Form";
import api from "../../../config/api";
import { toast } from "react-toastify";
import { useState } from "react";

const { Title, Text } = Typography;

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = useForm();
  const onFinish = async (values) => {
    setLoading(true);
    try {
      await api.post("api/register", values);
      toast.success("Register successfully!");
      navigate("/login-page");
    } catch (error) {
      toast.error(error.response.data.message.error);
    }
    setLoading(false);
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="bee-image">
          <img src={logoToDoList} alt="Bee" />
        </div>

        <Title level={2} className="title">
          Ready to
          <br />
          take breaks?
        </Title>

        <Form
          form={form}
          name="register-form"
          layout="vertical"
          className="register-form"
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please enter your username" }]}
          >
            <Input placeholder="Your Username" className="input" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please enter your password" },
              { min: 8, message: "Password must be at least 8 characters" },
            ]}
          >
            <Input.Password placeholder="Password" className="input" />
          </Form.Item>

          <Text className="signin-text" onClick={() => navigate("/login-page")}>
            Already have an account? <span>Sign In</span>
          </Text>

          <Button
            loading={loading}
            onClick={() => form.submit()}
            type="primary"
            className="submit-btn"
            block
          >
            I’m Ready!
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default RegisterPage;
