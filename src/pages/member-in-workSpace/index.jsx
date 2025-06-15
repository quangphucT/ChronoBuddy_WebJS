import { useEffect, useState } from 'react';
import { Table, Card, Tag, Button, Popconfirm } from 'antd';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';

import './index.scss';
import { getAllMemberOnWorkSpaceApi } from '../../apis/getALLMemberOnWorkSpaceApi';
import { toast } from 'react-toastify';
import { deleteMemberFromWorkSpaceApi } from '../../apis/deleteMemberFromWorkSpaceApi';

const MembersInWorkSpace = () => {
  const { id: workSpaceId } = useParams();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await getAllMemberOnWorkSpaceApi(workSpaceId);
      setMembers(res.data.data);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [workSpaceId]);

  const columns = [
    {
      title: '🆔 ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '👤 User ID',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: '🛡️ Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'MEMBER' ? 'cyan' : 'volcano'}>
          {role}
        </Tag>
      ),
    },
    {
      title: '📅 Joined At',
      dataIndex: 'joinedAt',
      key: 'joinedAt',
      render: (joinedAt) => dayjs(joinedAt).format('DD/MM/YYYY'),
    },
    {
      title: '🆔 Action',
      dataIndex: 'userId',
      key: 'userId',
      render: (userId, record) => {
        return (

    
            <div className='space-x-2'>
               
               {record.role !== "OWNER" && <Popconfirm loading={loading}  onConfirm={() => {handleKickMember(userId)}} title="Are you sure to kick this member out of this workSpace??">
                   
                    <Button>Kick Member</Button>
                 </Popconfirm>}
                 
            </div>
        )
      }
    },
  ];
 const handleKickMember = async(id) =>{
    setLoading(true)
    try {
        await deleteMemberFromWorkSpaceApi(workSpaceId,id)
        toast.success("Deleted success!!")
       fetchMembers();
    } catch (error) {
        toast.error(error?.response?.data?.message?.error)
    }
    setLoading(false)
 }
  return (
    <div className="workspace-container">
      <Card
        title="🚀 Members In Workspace"
        className="workspace-card glass"
      >
        <Table
          loading={loading}
          dataSource={members}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 6 }}
        />
      </Card>
    </div>
  );
};

export default MembersInWorkSpace;
