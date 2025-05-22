import './index.scss';
import { Form, Input, Button, Typography } from 'antd';

import logoBee from '../../../assets/images/1740063267602.gif';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'antd/es/form/Form';
import api from '../../../config/api';
import { toast } from 'react-toastify';
import { useState } from 'react';

const { Title, Text } = Typography;

const RegisterPage = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();
  const [form] = useForm();
  const onFinish = async (values) => {
    setLoading(true)
    try {
      await api.post('register', values)
      toast.success("Register successfully!")
      navigate("/login-page")
    } catch (error) {
      toast.error(error.response.data.message)
    }
    setLoading(false)
  };


  return (
    <div className="register-page">
      <div className="register-container">
        <div className="bee-image">
          <img src={logoBee} alt="Bee" />
        </div>

        <Title level={2} className="title">Ready to<br />take breaks?</Title>

        <Form form={form}
          name="register-form"
          layout="vertical"
          className="register-form"
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please enter your username' }]}
          >
            <Input placeholder="Your Username" className="input" />
          </Form.Item>



          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password placeholder="Password" className="input" />
          </Form.Item>



          <Text className="signin-text" onClick={() => navigate("/login-page")}>
            Already have an account? <span>Sign In</span>
          </Text>

          <Button loading={loading} onClick={() => form.submit()} type="primary" className="submit-btn" block>
            I’m Ready!
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default RegisterPage;
