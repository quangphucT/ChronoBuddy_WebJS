import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getTaskDetailsInWorkSpace } from "../../apis/getTaskDetailsInWSApi";
import { useParams } from "react-router-dom";
import { Table, Tag, Typography, Space } from "antd";
import dayjs from "dayjs";


const { Title } = Typography;

const TaskDetailsWorkSpace = () => {
    const [loading, setLoading] = useState(false)
  const { id } = useParams();
  const [taskDetails, setTaskDetails] = useState([]);

  const fetchingDataTask = async () => {
    setLoading(true)
    try {
      const response = await getTaskDetailsInWorkSpace(id);
      setTaskDetails(response.data.data);
    } catch (error) {
      toast.error(error?.response?.data || "Lỗi lấy dữ liệu");
    }
    setLoading(false)
  };

  useEffect(() => {
    fetchingDataTask();
  }, [id]);

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
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>List Tasks In Workspace</Title>
      <Table  loading={loading}
        columns={columns}
        dataSource={taskDetails}
        rowKey="id"
        bordered
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default TaskDetailsWorkSpace;
