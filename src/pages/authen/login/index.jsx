import './index.scss';
import { Form, Input, Button, Typography } from 'antd';

import logoBee from '../../../assets/images/1740063267602.gif';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'antd/es/form/Form';
import { toast } from 'react-toastify';
import api from '../../../config/api';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { saveInformation } from '../../../redux/feature/userSlice';

const { Title, Text } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const [form] = useForm();
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch();
  const onFinish = async (values) => {

    setLoading(true)
    try {
      const response = await api.post('api/login', values)
      const dataUser = response.data.data;
      const { token, role } = dataUser
      localStorage.setItem("token", token)
      if (role === 'FREE') {
        navigate("/home")
      } else if (role === 'ADMIN') {
        navigate("/dashboard")
      }
      dispatch(saveInformation(dataUser))
      console.log("dataUser:", dataUser)
      toast.success("Login successfully")

    } catch (error) {
      toast.error(error.response.data)
    }
    setLoading(false)
  };

  return (
    <div className="login-page">
      <div className="login-container">

        <div className="bee-image">
          <img src={logoBee} alt="Bee" />
        </div>

        <Title level={2} className="title">Welcome back!</Title>

        <Form form={form}
          name="login-form"
          layout="vertical"
          className="login-form"
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input placeholder="username" className="input" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password placeholder="Password" className="input" />
          </Form.Item>

          <div className="form-extra">
            <Text className="forgot" onClick={() => navigate("/forgot-password")}>
              I forgot my account
            </Text>
          </div>

          <Button loading={loading} onClick={() => form.submit()} type="primary" block className="submit-btn">
            Do it!
          </Button>

          <Text className="signup-text" onClick={() => navigate("/register-page")}>
            Don’t have any account? <span>Make one</span>
          </Text>


        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
