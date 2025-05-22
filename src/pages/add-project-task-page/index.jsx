
import { Card, Form, Input, Select, DatePicker, Button, Upload, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import './index.scss';

const { TextArea } = Input;
const { Title } = Typography;

const AddProjectTask = () => {
    const [form] = Form.useForm();
   
    const handleFinish = (values) => {
        console.log('Form values:', values);
    };

    return (
        <div className="add-project-container">
            <Card className="add-project-card">
                <div className="header-add-project-task">

                    <Title level={3} className="title">Add Project</Title>

                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFinish}
                >
                    <Form.Item
                        name="taskGroup"
                        label="Task Group"
                        rules={[{ required: true, message: 'Please select a task group' }]}
                    >
                        <Select placeholder="Select task group">
                            <Select.Option value="Work">Work</Select.Option>
                            <Select.Option value="Personal">Personal</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="projectName"
                        label="Project Name"
                        rules={[{ required: true, message: 'Please input the project name' }]}
                    >
                        <Input placeholder="Enter project name" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[{ required: true, message: 'Please enter a description' }]}
                    >
                        <TextArea rows={4} placeholder="Enter project description" />
                    </Form.Item>

                    <Form.Item
                        name="startDate"
                        label="Start Date"
                        rules={[{ required: true, message: 'Please select the start date' }]}
                    >
                        <DatePicker format="DD MMMM, YYYY" style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name="endDate"
                        label="End Date"
                        rules={[{ required: true, message: 'Please select the end date' }]}
                    >
                        <DatePicker format="DD MMMM, YYYY" style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name="logo"
                        label="Project Logo"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                    >
                        <Upload name="logo" listType="picture" maxCount={1}>
                            <Button icon={<UploadOutlined />}>Change Logo</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block className="submit-btn">
                            Add Project
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default AddProjectTask;
