import { useNavigate } from 'react-router-dom';
import './index.scss';
import { Form, Input, Button } from 'antd';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  return (
    <div className="forgot-password-page">
      
      <div className="forgot-password-container">
        <div className="forgot-password-content">
          <h1 className="main-title">Reset your password</h1>
          <p className="description">
            Enter your email address and we’ll send you instructions to reset your password.
          </p>
          <Form className="forgot-password-form" name="forgotPassword" layout="vertical">
            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Please input your email!' }]}
            >
              <Input
                placeholder="Email address"
                className="email-input"
                size="large"
              />
            </Form.Item>
            <Form.Item>
              <Button  onClick={() => navigate("/reset-password")}
                type="primary"
                htmlType="submit"
                className="continue-button"
                size="large"
              >
                Continue
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;