import { Modal, Input, Button, Form } from "antd";

const AddWorkspaceModal = ({ open, onCancel, onCreate, loading }) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields().then((values) => {
      onCreate(values);
      form.resetFields();
    });
  };

  return (
    <Modal
      title={
        <span className="text-2xl font-bold text-[#F45C25]">Tạo Workspace mới</span>
      }
      open={open}
      onCancel={onCancel}
      footer={null}
      centered
      bodyStyle={{
        padding: 32,
        borderRadius: 16,
        background: "#ffffff",
      }}
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label={
            <span className="text-[#333] font-medium text-base">
              Tên Workspace
            </span>
          }
          name="name"
          rules={[
            { required: true, message: "Vui lòng nhập tên workspace!" },
          ]}
        >
          <Input
            placeholder="Nhập tên workspace..."
            className="rounded-xl py-2"
            style={{
              borderRadius: 12,
              borderColor: "#F45C25",
              backgroundColor: "#fff",
            }}
          />
        </Form.Item>

        <Form.Item className="text-right mt-6">
          <Button
            onClick={onCancel}
            className="rounded-xl border-[#F45C25] text-[#F45C25] mr-2"
          >
            Huỷ
          </Button>
          <Button
            type="primary"
            className="bg-[#F45C25] hover:bg-[#d94c18] text-white font-semibold rounded-xl"
            onClick={handleOk}
            loading={loading}
          >
            Tạo Workspace
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddWorkspaceModal;
