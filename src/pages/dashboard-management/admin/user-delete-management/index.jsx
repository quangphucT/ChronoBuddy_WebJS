import { Button, Popconfirm, Table } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getUsersDelete } from "../../../../apis/getDeleteUsersApi";
import { restoreAccount } from "../../../../apis/restoreAccountApi";

const UserDeleteManagement = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
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
         <Popconfirm title="Are you sure to restore account!" onConfirm={() => handleRestoreAccount(id)}> <Button>Restore account</Button></Popconfirm>
        </div>
      ),
    },
  ];
  const handleRestoreAccount = async(id) =>{
      try {
         await restoreAccount(id);
         toast.success("Account restored successfully!");
         fetchUserDeleteData();
      } catch (error) {
        toast.error(error.response.data.message || 'Error while handle!')
      }
  }
  const fetchUserDeleteData = async () => {
    setLoading(true);
    try {
      const response = await getUsersDelete();
      setData(response.data.data);
    } catch (error) {
      toast.error(error.response.data.message || "Error while fetching data!");
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchUserDeleteData();
  }, []);
  return (
    <Table
      loading={loading}
      style={{ fontWeight: "500" }}
      title={() => "User Delete List Management"}
      columns={columns}
      dataSource={data}
    />
  );
};

export default UserDeleteManagement;
