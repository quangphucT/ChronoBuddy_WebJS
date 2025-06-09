import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getTaskDetailsInWorkSpace } from "../../apis/getTaskDetailsInWSApi";
import './index.scss'
import { useParams } from "react-router-dom";
import {
  Table,
  Tag,
  Typography,
  Space,
  Button,
  Popconfirm,
  Input,
  Form,
  Modal,
  DatePicker,
} from "antd";
import dayjs from "dayjs";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { deleteTask } from "../../apis/deleteTaskApi";
import { useForm } from "antd/es/form/Form";
import { updateTask } from "../../apis/updateTaskApi";


const { Title } = Typography;

const TaskDetailsWorkSpace = () => {
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [taskDetails, setTaskDetails] = useState([]);
  const [openModalEditTask, setOpenModalEditTask] = useState(false);
  const [form] = useForm();

  const fetchingDataTask = async () => {
    setLoading(true);
    try {
      const response = await getTaskDetailsInWorkSpace(id);
      setTaskDetails(response.data.data);
    } catch (error) {
      toast.error(error?.response?.data || "Lỗi lấy dữ liệu");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchingDataTask();
  }, [id]);

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      toast.success("Deleted task success!");
      fetchingDataTask();
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        if (status !== "PENDING") return <Tag color="default">Completed </Tag>;
        if (status === "PENDING") return <Tag color="red">PENDING</Tag>;
        return <Tag color="green">{status}</Tag>;
      },
    },
    {
      title: "Deadline",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (dueDate) => dayjs(dueDate).format("DD/MM/YYYY HH:mm A"),
    },
    {
      title: "Created Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => dayjs(createdAt).format("DD/MM/YYYY HH:mm A"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            style={rainbowButtonStyle}
            size="small"
            onClick={() => {
              setOpenModalEditTask(true);
              const recordWithDayjs = {
                ...record,
                dueDate: dayjs(record.dueDate),
              };
              form.setFieldsValue(recordWithDayjs);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this task?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger size="small">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const { id, ...valuesFiltered } = values;
      await updateTask(valuesFiltered, id);
      toast.success("Edit task success!");
      form.resetFields();
      setOpenModalEditTask(false);
      fetchingDataTask();
    } catch (error) {
      toast.error(error.response.data);
    }
    setLoading(false);
  };

  return (
    <div

      className="mt-[51px]"
      style={{ padding: 24, background: "#fff", borderRadius: 12 }}
    >
      <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
        🗂️ List Tasks In Workspace
      </Title>
      <Table
        loading={loading}
        columns={columns}
        dataSource={taskDetails}
        rowKey="id"
        bordered
        pagination={{ pageSize: 5 }}
      />

      <Modal
        open={openModalEditTask}
        onCancel={() => {
          setOpenModalEditTask(false);
          form.resetFields();
        }}
        title="Update Your Task Here!"
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setOpenModalEditTask(false);
              form.resetFields();
            }}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            loading={loading}
            style={rainbowButtonStyle}
            onClick={() => {
              form.submit();
            }}
          >
            Save
          </Button>,
        ]}
      >
        <Form labelCol={{ span: 24 }} form={form} onFinish={handleSubmit}>
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Title is required!" }]}
          >
            <Input placeholder="Enter title" />
          </Form.Item>
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Status is required!" }]}
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
  );
};

const rainbowButtonStyle = {
  background:
    "linear-gradient(90deg, #ff0080, #ff8c00, #40e0d0, #8a2be2)",
  color: "#fff",
  border: "none",
  fontWeight: 600,
  backgroundSize: "300% 300%",
  animation: "rainbow 6s ease infinite",
};

export default TaskDetailsWorkSpace;