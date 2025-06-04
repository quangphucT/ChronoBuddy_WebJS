import { Button, Form, Input, message, Modal, Popconfirm, Table } from "antd"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { getAllPackagesPro } from "../../apis/getAllPackageProApi"
import { addNewPackagePro } from "../../apis/addNewPackageProApi"
import { useForm } from "antd/es/form/Form"
import { deletePackagePro } from "../../apis/deletePackageProApi"
import { updatePackagePro } from "../../apis/updatePackagepi"


const ManagexAdvancedPackage = () => {
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [form] = useForm();
    const handleDeletePackage = async(id) => {
        setLoading(true)
        try {
            await deletePackagePro(id)
            toast.success("Delete success!")
            fetchingData();
        } catch (error) {
            toast.error(error.response.data.message || "Error while deleting")
        }
        setLoading(false)
    }
    const columns = [
        {
            title: "Id",
            dataIndex: 'id',
            key: "id"
        },
         {
            title: "Name",
            dataIndex: 'name',
            key: "name"
        },

         {
            title: "Description",
            dataIndex: 'description',
            key: "description"
        },
         {
            title: "Price",
            dataIndex: 'price',
            key: "price"
        },
         {
            title: "durationDays",
            dataIndex: 'durationDays',
            key: "durationDays"
        },
          {
            title: "Action",
            dataIndex: 'id',
            key: "id",
            render: (id, record) =>{
                return (
                    <div className="flex space-x-3.5">
                        <Button onClick={() => {setOpen(true); form.setFieldsValue(record)}}>Edit</Button>
                      <Popconfirm loading={loading} title="Are you sure to delete this package?" onConfirm={() => {handleDeletePackage(id)}}>
                          <Button>Delete</Button>
                      </Popconfirm>
                    </div>
                )
            }
        },
       
    ]
    const [data, setData] = useState([])
  const fetchingData = async() =>{
    setLoading(true)
    try {
        const response = await getAllPackagesPro();
        setData(response.data.data)
    } catch (error) {
        toast.error(error.response.data.message || "Error while fetching")
    }
    setLoading(false)
  }
  useEffect(() => {
    fetchingData();
  },[])
  const handleSubmit = async(values) =>{
    
    setLoading(true)
    try {
        if(values.id != null){
 await updatePackagePro(values.id,values);
        toast.success("Added success!")
        fetchingData();
         setOpen(false)
         form.resetFields()
        }else{
 await addNewPackagePro(values);
        toast.success("Added success!")
        fetchingData();
         setOpen(false)
         form.resetFields()
        }
        
    } catch (error) {
        toast.error(error.response.data.message || "error while adding")
    }
    setLoading(false)
  }
  return (
    <div>
        <Button  onClick={() => {setOpen(true)}}>Add New Package</Button>
      <Table loading={loading} columns={columns} dataSource={data}/>
      <Modal onCancel={() => {setOpen(false); form.resetFields()}} open={open} title="Information package pro" footer={[
        <Button loading={loading} onClick={() => {form.submit()}}>Save</Button>,
        <Button onClick={() => {setOpen(false); form.resetFields()}}>Cancel</Button>
      ]}>
        <Form labelCol={{span: 24}} form={form} onFinish={handleSubmit}>
            <Form.Item name={"id"} hidden>
                <Input/>
            </Form.Item>
            <Form.Item label="Name" name={"name"} rules={[{
                required: "true",
                message: "Name is required!"
            }]}>
                <Input placeholder="Enter name"/>
            </Form.Item>

             <Form.Item label="Description" name={"description"} rules={[{
                required: "true",
                message: "Description is required!"
            }]}>
                <Input placeholder="Enter description"/>
            </Form.Item>

             <Form.Item label="Price" name={"price"} rules={[{
                required: "true",
                message: "Price is required!"
            }]}>
                <Input placeholder="Enter price"/>
            </Form.Item>

             <Form.Item label="DurationDays" name={"durationDays"} rules={[{
                required: "true",
                message: "durationDays is required!"
            }]}>
                <Input placeholder="Enter durationDays"/>
            </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ManagexAdvancedPackage
