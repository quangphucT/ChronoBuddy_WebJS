import { Button, DatePicker, Form, Input, Modal, Select } from "antd";
import dayjs from "dayjs";
import { useEffect, useState, useRef } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getWorkSpaceUser } from "../../../apis/getWorkSpaceUser";
import { getAllTaskByUserId } from "../../../apis/task/getAllTaskOfUserApi";
import { addTaskToWS } from "../../../apis/task/addTaskToWSApi";
import { deleteTask } from "../../../apis/task/deleteTaskApi";


const { Option } = Select;

const NhiemVu = () => {
  const user_id = useSelector((store) => store?.user?.id);

  const [tab, setTab] = useState("today");
  const [openModalAddTask, setOpenModalAddTask] = useState(false);
  const [dataWorkSpace, setDataWorkSpace] = useState([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [tasksOfUser, setTasksOfUser] = useState([]);
  
  // States để control form fields
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [selectedDueDate, setSelectedDueDate] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState("MEDIUM");
  const [selectedStatus, setSelectedStatus] = useState("PENDING");
  const handleOpenModalAddTask = () => {
    setOpenModalAddTask(true);
    // Reset form và states khi mở modal
    form.resetFields();
    setSelectedWorkspace(null);
    setSelectedDueDate(null);
    setSelectedPriority("MEDIUM");
    setSelectedStatus("PENDING");
  };
  
  const getAllTaskOfUser = async() => {
    try {
      const response = await getAllTaskByUserId(user_id);
      setTasksOfUser(response.data.data);

    } catch (error) {
      toast.error(error?.response?.data?.error || "Error while handling logic");
      console.error("Error fetching tasks:", error);
    }
  }
 
  const getAllWorkSpaceByUserId = async () => {
    try {
      const response = await getWorkSpaceUser(user_id);
      setDataWorkSpace(response.data.data);
    } catch (error) {
      toast.error(error?.response?.data?.error || "Error while handling logic");
    }
  };
  const handleFinish = async (values) => {
    console.log("=== FORM SUBMIT DEBUG ===");
    console.log("Raw form values:", values);
    console.log("Type of workSpaceId:", typeof values.workSpaceId);
    console.log("Type of dueDate:", typeof values.dueDate);
    console.log("DueDate value:", values.dueDate);
    console.log("WorkSpaceId value:", values.workSpaceId);
    
    setLoading(true);
    try {
      // Tách workSpaceId ra khỏi values, giữ lại phần còn lại là payload
      const { workSpaceId, ...rest } = values;
      
      const payload = {
        ...rest,
        dueDate: dayjs(values.dueDate).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
      };
      console.log("Final payload:", payload);
      console.log("WorkSpace ID to send:", workSpaceId);
      
      // Gọi API để thêm task
      await addTaskToWS(payload, workSpaceId);
      
      toast.success("Thêm nhiệm vụ thành công!");
      setOpenModalAddTask(false);
      form.resetFields();
      setSelectedWorkspace(null);
      setSelectedDueDate(null);
      setSelectedPriority("MEDIUM");
      setSelectedStatus("PENDING");
      
      // Reload dữ liệu tasks sau khi thêm thành công
      getAllTaskOfUser();
    } catch (error) {
      console.error("Error in handleFinish:", error);
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi thêm nhiệm vụ!");
    }
    setLoading(false);
  };

  // Function để xóa task
  const handleDeleteTask = async (taskId) => {
    console.log("=== DELETE TASK DEBUG ===");
    console.log("TaskId to delete:", taskId);
    console.log("Type of taskId:", typeof taskId);
    
    try {
      // Hiển thị loading ngay lập tức bằng cách cập nhật UI
      setTasksOfUser(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId 
            ? { ...task, isDeleting: true } 
            : task
        )
      );

      const response = await deleteTask(taskId);
      console.log("Delete response:", response);
      
      // Xóa task khỏi state ngay lập tức thay vì fetch lại
      setTasksOfUser(prevTasks => 
        prevTasks.filter(task => task.id !== taskId)
      );
      
      toast.success("Xóa nhiệm vụ thành công!");
    } catch (error) {
      console.error("Error deleting task:", error);
      console.error("Error response:", error?.response);
      console.error("Error data:", error?.response?.data);
      
      // Nếu có lỗi, bỏ trạng thái deleting
      setTasksOfUser(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId 
            ? { ...task, isDeleting: false } 
            : task
        )
      );
      
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi xóa nhiệm vụ!");
    }
  };

  useEffect(() => {
    if (user_id) {
      getAllWorkSpaceByUserId();
      getAllTaskOfUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user_id]);
  return (
    <div>
      <div className="p-6">
        {/* Tabs + Button */}
        <div className="flex justify-between items-center mb-6">
          <div className="space-x-3">
            <button
              className={`px-4 py-2 rounded-full font-semibold ${
                tab === "today"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-black"
              }`}
              onClick={() => setTab("today")}
            >
              Nhiệm vụ hôm nay
            </button>
            <button
              className={`px-4 py-2 rounded-full font-semibold ${
                tab === "all"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-black"
              }`}
              onClick={() => setTab("all")}
            >
              Tất cả nhiệm vụ
            </button>
          </div>
          <Button
            onClick={handleOpenModalAddTask}
            type="primary"
            size="large"
            icon={<AiOutlinePlus />}
            style={{
              background: "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)",
              border: "none",
              borderRadius: "12px",
              fontWeight: "600",
              fontSize: "14px",
              height: "44px",
              paddingLeft: "20px",
              paddingRight: "20px",
              boxShadow: "0 4px 12px rgba(255, 107, 53, 0.3)",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 16px rgba(255, 107, 53, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 12px rgba(255, 107, 53, 0.3)";
            }}
          >
            Thêm Nhiệm Vụ
          </Button>
        </div>

        {tab === "today" ? (
          // Giao diện timeline cho nhiệm vụ hôm nay
          <div className="relative border-l-4 border-red-500 ml-6">
            {tasksOfUser
              .filter((task) => {
                // Lọc task có due date là hôm nay
                const today = dayjs().format("YYYY-MM-DD");
                const taskDate = dayjs(task.dueDate).format("YYYY-MM-DD");
                return taskDate === today;
              })
              .map((task) => (
                <div key={task.id} className="flex items-start mb-8 relative">
                  {/* Time */}
                  <div className="absolute -left-24 w-20 text-right pr-4 font-medium text-black">
                    {dayjs(task.dueDate).format("HH:mm")}
                  </div>

                  {/* Dot */}
                  <div className="absolute -left-1.5 w-3 h-3 bg-red-500 rounded-full top-1.5 z-10"></div>

                  {/* Task card */}
                  <div className={`ml-4 rounded-xl p-4 shadow-sm w-full ${
                    task.status === "PENDING" ? "bg-red-100" :
                    task.status === "IN_PROGRESS" ? "bg-yellow-100" :
                    task.status === "COMPLETED" ? "bg-green-100" : "bg-gray-100"
                  }`}>
                    <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-semibold">
                      {task.workspace?.name || "N/A"}
                    </span>
                    <h3 className="text-lg font-semibold mt-2">{task.title}</h3>
                    <p className="text-sm text-gray-700 mt-1">
                      {task.description || "Không có mô tả"}
                    </p>
                    <div className="mt-3 text-sm space-y-1">
                      <div>
                        <span className="text-red-500 font-medium mr-2">
                          Ngày tạo:
                        </span>
                        {dayjs(task.createdAt).format("DD.MM.YYYY")}
                      </div>
                      <div>
                        <span className="text-red-500 font-medium mr-2">
                          Hạn chót:
                        </span>
                        {dayjs(task.dueDate).format("HH:mm, DD.MM.YYYY")}
                      </div>
                    </div>
                    <div className="mt-1 space-x-2 text-sm font-medium">
                      <span className="text-red-500">
                        {task.priority === "HIGH" ? "Cao" :
                         task.priority === "MEDIUM" ? "Trung bình" :
                         task.priority === "LOW" ? "Thấp" : "Chưa xác định"}
                      </span>
                      <span className="text-green-600">
                        {task.status === "PENDING" ? "Chưa bắt đầu" :
                         task.status === "IN_PROGRESS" ? "Đang tiến hành" :
                         task.status === "COMPLETED" ? "Đã hoàn thành" : task.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            {tasksOfUser.filter((task) => {
              const today = dayjs().format("YYYY-MM-DD");
              const taskDate = dayjs(task.dueDate).format("YYYY-MM-DD");
              return taskDate === today;
            }).length === 0 && (
              <div className="text-center py-8">
                <div className="text-gray-500 text-lg">
                  Không có nhiệm vụ nào cho hôm nay
                </div>
              </div>
            )}
          </div>
        ) : (
          // Giao diện "Tất cả nhiệm vụ"
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Việc phải làm */}
            <div>
              <h2 className="text-red-500 font-bold mb-2">Việc phải làm</h2>
              {tasksOfUser
                .filter((task) => task.status === "PENDING")
                .map((task) => (
                  <TaskCardFromAPI key={task.id} task={task} onDeleteTask={handleDeleteTask} />
                ))}
              {tasksOfUser.filter((task) => task.status === "PENDING").length === 0 && (
                <div className="text-gray-500 text-sm p-4 text-center">
                  Không có nhiệm vụ nào
                </div>
              )}
            </div>

            {/* Đang tiến hành */}
            <div>
              <h2 className="text-yellow-500 font-bold mb-2">Đang tiến hành</h2>
              {tasksOfUser
                .filter((task) => task.status === "IN_PROGRESS")
                .map((task) => (
                  <TaskCardFromAPI key={task.id} task={task} onDeleteTask={handleDeleteTask} />
                ))}
              {tasksOfUser.filter((task) => task.status === "IN_PROGRESS").length === 0 && (
                <div className="text-gray-500 text-sm p-4 text-center">
                  Không có nhiệm vụ nào
                </div>
              )}
            </div>

            {/* Đã hoàn thành */}
            <div>
              <h2 className="text-green-600 font-bold mb-2">Đã hoàn thành</h2>
              {tasksOfUser
                .filter((task) => task.status === "COMPLETED")
                .map((task) => (
                  <TaskCardFromAPI key={task.id} task={task} onDeleteTask={handleDeleteTask} />
                ))}
              {tasksOfUser.filter((task) => task.status === "COMPLETED").length === 0 && (
                <div className="text-gray-500 text-sm p-4 text-center">
                  Không có nhiệm vụ nào
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Modal
        title={null}
        open={openModalAddTask}
        onCancel={() => {
          setOpenModalAddTask(false);
          form.resetFields();
          setSelectedWorkspace(null);
          setSelectedDueDate(null);
          setSelectedPriority("MEDIUM");
          setSelectedStatus("PENDING");
        }}
        width={800}
        footer={null}
        style={{ top: 30 }}
        centered
        destroyOnClose={true}
        preserve={false}
        forceRender={true}
        className="task-modal"
        maskStyle={{
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(12px)'
        }}
      >
        <div className="task-form-wrapper">
          {/* Simple Header */}
          <div className="form-header">
            <div className="header-icon">
              <div className="icon-bg">
                <span className="task-emoji">📋</span>
              </div>
            </div>
            <div className="header-text">
              <h2 className="form-title">Tạo nhiệm vụ mới</h2>
              <p className="form-subtitle">Thêm nhiệm vụ vào danh sách công việc của bạn</p>
            </div>
          </div>

          {/* Form Body */}
          <div className="form-body">
            <Form 
              form={form} 
              onFinish={handleFinish}
              layout="vertical"
              validateTrigger="onSubmit"
              className="task-form"
            >
              {/* Title Input */}
              <div className="input-section">
                <Form.Item
                  name="title"
                  rules={[
                    { required: true, message: "Vui lòng nhập tiêu đề nhiệm vụ" },
                    { min: 3, message: "Tiêu đề phải có ít nhất 3 ký tự" }
                  ]}
                >
                  <div className="input-group">
                    <div className="input-label">
                      <span className="label-icon">🎯</span>
                      <span className="label-text">Tiêu đề nhiệm vụ</span>
                      <span className="required-mark">*</span>
                    </div>
                    <Input 
                      placeholder="Nhập tiêu đề cho nhiệm vụ của bạn..."
                      className="custom-input"
                      size="large"
                    />
                  </div>
                </Form.Item>
              </div>

              {/* Description Input */}
              <div className="input-section">
                <Form.Item
                  name="description"
                  rules={[
                    { required: true, message: "Vui lòng nhập mô tả nhiệm vụ" },
                    { min: 10, message: "Mô tả phải có ít nhất 10 ký tự" }
                  ]}
                >
                  <div className="input-group">
                    <div className="input-label">
                      <span className="label-icon">�</span>
                      <span className="label-text">Mô tả chi tiết</span>
                      <span className="required-mark">*</span>
                    </div>
                    <Input.TextArea 
                      placeholder="Mô tả chi tiết về nhiệm vụ này..."
                      className="custom-textarea"
                      rows={4}
                      showCount
                      maxLength={500}
                    />
                  </div>
                </Form.Item>
              </div>

              {/* Document Link Input */}
              <div className="input-section">
                <Form.Item
                  name="documentLink"
                  rules={[
                    { type: 'url', message: "Vui lòng nhập đúng định dạng URL (https://...)" }
                  ]}
                >
                  <div className="input-group">
                    <div className="input-label">
                      <span className="label-icon">🔗</span>
                      <span className="label-text">Link tài liệu</span>
                      <span style={{ color: '#6b7280', fontSize: '12px', marginLeft: '8px' }}>(Tùy chọn)</span>
                    </div>
                    <Input 
                      placeholder="https://docs.google.com/document/... hoặc link tài liệu khác"
                      className="custom-input"
                      size="large"
                      prefix={<span style={{ color: '#6b7280' }}>🔗</span>}
                    />
                  </div>
                </Form.Item>
              </div>

              {/* Grid Layout for remaining fields */}
              <div className="fields-grid">
                {/* Workspace */}
                <div className="input-section">
                  <Form.Item
                    name="workSpaceId"
                    rules={[{ required: true, message: "Vui lòng chọn workspace" }]}
                  >
                    <div className="input-group">
                      <div className="input-label">
                        <span className="label-icon">🏢</span>
                        <span className="label-text">Workspace</span>
                        <span className="required-mark">*</span>
                      </div>
                      <Select 
                        placeholder="Chọn workspace"
                        className="custom-select"
                        size="large"
                        showSearch
                        optionFilterProp="children"
                        value={selectedWorkspace}
                        onChange={(value) => {
                          setSelectedWorkspace(value);
                          form.setFieldsValue({ workSpaceId: value });
                        }}
                      >
                        {dataWorkSpace?.map((ws) => (
                          <Option key={ws.id} value={ws.id}>
                            <div className="option-item">
                              <span className="option-icon">🏢</span>
                              <span>{ws.name}</span>
                            </div>
                          </Option>
                        ))}
                      </Select>
                    </div>
                  </Form.Item>
                </div>

                {/* Priority */}
                <div className="input-section">
                  <Form.Item
                    name="priority"
                    initialValue="MEDIUM"
                    rules={[{ required: true }]}
                  >
                    <div className="input-group">
                      <div className="input-label">
                        <span className="label-icon">⚡</span>
                        <span className="label-text">Mức độ ưu tiên</span>
                      </div>
                      <Select 
                        className="custom-select"
                        size="large"
                        value={selectedPriority}
                        onChange={(value) => {
                          setSelectedPriority(value);
                          form.setFieldsValue({ priority: value });
                        }}
                      >
                        <Option value="LOW">
                          <div className="option-item priority-low">
                            <span className="option-icon">🟢</span>
                            <span>Thấp</span>
                          </div>
                        </Option>
                        <Option value="MEDIUM">
                          <div className="option-item priority-medium">
                            <span className="option-icon">🟡</span>
                            <span>Trung bình</span>
                          </div>
                        </Option>
                        <Option value="HIGH">
                          <div className="option-item priority-high">
                            <span className="option-icon">🔴</span>
                            <span>Cao</span>
                          </div>
                        </Option>
                      </Select>
                    </div>
                  </Form.Item>
                </div>

                {/* Status */}
                <div className="input-section">
                  <Form.Item
                    name="status"
                    initialValue="PENDING"
                    rules={[{ required: true }]}
                  >
                    <div className="input-group">
                      <div className="input-label">
                        <span className="label-icon">📊</span>
                        <span className="label-text">Trạng thái</span>
                      </div>
                      <Select 
                        className="custom-select"
                        size="large"
                        value={selectedStatus}
                        onChange={(value) => {
                          setSelectedStatus(value);
                          form.setFieldsValue({ status: value });
                        }}
                      >
                        <Option value="PENDING">
                          <div className="option-item status-pending">
                            <span className="option-icon">⏳</span>
                            <span>Chưa bắt đầu</span>
                          </div>
                        </Option>
                        <Option value="IN_PROGRESS">
                          <div className="option-item status-progress">
                            <span className="option-icon">🔄</span>
                            <span>Đang tiến hành</span>
                          </div>
                        </Option>
                        <Option value="COMPLETED">
                          <div className="option-item status-completed">
                            <span className="option-icon">✅</span>
                            <span>Hoàn thành</span>
                          </div>
                        </Option>
                      </Select>
                    </div>
                  </Form.Item>
                </div>

                {/* Due Date */}
                <div className="input-section">
                  <Form.Item
                    name="dueDate"
                    rules={[{ required: true, message: "Vui lòng chọn hạn chót" }]}
                  >
                    <div className="input-group">
                      <div className="input-label">
                        <span className="label-icon">📅</span>
                        <span className="label-text">Hạn chót</span>
                        <span className="required-mark">*</span>
                      </div>
                      <DatePicker
                        showTime={{
                          format: 'HH:mm',
                          defaultValue: dayjs('09:00', 'HH:mm')
                        }}
                        format="DD/MM/YYYY HH:mm"
                        placeholder="Chọn ngày và giờ"
                        className="custom-datepicker"
                        size="large"
                        style={{ width: "100%" }}
                        value={selectedDueDate}
                        onChange={(date) => {
                          setSelectedDueDate(date);
                          form.setFieldsValue({ dueDate: date });
                        }}
                        disabledDate={(current) =>
                          current && current < dayjs().startOf("day")
                        }
                      />
                    </div>
                  </Form.Item>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="form-footer">
                <Button
                  size="large"
                  onClick={() => {
                    setOpenModalAddTask(false);
                    form.resetFields();
                    setSelectedWorkspace(null);
                    setSelectedDueDate(null);
                    setSelectedPriority("MEDIUM");
                    setSelectedStatus("PENDING");
                  }}
                  className="cancel-button"
                >
                  Hủy bỏ
                </Button>
                <Button
                  type="primary"
                  size="large"
                  loading={loading}
                  htmlType="submit"
                  className="submit-button"
                >
                  {loading ? "Đang tạo..." : "Tạo nhiệm vụ"}
                </Button>
              </div>
            </Form>
          </div>
        </div>

        {/* Styles */}
        <style jsx>{`
          .task-form-wrapper {
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 
              0 20px 25px -5px rgba(0, 0, 0, 0.1),
              0 10px 10px -5px rgba(0, 0, 0, 0.04);
          }

          .form-header {
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            padding: 32px;
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            align-items: center;
            gap: 20px;
          }

          .header-icon {
            flex-shrink: 0;
          }

          .icon-bg {
            width: 64px;
            height: 64px;
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
          }

          .task-emoji {
            font-size: 28px;
            filter: brightness(0) invert(1);
          }

          .header-text {
            flex: 1;
          }

          .form-title {
            font-size: 24px;
            font-weight: 700;
            color: #1e293b;
            margin: 0 0 8px 0;
            line-height: 1.3;
          }

          .form-subtitle {
            font-size: 16px;
            color: #64748b;
            margin: 0;
            line-height: 1.5;
          }

          .form-body {
            padding: 32px;
            background: #ffffff;
          }

          .input-section {
            margin-bottom: 28px;
          }

          .input-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .input-label {
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 600;
            color: #374151;
            font-size: 14px;
          }

          .label-icon {
            font-size: 16px;
          }

          .label-text {
            flex: 1;
          }

          .required-mark {
            color: #ef4444;
            font-weight: 700;
          }

          :global(.custom-input) {
            border-radius: 12px !important;
            border: 2px solid #e5e7eb !important;
            padding: 16px 20px !important;
            font-size: 16px !important;
            transition: all 0.2s ease !important;
            background: #f9fafb !important;
          }

          :global(.custom-input:hover) {
            border-color: #d1d5db !important;
            background: #ffffff !important;
          }

          :global(.custom-input:focus) {
            border-color: #3b82f6 !important;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
            background: #ffffff !important;
          }

          :global(.custom-textarea) {
            border-radius: 12px !important;
            border: 2px solid #e5e7eb !important;
            padding: 16px 20px !important;
            font-size: 16px !important;
            transition: all 0.2s ease !important;
            background: #f9fafb !important;
            resize: none !important;
          }

          :global(.custom-textarea:hover) {
            border-color: #d1d5db !important;
            background: #ffffff !important;
          }

          :global(.custom-textarea:focus) {
            border-color: #3b82f6 !important;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
            background: #ffffff !important;
          }

          :global(.custom-select .ant-select-selector) {
            border-radius: 12px !important;
            border: 2px solid #e5e7eb !important;
            padding: 8px 16px !important;
            height: 56px !important;
            background: #f9fafb !important;
            transition: all 0.2s ease !important;
          }

          :global(.custom-select:hover .ant-select-selector) {
            border-color: #d1d5db !important;
            background: #ffffff !important;
          }

          :global(.custom-select.ant-select-focused .ant-select-selector) {
            border-color: #3b82f6 !important;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
            background: #ffffff !important;
          }

          :global(.custom-datepicker) {
            border-radius: 12px !important;
            border: 2px solid #e5e7eb !important;
            padding: 16px 20px !important;
            font-size: 16px !important;
            height: 56px !important;
            background: #f9fafb !important;
            transition: all 0.2s ease !important;
          }

          :global(.custom-datepicker:hover) {
            border-color: #d1d5db !important;
            background: #ffffff !important;
          }

          :global(.custom-datepicker:focus) {
            border-color: #3b82f6 !important;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
            background: #ffffff !important;
          }

          .fields-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
            margin-top: 8px;
          }

          .option-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 4px;
            border-radius: 8px;
            font-weight: 500;
          }

          .option-icon {
            font-size: 16px;
          }

          .priority-low {
            background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(101, 163, 13, 0.1));
            color: #15803d;
          }

          .priority-medium {
            background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.1));
            color: #d97706;
          }

          .priority-high {
            background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(185, 28, 28, 0.1));
            color: #dc2626;
          }

          .status-pending {
            background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.1));
            color: #d97706;
          }

          .status-progress {
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(29, 78, 216, 0.1));
            color: #2563eb;
          }

          .status-completed {
            background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(101, 163, 13, 0.1));
            color: #15803d;
          }

          .form-footer {
            display: flex;
            justify-content: flex-end;
            gap: 16px;
            margin-top: 32px;
            padding-top: 24px;
            border-top: 1px solid #e5e7eb;
          }

          :global(.cancel-button) {
            border-radius: 12px !important;
            border: 2px solid #e5e7eb !important;
            color: #6b7280 !important;
            background: #ffffff !important;
            font-weight: 600 !important;
            height: 48px !important;
            padding: 0 24px !important;
            transition: all 0.2s ease !important;
          }

          :global(.cancel-button:hover) {
            border-color: #d1d5db !important;
            color: #374151 !important;
            transform: translateY(-1px) !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
          }

          :global(.submit-button) {
            border-radius: 12px !important;
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
            border: none !important;
            color: white !important;
            font-weight: 700 !important;
            height: 48px !important;
            padding: 0 32px !important;
            box-shadow: 0 4px 14px rgba(59, 130, 246, 0.3) !important;
            transition: all 0.2s ease !important;
          }

          :global(.submit-button:hover) {
            transform: translateY(-2px) !important;
            box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4) !important;
          }

          :global(.submit-button:active) {
            transform: translateY(-1px) !important;
          }

          /* Responsive */
          @media (max-width: 768px) {
            .fields-grid {
              grid-template-columns: 1fr;
              gap: 20px;
            }
            
            .form-header {
              padding: 24px;
              flex-direction: column;
              text-align: center;
            }
            
            .form-body {
              padding: 24px;
            }
            
            .form-title {
              font-size: 20px;
            }
          }
        `}</style>
      </Modal>
    </div>
  );
};

export default NhiemVu;

// Component để hiển thị task từ API
const TaskCardFromAPI = ({ task, onDeleteTask }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-red-100";
      case "IN_PROGRESS":
        return "bg-yellow-100";
      case "COMPLETED":
        return "bg-green-100";
      default:
        return "bg-gray-100";
    }
  };
   
  const getStatusText = (status) => {
    switch (status) {
      case "PENDING":
        return "Chưa bắt đầu";
      case "IN_PROGRESS":
        return "Đang tiến hành";
      case "COMPLETED":
        return "Đã hoàn thành";
      default:
        return status;
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case "HIGH":
        return "Cao";
      case "MEDIUM":
        return "Trung bình";
      case "LOW":
        return "Thấp";
      default:
        return "Chưa xác định";
    }
  };

  const handleDeleteTask = () => {
    console.log("=== TASK CARD DELETE DEBUG ===");
    console.log("Task object:", task);
    console.log("Task ID:", task.id);
    console.log("Type of task.id:", typeof task.id);
    
    // Gọi function từ component cha để xóa task
    console.log("Calling onDeleteTask with:", task.id);
    onDeleteTask(task.id);
    setShowDropdown(false); // Đóng dropdown sau khi xóa
  };

  return (
    <div className={`rounded-xl p-4 shadow-sm mb-4 relative transition-all duration-300 ${getStatusColor(task.status)} ${
      task.isDeleting ? 'opacity-50 pointer-events-none' : ''
    }`}>
      {/* Menu 3 chấm */}
      <div className="absolute top-3 right-3" ref={dropdownRef}>
        {task.isDeleting ? (
          <div className="p-2">
            <svg className="animate-spin h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : (
          <>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2 hover:bg-white hover:bg-opacity-50 rounded-full transition-colors duration-200"
              style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="6" r="2" fill="currentColor"/>
                <circle cx="12" cy="12" r="2" fill="currentColor"/>
                <circle cx="12" cy="18" r="2" fill="currentColor"/>
              </svg>
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div className="py-1">
                  <button
                    onClick={handleDeleteTask}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline mr-2">
                      <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Xóa nhiệm vụ
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full font-semibold">
        {task.workspace?.name || "N/A"}
      </span>
      <h3 className="text-lg font-semibold mt-2 pr-8">{task.title}</h3>
      <p className="text-sm text-gray-700 mt-1">
        {task.description || "Không có mô tả"}
      </p>
      <div className="mt-3 text-sm space-y-1">
        <div>
          <span className="text-blue-500 font-medium mr-2">Ngày tạo:</span>
          {dayjs(task.createdAt).format("DD/MM/YYYY")}
        </div>
        <div>
          <span className="text-blue-500 font-medium mr-2">Hạn chót:</span>
          {dayjs(task.dueDate).format("DD/MM/YYYY HH:mm")}
        </div>
        {task.documentLink && (
          <div>
            <span className="text-blue-500 font-medium mr-2">Tài liệu:</span>
            <a 
              href={task.documentLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline hover:no-underline transition-colors duration-200"
            >
              <span className="inline-flex items-center gap-1">
                🔗 Xem tài liệu
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </a>
          </div>
        )}
      </div>
      <div className="mt-1 space-x-2 text-sm font-medium">
        <span className="text-red-500">{getPriorityText(task.priority)}</span>
        <span className="text-green-600">{getStatusText(task.status)}</span>
      </div>
    </div>
  );
};

// Component TaskCard gốc (giữ lại cho timeline)
const TaskCard = ({ task }) => (
  <div className={`rounded-xl p-4 shadow-sm mb-4 ${task.color}`}>
    <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-semibold">
      {task.project}
    </span>
    <h3 className="text-lg font-semibold mt-2">{task.title}</h3>
    <p className="text-sm text-gray-700 mt-1">{task.description}</p>
    <div className="mt-3 text-sm space-y-1">
      <div>
        <span className="text-red-500 font-medium mr-2">Ngày bắt đầu:</span>
        {task.start}
      </div>
      <div>
        <span className="text-red-500 font-medium mr-2">Hạn chót:</span>
        {task.end}
      </div>
    </div>
    <div className="mt-2 text-sm text-gray-600">📁 {task.files} files</div>
    <div className="mt-1 space-x-2 text-sm font-medium">
      <span className="text-red-500">{task.priority}</span>
      <span className="text-green-600">{task.status}</span>
    </div>
  </div>
);
