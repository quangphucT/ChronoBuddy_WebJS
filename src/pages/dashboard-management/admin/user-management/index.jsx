import { Button, Input, Popconfirm, Table } from "antd";
import "./index.scss";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { getAllUser } from "../../../../apis/getAllUserApi";
import { deleteUser } from "../../../../apis/deleteUserApi";
import { findUserById } from "../../../../apis/findUserByIdApi";
const { Search } = Input;
const UserManagement = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [searchId, setSearchId] = useState("");
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Premium Expiry",
      dataIndex: "premiumExpiry",
      key: "premiumExpiry",
      render: (text) => (text ? new Date(text).toLocaleString() : "None"),
    },
    {
      title: "Deleted",
      dataIndex: "deleted",
      key: "deleted",
      render: (deleted) => (deleted ? "Yes" : "No"),
    },
    {
      title: "Image URL",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (url) =>
        url ? (
          <img src={url} alt="avatar" style={{ width: 40, height: 40 }} />
        ) : (
          "No Image"
        ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      render: (id) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Button>Edit</Button>
          <Popconfirm
            loading={loading}
            onConfirm={() => {
              handleDeleteUser(id);
            }}
            title={"Are you sure to delete?"}
          >
            {" "}
            <Button>Delete</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const handleDeleteUser = async (id) => {
    setLoading(true);
    try {
      await deleteUser(id);
      toast.success("User deleted successfully");
      fetchAllUser();
    } catch (error) {
      toast.error(error.response.data.message);
    }
    setLoading(false);
  };

  const fetchAllUser = async () => {
    setLoading(true);
    try {
      const users = await getAllUser();
      setData(users);
    } catch (error) {
      toast.error(error.response.data.message);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchAllUser();
  }, []);
  const handleSearchUserById = async (value) => {
    if (!value) {
      return;
    }
    setLoading(true);
    try {
      const response = await findUserById(value);
      setData([response.data.data]);
    } catch (err) {
      toast.error(err.response?.data?.message || "User not found");
      setData([]); // Clear nếu không tìm thấy
    }
    setLoading(false);
  };
  return (
    <div>
      <div style={{ display: "flex", gap: "20px" }}>
        <Search
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          placeholder="Enter user ID"
          enterButton="Search"
          style={{ maxWidth: 300, marginBottom: 16 }}
          onSearch={handleSearchUserById}
        />
        <Button
          onClick={() => {
            setSearchId("");
            fetchAllUser();
          }}
        >
          Full List User
        </Button>
      </div>
      <Table
        style={{ fontWeight: "500" }}
        title={() => "User List Management"}
        loading={loading}
        columns={columns}
        dataSource={data}
      />
    </div>
  );
};

export default UserManagement;
