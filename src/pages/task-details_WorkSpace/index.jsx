import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getTaskDetailsInWorkSpace } from "../../apis/getTaskDetailsInWSApi";
import { useParams } from "react-router-dom";
import { Table, Tag, Typography, Space, Button, Popconfirm, Input, Form, Modal, DatePicker } from "antd";
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

  const handleDelete = async(id) => {
    try {
      await deleteTask(id);
      toast.success("Deleted task success!");
      fetchingDataTask();
    } catch (error) {
      toast.error(error.response.data)
    }
  }
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
        if (!status) return <Tag color="default">Chưa cập nhật</Tag>;
        if (status === "chua xong") return <Tag color="red">Chưa xong</Tag>;
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
      title: "Creeated Date",
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
            type="primary"
            size="small"
            onClick={() => {setOpenModalEditTask(true);const recordWithDayjs = {
    ...record,
    dueDate: dayjs(record.dueDate),
  }; form.setFieldsValue(recordWithDayjs)}}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this task?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              icon={<DeleteOutlined />}
              type="primary"
              danger
              size="small"
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  const handleSubmit = async(values) => {
    setLoading(true)
    try {
       const {id, ...valuesFiltered} = values;
       await updateTask(valuesFiltered, id);
       toast.success("Edit task sucess!");
       form.resetFields();
       setOpenModalEditTask(false);
       fetchingDataTask();
    } catch (error) {
      toast.error(error.response.data)
    }
    setLoading(false)
  }
  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>List Tasks In Workspace</Title>
      <Table
        loading={loading}
        columns={columns}
        dataSource={taskDetails}
        rowKey="id"
        bordered
        pagination={{ pageSize: 5 }}
      />
      <Modal open={openModalEditTask} onCancel={() => {setOpenModalEditTask(false); form.resetFields()}} form={form} title="Update Your Task Here!" footer={[
        <Button onClick={() => {setOpenModalEditTask(false); form.resetFields()}}>Cancel</Button>,
        <Button loading={loading} onClick={() => {form.submit()}}>Save</Button>
      ]}>
        <Form labelCol={{span: 24}} form={form} onFinish={handleSubmit}>
          <Form.Item name={"id"} hidden>
            <Input/>
          </Form.Item>
          <Form.Item label="Title" name={"title"} rules={[
            {
              required: true,
              message: "Title is required!"
            }
          ]}>
            <Input placeholder="Enter ttile"/>
          </Form.Item>
          <Form.Item label="Status" name={"status"} rules={[
            {
              required: true,
              message: "Status is required!"
            }
          ]}>
            <Input placeholder="Enter status"/>
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

export default TaskDetailsWorkSpace;
