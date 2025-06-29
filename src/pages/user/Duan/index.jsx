import { Progress, Avatar, Dropdown, Button, Spin, Modal, Form, Input, Select, Upload, message, Divider, Tag, DatePicker, Checkbox, List, Card } from "antd";
import { MoreOutlined, PlusOutlined, UploadOutlined, FileOutlined, DownloadOutlined, DeleteOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { getAllMemberOnWorkSpaceApi } from "../../../apis/getALLMemberOnWorkSpaceApi";
import { addNewWorkSpaceByUserId } from "../../../apis/WorkSpaceUser/addNewWorkSpaceApi";
import { getAllTaskByWorkSpaceId } from "../../../apis/task/getAllTaskByWorkSpaceApi";
import { getAllWorkSpaceUser } from "../../../apis/WorkSpaceUser/getAllWorkSpaceUserApi";
import { deleteWorkSpace } from "../../../apis/WorkSpaceUser/deleteWorkSpaceApi";
import { updateTask } from "../../../apis/task/updateTaskApi";
import { editWorkSpace } from "../../../apis/editWorkspaceApi";
import { addTaskToWS } from "../../../apis/task/addTaskToWSApi";
import { generateTasksAI } from "../../../service/generateTasksAI";
import { generateCustomTasksAI } from "../../../service/generateCustomTasksAI";
dayjs.extend(relativeTime);

// Component để hiển thị và chọn AI tasks
const AiTasksSelector = ({ tasks, onAddTasks, onCancel }) => {
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedTasks(tasks.map((_, index) => index));
    } else {
      setSelectedTasks([]);
    }
  };

  const handleSelectTask = (index, checked) => {
    if (checked) {
      setSelectedTasks([...selectedTasks, index]);
    } else {
      setSelectedTasks(selectedTasks.filter(i => i !== index));
      setSelectAll(false);
    }
  };

  const handleAddSelected = () => {
    const tasksToAdd = selectedTasks.map(index => tasks[index]);
    onAddTasks(tasksToAdd);
  };

  // Helper function để lấy màu priority
  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'HIGH':
        return { color: 'red', icon: '🔴', label: 'Cao' };
      case 'MEDIUM':
        return { color: 'orange', icon: '🟡', label: 'Trung bình' };
      case 'LOW':
        return { color: 'green', icon: '🟢', label: 'Thấp' };
      default:
        return { color: 'blue', icon: '🔵', label: 'Bình thường' };
    }
  };

  // Helper function để lấy màu category
  const getCategoryConfig = (category) => {
    switch (category) {
      case 'planning':
        return { color: 'blue', icon: '📋', label: 'Lập kế hoạch' };
      case 'development':
        return { color: 'green', icon: '💻', label: 'Phát triển' };
      case 'testing':
        return { color: 'orange', icon: '🧪', label: 'Kiểm thử' };
      case 'deployment':
        return { color: 'purple', icon: '🚀', label: 'Triển khai' };
      default:
        return { color: 'gray', icon: '📝', label: 'Khác' };
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with select all */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border">
        <div className="flex items-center gap-3">
          <Checkbox 
            checked={selectAll}
            onChange={(e) => handleSelectAll(e.target.checked)}
          >
            <span className="font-medium text-gray-800">
              Chọn tất cả ({tasks.length} nhiệm vụ)
            </span>
          </Checkbox>
        </div>
        <div className="text-sm text-gray-600">
          Đã chọn: {selectedTasks.length}/{tasks.length}
        </div>
      </div>

      {/* Tasks List */}
      <div className="max-h-96 overflow-y-auto space-y-3">
        {tasks.map((task, index) => {
          const priorityConfig = getPriorityConfig(task.priority);
          const categoryConfig = getCategoryConfig(task.category);
          const isSelected = selectedTasks.includes(index);

          return (
            <Card
              key={index}
              size="small"
              className={`transition-all duration-200 cursor-pointer ${
                isSelected 
                  ? 'ring-2 ring-purple-400 bg-purple-50' 
                  : 'hover:shadow-md hover:border-purple-300'
              }`}
              onClick={() => handleSelectTask(index, !isSelected)}
            >
              <div className="flex items-start gap-3">
                <Checkbox 
                  checked={isSelected}
                  onChange={(e) => handleSelectTask(index, e.target.checked)}
                  onClick={(e) => e.stopPropagation()}
                />
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-gray-800 m-0">{task.title}</h4>
                    <Tag color={priorityConfig.color} className="text-xs">
                      {priorityConfig.icon} {priorityConfig.label}
                    </Tag>
                    <Tag color={categoryConfig.color} className="text-xs">
                      {categoryConfig.icon} {categoryConfig.label}
                    </Tag>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>⏱️ Ước tính: {task.estimatedDays} ngày</span>
                    <span>📅 Hạn: {dayjs().add(task.estimatedDays, 'day').format('DD/MM/YYYY')}</span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Action buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <Button onClick={onCancel} size="large">
          Hủy bỏ
        </Button>
        <Button 
          type="primary"
          size="large"
          disabled={selectedTasks.length === 0}
          onClick={handleAddSelected}
          className="bg-gradient-to-r from-purple-500 to-pink-600 border-none"
        >
          ✨ Thêm {selectedTasks.length} nhiệm vụ được chọn
        </Button>
      </div>
    </div>
  );
};

const Duan = () => {
  const [duanChuaXong, setDuanChuaXong] = useState([]);
  const [memberInDuAn, setMemberInDuAn] = useState([]);
  const [workSpaceId, setWorkSpaceId] = useState(null);
  const user_id = useSelector((store) => store?.user?.id);
  const [loading, setLoading] = useState(false);

  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  
  // Detail modal states
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectTasks, setProjectTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  
  // Task detail modal states
  const [taskDetailModalOpen, setTaskDetailModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskFiles, setTaskFiles] = useState([]);
  const [taskLinks, setTaskLinks] = useState([]);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  
  // Edit task modal states
  const [editTaskModalOpen, setEditTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editTaskForm] = Form.useForm();
  const [updatingTask, setUpdatingTask] = useState(false);
  
  // Edit workspace modal states
  const [editWorkspaceModalOpen, setEditWorkspaceModalOpen] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState(null);
  const [editWorkspaceForm] = Form.useForm();
  const [updatingWorkspace, setUpdatingWorkspace] = useState(false);
  
  // AI task generation states
  const [generatingTasks, setGeneratingTasks] = useState(false);
  const [aiGeneratedTasks, setAiGeneratedTasks] = useState([]);
  const [showAiTasksModal, setShowAiTasksModal] = useState(false);
  
  // Custom AI task generation states
  const [customAiModalOpen, setCustomAiModalOpen] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [generatedCustomTasks, setGeneratedCustomTasks] = useState([]);
  const [showCustomTasksModal, setShowCustomTasksModal] = useState(false);
  
  const fetchingData = async () => {
    setLoading(true);
    try {
      const response = await getAllWorkSpaceUser(user_id);
      setDuanChuaXong(response.data.data);
    } catch (error) {
      toast.error(
        error?.response?.data?.message?.error || "Error while fetching data!"
      );
    }
    setLoading(false);
  };
  const fetchingAllMembersInDuAn = async () => {
    try {
      const response = await getAllMemberOnWorkSpaceApi(workSpaceId);
      setMemberInDuAn(response.data.data);
    } catch (error) {
      console.error(error?.response?.data?.message?.error || "Error while fetching data!");
    }
  };
  useEffect(() => {
    if (workSpaceId) {
      fetchingAllMembersInDuAn();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workSpaceId]);

  useEffect(() => {
    fetchingData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle add new project
  const handleAddNewProject = async (values) => {
    setSubmitting(true);
    try {
      const projectData = {
        ...values,
        status: values.status || "ACTIVE"
      };
      
      // Call API to create new project
      await addNewWorkSpaceByUserId(projectData, user_id);
      
      toast.success("Tạo dự án thành công!");
      setIsModalOpen(false);
      form.resetFields();
      fetchingData(); // Refresh the project list
    } catch (error) {
      toast.error(error?.response?.data?.message?.error || "Error while creating project!");
    }
    setSubmitting(false);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  // Handle view project details
  const handleViewDetails = async (project) => {
    setSelectedProject(project);
    setDetailModalOpen(true);
    
    // Fetch tasks for this project
    setLoadingTasks(true);
    try {
      const response = await getAllTaskByWorkSpaceId(project.id);
      setProjectTasks(response.data.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Không thể tải danh sách nhiệm vụ!");
      setProjectTasks([]);
    }
    setLoadingTasks(false);
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedProject(null);
    setProjectTasks([]);
    setLoadingTasks(false);
  };

  // Handle task detail functions
  const handleViewTaskDetails = async (task) => {
    setSelectedTask(task);
    setTaskDetailModalOpen(true);
    
    // Load files từ localStorage cho task này
    const savedFiles = localStorage.getItem(`task_files_${task.id}`);
    let taskFilesData = [];
    
    if (savedFiles) {
      try {
        taskFilesData = JSON.parse(savedFiles);
      } catch (error) {
        console.error('Error parsing saved files:', error);
        taskFilesData = [];
      }
    }
    
    // Load links từ localStorage cho task này
    const savedLinks = localStorage.getItem(`task_links_${task.id}`);
    let taskLinksData = [];
    
    if (savedLinks) {
      try {
        taskLinksData = JSON.parse(savedLinks);
      } catch (error) {
        console.error('Error parsing saved links:', error);
        taskLinksData = [];
      }
    }
    
    // Mock data for demo (chỉ hiển thị nếu chưa có file nào được lưu)
    if (taskFilesData.length === 0) {
      const mockFiles = [
        {
          id: 1,
          name: 'requirements.pdf',
          size: '2.5 MB',
          type: 'application/pdf',
          uploadedAt: '2025-06-28T10:30:00',
          url: '#',
          isMock: true // đánh dấu là file demo
        },
        {
          id: 2,
          name: 'design-mockup.png',
          size: '1.8 MB',
          type: 'image/png',
          uploadedAt: '2025-06-28T14:20:00',
          url: '#',
          isMock: true // đánh dấu là file demo
        }
      ];
      taskFilesData = mockFiles;
    }
    
    // Mock data for links (chỉ hiển thị nếu chưa có link nào được lưu)
    if (taskLinksData.length === 0) {
      const mockLinks = [
        {
          id: 1,
          title: 'Tài liệu thiết kế',
          url: 'https://www.figma.com/design/example',
          addedAt: '2025-06-28T09:15:00',
          isMock: true
        },
        {
          id: 2,
          title: 'API Documentation',
          url: 'https://docs.example.com/api',
          addedAt: '2025-06-28T11:30:00',
          isMock: true
        }
      ];
      taskLinksData = mockLinks;
    }
    
    setTaskFiles(taskFilesData);
    setTaskLinks(taskLinksData);
  };

  const handleCloseTaskDetailModal = () => {
    setTaskDetailModalOpen(false);
    setSelectedTask(null);
    setTaskFiles([]);
  };

  // Handle edit task functions
  const handleEditTask = (task) => {
    setEditingTask(task);
    setEditTaskModalOpen(true);
    
    // Populate form with current task data
    editTaskForm.setFieldsValue({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? dayjs(task.dueDate) : null
    });
  };

  const handleCloseEditTaskModal = () => {
    setEditTaskModalOpen(false);
    setEditingTask(null);
    editTaskForm.resetFields();
  };

  const handleUpdateTask = async (values) => {
    if (!editingTask) return;
    
    setUpdatingTask(true);
    try {
      const updateData = {
        title: values.title,
        description: values.description,
        status: values.status,
        priority: values.priority,
        dueDate: values.dueDate ? dayjs(values.dueDate).toISOString() : null
      };

      await updateTask(updateData, editingTask.id);
      
      toast.success("Cập nhật nhiệm vụ thành công!");
      
      // Refresh task list in detail modal
      if (selectedProject) {
        const response = await getAllTaskByWorkSpaceId(selectedProject.id);
        setProjectTasks(response.data.data);
      }
      
      handleCloseEditTaskModal();
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật nhiệm vụ!");
    }
    setUpdatingTask(false);
  };

  // Handle edit workspace functions
  const handleEditWorkspace = (workspace) => {
    console.log("handleEditWorkspace called with:", workspace);
    
    if (!workspace) {
      console.error("No workspace provided to edit");
      toast.error("Không thể chỉnh sửa dự án: thiếu thông tin dự án");
      return;
    }
    
    setEditingWorkspace(workspace);
    setEditWorkspaceModalOpen(true);
    
    // Populate form with current workspace data
    editWorkspaceForm.setFieldsValue({
      name: workspace.name,
      description: workspace.description,
      status: workspace.status
    });
    
    console.log("Edit workspace modal opened with data:", {
      name: workspace.name,
      description: workspace.description,
      status: workspace.status
    });
  };

  const handleCloseEditWorkspaceModal = () => {
    setEditWorkspaceModalOpen(false);
    setEditingWorkspace(null);
    editWorkspaceForm.resetFields();
  };

  const handleUpdateWorkspace = async (values) => {
    if (!editingWorkspace) {
      console.error("No editing workspace found");
      return;
    }
    
    console.log("Updating workspace with values:", values);
    console.log("Editing workspace:", editingWorkspace);
    
    setUpdatingWorkspace(true);
    try {
      const updateData = {
        name: values.name,
        description: values.description,
        status: values.status
      };

      console.log("Update data:", updateData);
      console.log("Workspace ID:", editingWorkspace.id);

      const response = await editWorkSpace(updateData, editingWorkspace.id);
      console.log("Update response:", response);
      
      toast.success("Cập nhật dự án thành công!");
      
      // Refresh workspace list
      await fetchingData();
      
      // Update selectedProject if it's the same as editingWorkspace
      if (selectedProject && selectedProject.id === editingWorkspace.id) {
        setSelectedProject({ ...selectedProject, ...updateData });
      }
      
      handleCloseEditWorkspaceModal();
    } catch (error) {
      console.error("Error updating workspace:", error);
      console.error("Error details:", error.response?.data);
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật dự án!");
    }
    setUpdatingWorkspace(false);
  };

  // AI Task Generation functions
  const handleGenerateTasksWithAI = async (project) => {
    setGeneratingTasks(true);
    try {
      const aiTasks = await generateTasksAI(project);
      setAiGeneratedTasks(aiTasks);
      setShowAiTasksModal(true);
      toast.success("AI đã tạo ra " + aiTasks.length + " nhiệm vụ đề xuất!");
    } catch (error) {
      console.error("Error generating tasks with AI:", error);
      toast.error(error.message || "Có lỗi xảy ra khi AI tạo tasks!");
    }
    setGeneratingTasks(false);
  };

  const handleAddAiTasksToProject = async (selectedTasks) => {
    if (!selectedProject || selectedTasks.length === 0) return;
    
    let addedCount = 0;
    let failedCount = 0;
    
    for (const taskData of selectedTasks) {
      try {
        // Tạo dueDate (deadline) từ estimated days
        const dueDate = dayjs().add(taskData.estimatedDays || 3, 'day').toISOString();
        
        const taskPayload = {
          title: taskData.title,
          description: taskData.description,
          priority: taskData.priority || 'MEDIUM',
          dueDate: dueDate,
          status: 'PENDING'
        };
        
        await addTaskToWS(taskPayload, selectedProject.id);
        addedCount++;
      } catch (error) {
        console.error("Error adding task:", error);
        failedCount++;
      }
    }
    
    if (addedCount > 0) {
      toast.success(`✅ Đã thêm ${addedCount} nhiệm vụ vào dự án!`);
      
      // Refresh task list if detail modal is open
      if (detailModalOpen && selectedProject) {
        try {
          const response = await getAllTaskByWorkSpaceId(selectedProject.id);
          setProjectTasks(response.data.data);
        } catch (error) {
          console.error("Error refreshing tasks:", error);
        }
      }
    }
    
    if (failedCount > 0) {
      toast.error(`⚠️ Có ${failedCount} nhiệm vụ không thể thêm vào dự án.`);
    }
    
    setShowAiTasksModal(false);
    setAiGeneratedTasks([]);
  };

  const handleCloseAiTasksModal = () => {
    setShowAiTasksModal(false);
    setAiGeneratedTasks([]);
  };

  // Custom AI Task Generation functions
  const handleOpenCustomAiModal = () => {
    setCustomAiModalOpen(true);
    setCustomPrompt('');
  };

  const handleCloseCustomAiModal = () => {
    setCustomAiModalOpen(false);
    setCustomPrompt('');
  };

  const handleGenerateCustomTasks = async () => {
    if (!customPrompt.trim()) {
      toast.error("Vui lòng nhập yêu cầu tạo task!");
      return;
    }

    setGeneratingTasks(true);
    try {
      const aiTasks = await generateCustomTasksAI(selectedProject, customPrompt);
      setGeneratedCustomTasks(aiTasks);
      setShowCustomTasksModal(true);
      setCustomAiModalOpen(false);
      toast.success("AI đã tạo ra " + aiTasks.length + " nhiệm vụ theo yêu cầu của bạn!");
    } catch (error) {
      console.error("Error generating custom tasks with AI:", error);
      toast.error(error.message || "Có lỗi xảy ra khi AI tạo tasks!");
    }
    setGeneratingTasks(false);
  };

  const handleAddCustomTasksToProject = async (selectedTasks) => {
    if (!selectedProject || selectedTasks.length === 0) return;
    
    let addedCount = 0;
    let failedCount = 0;
    
    for (const taskData of selectedTasks) {
      try {
        // Tạo dueDate (deadline) từ estimated days
        const dueDate = dayjs().add(taskData.estimatedDays || 3, 'day').toISOString();
        
        const taskPayload = {
          title: taskData.title,
          description: taskData.description,
          priority: taskData.priority || 'MEDIUM',
          dueDate: dueDate,
          status: 'PENDING'
        };
        
        await addTaskToWS(taskPayload, selectedProject.id);
        addedCount++;
      } catch (error) {
        console.error("Error adding custom task:", error);
        failedCount++;
      }
    }
    
    if (addedCount > 0) {
      toast.success(`✅ Đã thêm ${addedCount} nhiệm vụ tùy chỉnh vào dự án!`);
      
      // Refresh task list if detail modal is open
      if (detailModalOpen && selectedProject) {
        try {
          const response = await getAllTaskByWorkSpaceId(selectedProject.id);
          setProjectTasks(response.data.data);
        } catch (error) {
          console.error("Error refreshing tasks:", error);
        }
      }
    }
    
    if (failedCount > 0) {
      toast.error(`⚠️ Có ${failedCount} nhiệm vụ không thể thêm vào dự án.`);
    }
    
    setShowCustomTasksModal(false);
    setGeneratedCustomTasks([]);
  };

  const handleCloseCustomTasksModal = () => {
    setShowCustomTasksModal(false);
    setGeneratedCustomTasks([]);
  };

  // Helper function để clear storage (có thể dùng cho debug hoặc reset)
  const _clearTaskFilesStorage = (taskId) => {
    if (taskId) {
      localStorage.removeItem(`task_files_${taskId}`);
      message.info('🗑️ Đã xóa dữ liệu file cho task này');
    }
  };

  // Helper function để export/backup files data
  const _exportTaskFiles = (taskId) => {
    const savedFiles = localStorage.getItem(`task_files_${taskId}`);
    if (savedFiles) {
      const blob = new Blob([savedFiles], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `task_${taskId}_files_backup.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      message.success('📦 Đã xuất dữ liệu file backup');
    } else {
      message.warning('❗ Không có dữ liệu file để xuất');
    }
  };

  const handleFileUpload = (info) => {
    const { status, originFileObj } = info.file;
    
    if (status === 'uploading') {
      setUploadingFile(true);
      message.loading(`Đang tải lên ${info.file.name}...`);
    }
    
    if (status === 'done' || status === 'error') {
      setUploadingFile(false);
      
      if (status === 'done') {
        // Thêm file mới vào danh sách (mô phỏng thành công)
        const newFile = {
          id: Date.now(),
          name: info.file.name,
          size: `${(info.file.size / 1024 / 1024).toFixed(1)} MB`,
          type: info.file.type,
          uploadedAt: new Date().toISOString(),
          url: URL.createObjectURL(originFileObj), // Tạo URL preview cho file
          file: originFileObj, // Lưu file object để có thể download
          isMock: false // đánh dấu là file thật
        };
        
        // Cập nhật state
        const updatedFiles = [...taskFiles, newFile];
        setTaskFiles(updatedFiles);
        
        // Lưu vào localStorage cho task hiện tại
        if (selectedTask) {
          // Loại bỏ file object trước khi lưu vào localStorage (vì không serialize được)
          const filesToSave = updatedFiles.map(file => ({
            ...file,
            file: undefined // loại bỏ file object
          }));
          localStorage.setItem(`task_files_${selectedTask.id}`, JSON.stringify(filesToSave));
        }
        
        message.success({
          content: (
            <div>
              <div className="font-medium">✅ File đã được lưu thành công!</div>
              <div className="text-sm text-gray-600">{info.file.name} ({(info.file.size / 1024 / 1024).toFixed(1)} MB)</div>
              <div className="text-xs text-blue-600 mt-1">💾 File đã được lưu trữ và sẽ không bị mất khi đóng modal</div>
            </div>
          ),
          duration: 4
        });
      } else {
        message.error(`❌ ${info.file.name} tải lên thất bại.`);
      }
    }
  };

  // Custom upload function - không gửi lên server thật, chỉ mô phỏng
  const customUpload = ({ file, onSuccess, onError, onProgress }) => {
    // Validate file
    const isValidSize = file.size / 1024 / 1024 < 10; // < 10MB
    if (!isValidSize) {
      message.error('File không được vượt quá 10MB!');
      onError(new Error('File size too large'));
      return;
    }

    // Mô phỏng quá trình upload
    let progress = 0;
    const timer = setInterval(() => {
      progress += 10;
      onProgress({ percent: progress });
      
      if (progress >= 100) {
        clearInterval(timer);
        // Mô phỏng thành công
        setTimeout(() => {
          onSuccess({
            name: file.name,
            status: 'done',
            url: URL.createObjectURL(file)
          });
        }, 500);
      }
    }, 100);
  };

  const handleDeleteFile = (fileId) => {
    Modal.confirm({
      title: 'Xác nhận xóa file',
      content: 'Bạn có chắc chắn muốn xóa file này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk: () => {
        // Cập nhật state
        const updatedFiles = taskFiles.filter(file => file.id !== fileId);
        setTaskFiles(updatedFiles);
        
        // Cập nhật localStorage
        if (selectedTask) {
          const filesToSave = updatedFiles.map(file => ({
            ...file,
            file: undefined // loại bỏ file object
          }));
          localStorage.setItem(`task_files_${selectedTask.id}`, JSON.stringify(filesToSave));
        }
        
        message.success('✅ Đã xóa file thành công.');
      }
    });
  };

  const handleDownloadFile = (file) => {
    if (file.isMock) {
      // File demo - không thể download thật
      message.warning('❗ Đây là file demo, không thể tải xuống thực tế.');
      return;
    }
    
    if (file.url && file.url !== '#') {
      // Tạo link download
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      message.success(`📥 Đã tải xuống ${file.name}`);
    } else {
      message.error('❌ Không thể tải xuống file này');
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType?.includes('image')) return '🖼️';
    if (fileType?.includes('pdf')) return '📄';
    if (fileType?.includes('word')) return '📝';
    if (fileType?.includes('excel')) return '📊';
    if (fileType?.includes('zip')) return '📦';
    return '📁';
  };

  // Link management functions
  const handleAddLink = () => {
    if (!newLinkTitle.trim() || !newLinkUrl.trim()) {
      message.warning('❗ Vui lòng nhập đầy đủ tiêu đề và URL.');
      return;
    }

    // Validate URL format
    try {
      const url = new URL(newLinkUrl);
      if (!['http:', 'https:'].includes(url.protocol)) {
        message.error('❌ URL phải bắt đầu bằng http:// hoặc https://');
        return;
      }
    } catch {
      message.error('❌ URL không hợp lệ. VD: https://docs.google.com/...');
      return;
    }

    const newLink = {
      id: Date.now(), // sử dụng timestamp làm ID tạm
      title: newLinkTitle.trim(),
      url: newLinkUrl.trim(),
      addedAt: new Date().toISOString(),
      isMock: false
    };

    // Cập nhật state
    const updatedLinks = [...taskLinks, newLink];
    setTaskLinks(updatedLinks);

    // Lưu vào localStorage
    if (selectedTask) {
      localStorage.setItem(`task_links_${selectedTask.id}`, JSON.stringify(updatedLinks));
    }

    // Reset form
    setNewLinkTitle('');
    setNewLinkUrl('');
    
    message.success('✅ Đã thêm link tài liệu thành công.');
  };

  const handleDeleteLink = (linkId) => {
    Modal.confirm({
      title: 'Xác nhận xóa link',
      content: 'Bạn có chắc chắn muốn xóa link tài liệu này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk: () => {
        // Cập nhật state
        const updatedLinks = taskLinks.filter(link => link.id !== linkId);
        setTaskLinks(updatedLinks);
        
        // Cập nhật localStorage
        if (selectedTask) {
          localStorage.setItem(`task_links_${selectedTask.id}`, JSON.stringify(updatedLinks));
        }
        
        message.success('✅ Đã xóa link tài liệu thành công.');
      }
    });
  };

  // Helper functions for task status and priority
  const getTaskStatusConfig = (status) => {
    switch (status) {
      case 'COMPLETED':
        return { 
          color: 'green', 
          bg: 'bg-green-100', 
          text: 'text-green-700', 
          icon: '✅',
          label: 'Hoàn thành' 
        };
      case 'IN_PROGRESS':
        return { 
          color: 'blue', 
          bg: 'bg-blue-100', 
          text: 'text-blue-700', 
          icon: '🔄',
          label: 'Đang thực hiện' 
        };
      case 'PENDING':
        return { 
          color: 'yellow', 
          bg: 'bg-yellow-100', 
          text: 'text-yellow-700', 
          icon: '⏳',
          label: 'Chờ thực hiện' 
        };
      default:
        return { 
          color: 'gray', 
          bg: 'bg-gray-100', 
          text: 'text-gray-700', 
          icon: '❓',
          label: 'Không xác định' 
        };
    }
  };
  const handleDeleteDuAn = async(id) =>{
    try {
        await deleteWorkSpace(id);
        toast.success("Dự án đã được xóa thành công!");
        fetchingData(); // Refresh the project list after deletion
    } catch (error) {
      toast.error(error?.response?.data?.message?.error || "Error while deleting project!");
    }
  }
  const calculateProjectStats = () => {
    if (!projectTasks.length) return { completed: 0, inProgress: 0, pending: 0, total: 0, progress: 0 };
    
    const completed = projectTasks.filter(task => task.status === 'COMPLETED').length;
    const inProgress = projectTasks.filter(task => task.status === 'IN_PROGRESS').length;
    const pending = projectTasks.filter(task => task.status === 'PENDING').length;
    const total = projectTasks.length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { completed, inProgress, pending, total, progress };
  };
  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          📁 Quản Lý Dự Án
        </h1>
        <p className="text-gray-600">
          Theo dõi và quản lý tất cả dự án của bạn một cách hiệu quả
        </p>
      </div>
      {/* Header: Filters + Button */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-4">
          <div className="relative">
            <select className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer">
              <option>🎯 All Status</option>
              <option>🟢 Active</option>
              <option>✅ Completed</option>
              <option>⏸️ Pending</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
        </div>
        
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={showModal}
          size="large"
          className="h-12 px-6 bg-gradient-to-r from-blue-500 to-purple-600 border-none rounded-lg hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
        >
          <span className="font-semibold text-white">🚀 Add New Dự Án</span>
        </Button>
      </div>

      {/* Project List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <Spin size="large" />
            <p className="mt-4 text-gray-500">Đang tải dự án...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {duanChuaXong.map((project) => {
            // Sử dụng progress từ API response
            const progress = project.progress || 0; // Lấy progress từ API, default là 0
            const status = project.status || "PENDING"; // Sử dụng status từ API
            
            // Xử lý màu sắc dựa trên status từ API
            const getStatusConfig = (status) => {
              switch (status) {
                case "ACTIVE":
                  return {
                    bg: "bg-gradient-to-r from-green-100 to-emerald-100",
                    text: "text-emerald-700",
                    bar: "#10b981",
                    badge: "�",
                    label: "Active"
                  };
                case "COMPLETED":
                  return {
                    bg: "bg-gradient-to-r from-blue-100 to-cyan-100",
                    text: "text-blue-700",
                    bar: "#3b82f6",
                    badge: "✅",
                    label: "Completed"
                  };
                case "PENDING":
                default:
                  return {
                    bg: "bg-gradient-to-r from-yellow-100 to-orange-100",
                    text: "text-orange-700",
                    bar: "#f97316",
                    badge: "🟡",
                    label: "Pending"
                  };
              }
            };
            
            const statusColor = getStatusConfig(status);
            const updated = dayjs(project.updatedAt).fromNow(); // ví dụ: "2 hours ago"
            const members = ["A", "B"]; // giả định

            return (
              <div
                key={project.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl p-6 relative transform hover:scale-105 transition-all duration-300 border border-gray-100 hover:border-blue-200"
              >
                {/* Status Badge */}
                <div className="flex justify-between items-start mb-4">
                  <span
                    className={`text-sm font-semibold px-4 py-2 rounded-full ${statusColor.bg} ${statusColor.text} flex items-center gap-2`}
                  >
                    <span>{statusColor.badge}</span>
                    {status}
                  </span>
                  <Dropdown
                    menu={{
                      items: [
                        { 
                          label: (
                            <span onClick={() => {handleEditWorkspace(project)}} className="flex items-center gap-2">
                              ✏️ Edit
                            </span>
                          ), 
                          key: "1" 
                        },
                        { 
                          label: (
                            <span onClick={() => {handleDeleteDuAn(project.id)}} className="flex items-center gap-2 text-red-500">
                              🗑️ Delete
                            </span>
                          ), 
                          key: "2" 
                        },
                      ],
                    }}
                  >
                    <MoreOutlined className="text-gray-400 text-xl cursor-pointer hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg" />
                  </Dropdown>
                </div>

                {/* Project Info */}
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                    {project.name}
                  </h3>
                  <p
                    onClick={() => setWorkSpaceId(project.id)}
                    className="text-sm text-blue-600 cursor-pointer hover:text-blue-800 transition-colors duration-200 flex items-center gap-2 font-medium"
                  >
                    👥 Thành viên trong dự án
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                      {members.length}
                    </span>
                  </p>
                </div>

                {/* Progress Section */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 font-medium">📊 Tiến độ</span>
                    <span className="text-sm font-bold text-gray-800">{progress}%</span>
                  </div>
                  <Progress
                    percent={progress}
                    showInfo={false}
                    strokeColor={{
                      '0%': statusColor.bar,
                      '100%': '#a855f7',
                    }}
                    className="mt-1"
                    strokeWidth={8}
                  />
                </div>

                {/* Footer */}
                <div className="pt-4 border-t border-gray-100 space-y-3">
                  <div className="flex justify-between items-center">
                    <Avatar.Group
                      maxCount={3}
                      maxStyle={{ 
                        color: "#fff", 
                        backgroundColor: "#6366f1",
                        border: "2px solid white"
                      }}
                    >
                      {members.map((name, index) => (
                        <Avatar 
                          key={index}
                          className="border-2 border-white"
                          style={{ backgroundColor: `hsl(${index * 120}, 70%, 50%)` }}
                        >
                          {name}
                        </Avatar>
                      ))}
                    </Avatar.Group>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      🕒 {updated}
                    </span>
                  </div>
                  
                  {/* Action Button */}
                  <Button 
                    type="primary" 
                    block
                    size="large"
                    className="bg-gradient-to-r from-indigo-500 to-blue-600 border-none rounded-lg hover:from-indigo-600 hover:to-blue-700 shadow-md hover:shadow-lg transition-all duration-200 font-medium"
                    onClick={() => handleViewDetails(project)}
                  >
                    👁️ Xem Chi Tiết Dự Án
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      
      {memberInDuAn.length > 0 && (
        <div className="mt-10 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                👥 Team Members
              </h2>
              <p className="text-gray-600 mt-1">Quản lý thành viên trong dự án</p>
            </div>
            <Button 
              type="primary"
              icon={<PlusOutlined />}
              className="h-12 px-6 bg-gradient-to-r from-green-500 to-emerald-600 border-none rounded-lg hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <span className="font-semibold">+ Add Member</span>
            </Button>
          </div>
          
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-gray-50 to-blue-50 text-gray-700 font-semibold">
                <tr>
                  <th className="p-4 text-left">👤 Member</th>
                  <th className="p-4 text-left">🎭 Role</th>
                  <th className="p-4 text-left">📊 Projects</th>
                  <th className="p-4 text-left">🚦 Status</th>
                  <th className="p-4 text-left">⚙️ Actions</th>
                </tr>
              </thead>
              <tbody>
                {memberInDuAn.map((mem, index) => (
                  <tr key={index} className="border-t border-gray-100 hover:bg-blue-50 transition-colors duration-200">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar 
                          size="large" 
                          src={`https://i.pravatar.cc/150?u=${mem.id}`}
                          className="border-2 border-white shadow-lg"
                        />
                        <div>
                          <div className="font-semibold text-gray-800">{mem.name}</div>
                          <div className="text-sm text-gray-500">{mem.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 text-sm font-semibold px-3 py-2 rounded-full">
                        {mem.role || "Member"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-gray-600 font-medium">8 Projects</span>
                    </td>
                    <td className="p-4">
                      <span className="bg-gradient-to-r from-green-100 to-emerald-100 text-emerald-700 text-sm font-semibold px-3 py-2 rounded-full flex items-center gap-2 w-fit">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        Active
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button className="text-blue-600 text-sm hover:text-blue-800 font-medium hover:underline transition-colors">
                          ✏️ Edit
                        </button>
                        <button className="text-red-500 text-sm hover:text-red-700 font-medium hover:underline transition-colors">
                          🗑️ Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add New Project Modal */}
      <Modal
        title={
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <PlusOutlined className="text-white text-lg" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 m-0">Tạo Dự Án Mới</h3>
              <p className="text-sm text-gray-500 m-0">Thêm dự án mới vào workspace của bạn</p>
            </div>
          </div>
        }
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={650}
        className="custom-modal"
        style={{ top: 20 }}
      >
        <div className="pt-6">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleAddNewProject}
            className="space-y-1"
          >
            <Form.Item
              label={
                <span className="text-gray-700 font-medium">
                  📋 Tên Dự Án
                </span>
              }
              name="name"
              rules={[
                { required: true, message: 'Vui lòng nhập tên dự án!' },
                { min: 3, message: 'Tên dự án phải có ít nhất 3 ký tự!' }
              ]}
            >
              <Input 
                placeholder="VD: Website ChronoBuddy, Mobile App..."
                size="large"
                className="rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500"
                prefix={<div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>}
              />
            </Form.Item>

            <Form.Item
              label={
                <span className="text-gray-700 font-medium">
                  📝 Mô Tả
                </span>
              }
              name="description"
              rules={[
                { required: true, message: 'Vui lòng nhập mô tả dự án!' },
                { min: 10, message: 'Mô tả phải có ít nhất 10 ký tự!' }
              ]}
            >
              <Input.TextArea 
                placeholder="Mô tả chi tiết về mục tiêu, phạm vi và yêu cầu của dự án..."
                rows={4}
                size="large"
                className="rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500 resize-none"
                showCount
                maxLength={500}
              />
            </Form.Item>

            <Form.Item
              label={
                <span className="text-gray-700 font-medium">
                  🚀 Trạng Thái
                </span>
              }
              name="status"
              initialValue="ACTIVE"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
            >
              <Select 
                size="large" 
                placeholder="Chọn trạng thái dự án"
                className="rounded-lg"
                dropdownClassName="custom-select-dropdown"
              >
                <Select.Option value="ACTIVE">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>🟢 Active - Đang hoạt động</span>
                  </div>
                </Select.Option>
                <Select.Option value="PENDING">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>🟡 Pending - Đang chờ</span>
                  </div>
                </Select.Option>
                <Select.Option value="COMPLETED">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>🔵 Completed - Đã hoàn thành</span>
                  </div>
                </Select.Option>
              </Select>
            </Form.Item>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <Button 
                onClick={handleCancel} 
                size="large"
                className="px-6 py-2 h-auto rounded-lg border-gray-300 hover:border-gray-400"
              >
                <span className="font-medium">Hủy bỏ</span>
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                loading={submitting}
                size="large"
                className="px-8 py-2 h-auto rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 border-none hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <span className="font-medium">
                  {submitting ? '🔄 Đang tạo...' : '✨ Tạo Dự Án'}
                </span>
              </Button>
            </div>
          </Form>
        </div>
      </Modal>

      {/* Project Detail Modal */}
      <Modal
        title={
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">📋</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 m-0">Chi Tiết Dự Án</h3>
              <p className="text-sm text-gray-500 m-0">Thông tin chi tiết về dự án</p>
            </div>
          </div>
        }
        open={detailModalOpen}
        onCancel={handleCloseDetailModal}
        footer={
          <div className="flex justify-end gap-3">
            <Button onClick={handleCloseDetailModal} size="large">
              Đóng
            </Button>
            <Button 
              type="primary" 
              size="large"
              className="bg-gradient-to-r from-indigo-500 to-blue-600 border-none"
              onClick={() => handleEditWorkspace(selectedProject)}
            >
              ✏️ Chỉnh sửa dự án
            </Button>
          </div>
        }
        width={700}
        className="detail-modal"
      >
        {selectedProject && (
          <div className="pt-6 space-y-6">
            {/* Project Basic Info */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
              <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                📝 Thông tin cơ bản
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Tên dự án:</label>
                  <p className="text-gray-800 font-semibold">{selectedProject.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Trạng thái:</label>
                  <span className="inline-block mt-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    🟢 {selectedProject.status || 'Active'}
                  </span>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-600">Mô tả:</label>
                  <p className="text-gray-700 mt-1">{selectedProject.description || "Chưa có mô tả"}</p>
                </div>
              </div>
            </div>

            {/* Progress & Stats */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl">
              <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                📊 Tiến độ & Thống kê
              </h4>
              {(() => {
                const stats = calculateProjectStats();
                // Sử dụng progress từ API thay vì tính toán cục bộ
                const progressFromAPI = selectedProject?.progress || 0;
                return (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-600">{progressFromAPI}%</div>
                      <div className="text-sm text-gray-600">Tiến độ hoàn thành</div>
                      <Progress percent={progressFromAPI} strokeColor="#6366f1" className="mt-2" />
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                      <div className="text-sm text-gray-600">Nhiệm vụ hoàn thành</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
                      <div className="text-sm text-gray-600">Đang thực hiện</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
                      <div className="text-sm text-gray-600">Chờ thực hiện</div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Tasks List */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  � Danh sách nhiệm vụ ({projectTasks.length})
                </h4>
              </div>
              
              {loadingTasks ? (
                <div className="flex justify-center items-center py-12">
                  <Spin size="large" />
                  <span className="ml-3 text-gray-500">Đang tải nhiệm vụ...</span>
                </div>
              ) : projectTasks.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {projectTasks.map((task, index) => {
                    const statusConfig = getTaskStatusConfig(task.status);
                    const isOverdue = dayjs(task.dueDate).isBefore(dayjs()) && task.status !== 'COMPLETED';
                    
                    return (
                      <div key={task.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                              <h5 className="font-semibold text-gray-800 text-base">{task.title}</h5>
                              {isOverdue && (
                                <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                                  ⚠️ Quá hạn
                                </span>
                              )}
                            </div>
                            
                            {task.description && (
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{task.description}</p>
                            )}
                            
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                📅 Hạn: {dayjs(task.dueDate).format('DD/MM/YYYY HH:mm')}
                              </span>
                              <span className="flex items-center gap-1">
                                🕐 Tạo: {dayjs(task.createdAt).format('DD/MM/YYYY')}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.text} flex items-center gap-1`}>
                              <span>{statusConfig.icon}</span>
                              {statusConfig.label}
                            </span>
                            
                            <div className="flex items-center gap-2">
                              <Button 
                                size="small" 
                                type="link" 
                                className="text-blue-600 hover:text-blue-800 p-1"
                                title="Chỉnh sửa nhiệm vụ"
                                onClick={() => handleEditTask(task)}
                              >
                                ✏️
                              </Button>
                              <Button 
                                size="small" 
                                type="link" 
                                className="text-gray-600 hover:text-gray-800 p-1"
                                onClick={() => handleViewTaskDetails(task)}
                                title="Xem chi tiết & file đính kèm"
                              >
                                👁️
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">📝</div>
                  <p className="text-gray-500 text-lg">Chưa có nhiệm vụ nào trong dự án này</p>
                  {/* <Button type="primary" className="mt-4">
                    ➕ Thêm nhiệm vụ đầu tiên
                  </Button> */}
                </div>
              )}
            </div>

            {/* Timeline */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl">
              <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                📅 Thời gian
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Ngày tạo:</label>
                  <p className="text-gray-800">{dayjs(selectedProject.createdAt).format('DD/MM/YYYY HH:mm')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Cập nhật lần cuối:</label>
                  <p className="text-gray-800">{dayjs(selectedProject.updatedAt).format('DD/MM/YYYY HH:mm')}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                ⚡ Hành động nhanh
              </h4>
              <div className="flex flex-wrap gap-3">
                <Button 
                  type="primary" 
                  className="bg-blue-500 border-blue-500"
                >
                  ➕ Thêm nhiệm vụ mới
                </Button>
                <Button 
                  type="primary"
                  className="bg-gradient-to-r from-purple-500 to-pink-600 border-none"
                  loading={generatingTasks}
                  onClick={() => handleGenerateTasksWithAI(selectedProject)}
                >
                  🤖 AI tạo nhiệm vụ
                </Button>
                <Button 
                  type="primary"
                  className="bg-gradient-to-r from-orange-500 to-red-600 border-none"
                  onClick={() => handleOpenCustomAiModal()}
                >
                  🎯 AI tùy chỉnh
                </Button>
                <Button 
                  type="default"
                  className="border-green-500 text-green-600 hover:bg-green-50"
                  onClick={() => setWorkSpaceId(selectedProject.id)}
                >
                  👥 Quản lý thành viên
                </Button>
                <Button 
                  type="default"
                  className="border-purple-500 text-purple-600 hover:bg-purple-50"
                >
                  📊 Báo cáo tiến độ
                </Button>
                <Button 
                  type="default"
                  className="border-orange-500 text-orange-600 hover:bg-orange-50"
                >
                  ⚙️ Cài đặt dự án
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Task Detail Modal */}
      <Modal
        title={
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">📋</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 m-0">Chi Tiết Nhiệm Vụ</h3>
              <p className="text-sm text-gray-500 m-0">Thông tin chi tiết và file đính kèm</p>
            </div>
          </div>
        }
        open={taskDetailModalOpen}
        onCancel={handleCloseTaskDetailModal}
        footer={
          <div className="flex justify-end gap-3">
            <Button onClick={handleCloseTaskDetailModal} size="large">
              Đóng
            </Button>
            <Button 
              type="primary" 
              size="large"
              className="bg-gradient-to-r from-green-500 to-emerald-600 border-none"
            >
              ✏️ Chỉnh sửa nhiệm vụ
            </Button>
          </div>
        }
        width={800}
        className="task-detail-modal"
      >
        {selectedTask && (
          <div className="pt-6 space-y-6">
            {/* Task Basic Info */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
              <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                📝 Thông tin nhiệm vụ
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Tên nhiệm vụ:</label>
                  <p className="text-gray-800 font-semibold text-lg">{selectedTask.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Trạng thái:</label>
                  <div className="mt-1">
                    {(() => {
                      const statusConfig = getTaskStatusConfig(selectedTask.status);
                      return (
                        <Tag 
                          color={statusConfig.color} 
                          className="px-3 py-1 text-sm font-medium"
                        >
                          {statusConfig.icon} {statusConfig.label}
                        </Tag>
                      );
                    })()}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Hạn hoàn thành:</label>
                  <p className="text-gray-800">{dayjs(selectedTask.dueDate).format('DD/MM/YYYY HH:mm')}</p>
                  {dayjs(selectedTask.dueDate).isBefore(dayjs()) && selectedTask.status !== 'COMPLETED' && (
                    <span className="text-red-500 text-sm font-medium">⚠️ Đã quá hạn</span>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Ngày tạo:</label>
                  <p className="text-gray-800">{dayjs(selectedTask.createdAt).format('DD/MM/YYYY HH:mm')}</p>
                </div>
                {selectedTask.description && (
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-600">Mô tả:</label>
                    <p className="text-gray-700 mt-1 p-3 bg-gray-50 rounded-lg">{selectedTask.description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* File Management Section */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  📎 File đính kèm ({taskFiles.length})
                </h4>
                <Upload
                  name="file"
                  customRequest={customUpload}
                  onChange={handleFileUpload}
                  showUploadList={false}
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.zip,.rar"
                  beforeUpload={(file) => {
                    const isValidSize = file.size / 1024 / 1024 < 10; // < 10MB
                    if (!isValidSize) {
                      message.error(`${file.name} quá lớn! Chỉ cho phép file dưới 10MB.`);
                      return false;
                    }
                    
                    // Check file type
                    const allowedTypes = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'gif', 'zip', 'rar'];
                    const fileExtension = file.name.split('.').pop().toLowerCase();
                    if (!allowedTypes.includes(fileExtension)) {
                      message.error(`${file.name} không được hỗ trợ! Chỉ cho phép: PDF, DOC, DOCX, JPG, PNG, GIF, ZIP, RAR`);
                      return false;
                    }
                    
                    return true;
                  }}
                >
                  <Button 
                    type="primary" 
                    icon={<UploadOutlined />}
                    loading={uploadingFile}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 border-none"
                  >
                    {uploadingFile ? 'Đang tải lên...' : 'Tải lên file'}
                  </Button>
                </Upload>
              </div>

              {/* File List */}
              {taskFiles.length > 0 ? (
                <div className="space-y-3">
                  {taskFiles.map((file) => (
                    <div key={file.id} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <span className="text-2xl">{getFileIcon(file.type)}</span>
                            {/* Preview cho file ảnh */}
                            {file.type?.includes('image') && file.url && (
                              <div className="absolute -top-2 -right-2">
                                <img 
                                  src={file.url} 
                                  alt={file.name}
                                  className="w-6 h-6 rounded object-cover border border-gray-200"
                                />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 flex items-center gap-2">
                              {file.name}
                              {/* Status indicator */}
                              {file.isMock ? (
                                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                                  🔗 File demo
                                </span>
                              ) : (
                                <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                                  ✓ Đã lưu
                                </span>
                              )}
                            </p>
                            <p className="text-sm text-gray-500">
                              {file.size} • {file.isMock ? 'File mẫu' : `Tải lên ${dayjs(file.uploadedAt).format('DD/MM/YYYY HH:mm')}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            size="small" 
                            type="link" 
                            icon={<DownloadOutlined />}
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => handleDownloadFile(file)}
                            title="Tải xuống"
                          >
                            Tải xuống
                          </Button>
                          <Button 
                            size="small" 
                            type="link" 
                            icon={<DeleteOutlined />}
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteFile(file.id)}
                            title="Xóa file"
                          >
                            Xóa
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileOutlined className="text-gray-400 text-4xl mb-4" />
                  <p className="text-gray-500 mb-4">Chưa có file nào được đính kèm</p>
                  <Upload
                    name="file"
                    customRequest={customUpload}
                    onChange={handleFileUpload}
                    showUploadList={false}
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.zip,.rar"
                    beforeUpload={(file) => {
                      const isValidSize = file.size / 1024 / 1024 < 10; // < 10MB
                      if (!isValidSize) {
                        message.error(`${file.name} quá lớn! Chỉ cho phép file dưới 10MB.`);
                        return false;
                      }
                      
                      // Check file type
                      const allowedTypes = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'gif', 'zip', 'rar'];
                      const fileExtension = file.name.split('.').pop().toLowerCase();
                      if (!allowedTypes.includes(fileExtension)) {
                        message.error(`${file.name} không được hỗ trợ! Chỉ cho phép: PDF, DOC, DOCX, JPG, PNG, GIF, ZIP, RAR`);
                        return false;
                      }
                      
                      return true;
                    }}
                  >
                    <Button 
                      type="dashed" 
                      icon={<UploadOutlined />}
                      size="large"
                      className="border-2 border-dashed border-gray-300 hover:border-blue-400"
                    >
                      Nhấp để tải lên file đầu tiên
                    </Button>
                  </Upload>
                </div>
              )}
            </div>

            {/* Link Document Management Section */}
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-xl">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  🔗 Link tài liệu ({taskLinks.length})
                </h4>
              </div>

              {/* Add New Link Form */}
              <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                <h5 className="text-md font-semibold text-gray-700 mb-3">➕ Thêm link tài liệu mới</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <Input
                    placeholder="Tiêu đề tài liệu (VD: Tài liệu thiết kế UI)"
                    value={newLinkTitle}
                    onChange={(e) => setNewLinkTitle(e.target.value)}
                    className="border-gray-300"
                  />
                  <Input
                    placeholder="URL (VD: https://docs.google.com/...)"
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                    className="border-gray-300"
                  />
                </div>
                <Button 
                  type="primary" 
                  onClick={handleAddLink}
                  disabled={!newLinkTitle.trim() || !newLinkUrl.trim()}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 border-none"
                >
                  ➕ Thêm link
                </Button>
              </div>

              {/* Link List */}
              {taskLinks.length > 0 ? (
                <div className="space-y-3">
                  {taskLinks.map((link) => (
                    <div key={link.id} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="text-2xl">🔗</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-gray-800">{link.title}</p>
                              {link.isMock ? (
                                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                                  🔗 Link demo
                                </span>
                              ) : (
                                <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                                  ✓ Đã lưu
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 mt-1">
                              <a 
                                href={link.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 text-sm break-all"
                              >
                                {link.url}
                              </a>
                              <span className="text-sm text-gray-500">
                                {link.isMock ? 'Link mẫu' : `Thêm lúc ${dayjs(link.addedAt).format('DD/MM/YYYY HH:mm')}`}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            size="small" 
                            type="link" 
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => window.open(link.url, '_blank')}
                            title="Mở link"
                          >
                            🔗 Mở
                          </Button>
                          <Button 
                            size="small" 
                            type="link" 
                            icon={<DeleteOutlined />}
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteLink(link.id)}
                            title="Xóa link"
                          >
                            Xóa
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-4xl mb-4">🔗</div>
                  <p className="text-gray-500 mb-4">Chưa có link tài liệu nào</p>
                  <p className="text-sm text-gray-400">Thêm link tài liệu, hướng dẫn, hoặc tham khảo vào form bên trên</p>
                </div>
              )}
            </div>

            {/* Project Info */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl">
              <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                🏗️ Thông tin dự án
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Tên dự án:</label>
                  <p className="text-gray-800 font-semibold">{selectedTask.workspace?.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Người quản lý:</label>
                  <p className="text-gray-800">{selectedTask.workspace?.user?.username || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                ⚡ Hành động nhanh
              </h4>
              <div className="flex flex-wrap gap-3">
                <Button 
                  type="primary" 
                  className="bg-green-500 border-green-500"
                >
                  ✅ Đánh dấu hoàn thành
                </Button>
                <Button 
                  type="default"
                  className="border-blue-500 text-blue-600 hover:bg-blue-50"
                >
                  ✏️ Chỉnh sửa nhiệm vụ
                </Button>
                <Button 
                  type="default"
                  className="border-purple-500 text-purple-600 hover:bg-purple-50"
                >
                  💬 Thêm bình luận
                </Button>
                <Button 
                  type="default"
                  className="border-orange-500 text-orange-600 hover:bg-orange-50"
                >
                  🔄 Thay đổi trạng thái
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Edit Task */}
      <Modal
        title={
          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">✏️</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 m-0">
                Chỉnh sửa nhiệm vụ
              </h3>
              <p className="text-sm text-gray-500 m-0">
                Cập nhật thông tin nhiệm vụ
              </p>
            </div>
          </div>
        }
        open={editTaskModalOpen}
        onCancel={handleCloseEditTaskModal}
        width={600}
        footer={null}
        className="edit-task-modal"
      >
        <div className="p-6">
          <Form
            form={editTaskForm}
            layout="vertical"
            onFinish={handleUpdateTask}
            className="space-y-4"
          >
            {/* Title */}
            <Form.Item
              label={
                <span className="text-sm font-medium text-gray-700">
                  🎯 Tiêu đề nhiệm vụ
                </span>
              }
              name="title"
              rules={[
                { required: true, message: "Vui lòng nhập tiêu đề nhiệm vụ" },
                { min: 3, message: "Tiêu đề phải có ít nhất 3 ký tự" }
              ]}
            >
              <Input 
                placeholder="Nhập tiêu đề nhiệm vụ..."
                className="rounded-lg border-gray-300"
                size="large"
              />
            </Form.Item>

            {/* Description */}
            <Form.Item
              label={
                <span className="text-sm font-medium text-gray-700">
                  📝 Mô tả chi tiết
                </span>
              }
              name="description"
              rules={[
                { required: true, message: "Vui lòng nhập mô tả nhiệm vụ" },
                { min: 10, message: "Mô tả phải có ít nhất 10 ký tự" }
              ]}
            >
              <Input.TextArea 
                placeholder="Mô tả chi tiết về nhiệm vụ..."
                className="rounded-lg border-gray-300"
                rows={4}
                showCount
                maxLength={500}
              />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
              {/* Status */}
              <Form.Item
                label={
                  <span className="text-sm font-medium text-gray-700">
                    📊 Trạng thái
                  </span>
                }
                name="status"
                rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
              >
                <Select 
                  placeholder="Chọn trạng thái"
                  className="rounded-lg"
                  size="large"
                >
                  <Select.Option value="PENDING">
                    <span className="flex items-center gap-2">
                      ⏳ Chưa bắt đầu
                    </span>
                  </Select.Option>
                  <Select.Option value="IN_PROGRESS">
                    <span className="flex items-center gap-2">
                      🔄 Đang tiến hành
                    </span>
                  </Select.Option>
                  <Select.Option value="COMPLETED">
                    <span className="flex items-center gap-2">
                      ✅ Hoàn thành
                    </span>
                  </Select.Option>
                </Select>
              </Form.Item>

              {/* Priority */}
              <Form.Item
                label={
                  <span className="text-sm font-medium text-gray-700">
                    ⚡ Mức độ ưu tiên
                  </span>
                }
                name="priority"
                rules={[{ required: true, message: "Vui lòng chọn mức độ ưu tiên" }]}
              >
                <Select 
                  placeholder="Chọn mức độ ưu tiên"
                  className="rounded-lg"
                  size="large"
                >
                  <Select.Option value="LOW">
                    <span className="flex items-center gap-2">
                      🟢 Thấp
                    </span>
                  </Select.Option>
                  <Select.Option value="MEDIUM">
                    <span className="flex items-center gap-2">
                      🟡 Trung bình
                    </span>
                  </Select.Option>
                  <Select.Option value="HIGH">
                    <span className="flex items-center gap-2">
                      🔴 Cao
                    </span>
                  </Select.Option>
                </Select>
              </Form.Item>
            </div>

            {/* Due Date */}
            <Form.Item
              label={
                <span className="text-sm font-medium text-gray-700">
                  📅 Hạn chót
                </span>
              }
              name="dueDate"
              rules={[{ required: true, message: "Vui lòng chọn hạn chót" }]}
            >
              <DatePicker
                showTime={{
                  format: 'HH:mm',
                  defaultValue: dayjs('09:00', 'HH:mm')
                }}
                format="DD/MM/YYYY HH:mm"
                placeholder="Chọn ngày và giờ hạn chót"
                className="w-full rounded-lg border-gray-300"
                size="large"
                disabledDate={(current) =>
                  current && current < dayjs().startOf("day")
                }
              />
            </Form.Item>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button
                onClick={handleCloseEditTaskModal}
                className="px-6 rounded-lg"
                size="large"
              >
                Hủy bỏ
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={updatingTask}
                className="px-6 bg-gradient-to-r from-blue-500 to-purple-600 border-none rounded-lg"
                size="large"
              >
                {updatingTask ? "Đang cập nhật..." : "Cập nhật nhiệm vụ"}
              </Button>
            </div>
          </Form>
        </div>
      </Modal>

      {/* Edit Workspace Modal */}
      <Modal
        title={
          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">📋</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 m-0">
                Chỉnh sửa dự án
              </h3>
              <p className="text-sm text-gray-500 m-0">
                Cập nhật thông tin dự án
              </p>
            </div>
          </div>
        }
        open={editWorkspaceModalOpen}
        onCancel={handleCloseEditWorkspaceModal}
        width={650}
        footer={null}
        className="edit-workspace-modal"
      >
        <div className="p-6">
          <Form
            form={editWorkspaceForm}
            layout="vertical"
            onFinish={handleUpdateWorkspace}
            className="space-y-4"
          >
            {/* Project Name */}
            <Form.Item
              label={
                <span className="text-sm font-medium text-gray-700">
                  📋 Tên Dự Án
                </span>
              }
              name="name"
              rules={[
                { required: true, message: "Vui lòng nhập tên dự án" },
                { min: 3, message: "Tên dự án phải có ít nhất 3 ký tự" }
              ]}
            >
              <Input 
                placeholder="Nhập tên dự án..."
                className="rounded-lg border-gray-300"
                size="large"
                prefix={<div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>}
              />
            </Form.Item>

            {/* Project Description */}
            <Form.Item
              label={
                <span className="text-sm font-medium text-gray-700">
                  📝 Mô tả dự án
                </span>
              }
              name="description"
              rules={[
                { required: true, message: "Vui lòng nhập mô tả dự án" },
                { min: 10, message: "Mô tả phải có ít nhất 10 ký tự" }
              ]}
            >
              <Input.TextArea 
                placeholder="Mô tả chi tiết về dự án..."
                className="rounded-lg border-gray-300"
                rows={4}
                showCount
                maxLength={500}
              />
            </Form.Item>

            {/* Project Status */}
            <Form.Item
              label={
                <span className="text-sm font-medium text-gray-700">
                  🚀 Trạng thái dự án
                </span>
              }
              name="status"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
            >
              <Select 
                placeholder="Chọn trạng thái dự án"
                className="rounded-lg"
                size="large"
              >
                <Select.Option value="ACTIVE">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>🟢 Active - Đang hoạt động</span>
                  </div>
                </Select.Option>
                <Select.Option value="PENDING">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>🟡 Pending - Đang chờ</span>
                  </div>
                </Select.Option>
                <Select.Option value="COMPLETED">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>🔵 Completed - Đã hoàn thành</span>
                  </div>
                </Select.Option>
              </Select>
            </Form.Item>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button
                onClick={handleCloseEditWorkspaceModal}
                className="px-6 rounded-lg"
                size="large"
              >
                Hủy bỏ
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={updatingWorkspace}
                className="px-6 bg-gradient-to-r from-indigo-500 to-purple-600 border-none rounded-lg"
                size="large"
              >
                {updatingWorkspace ? "Đang cập nhật..." : "Cập nhật dự án"}
              </Button>
            </div>
          </Form>
        </div>
      </Modal>

      {/* AI Generated Tasks Modal */}
      <Modal
        title={
          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">🤖</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 m-0">
                AI đề xuất nhiệm vụ
              </h3>
              <p className="text-sm text-gray-500 m-0">
                Chọn những nhiệm vụ bạn muốn thêm vào dự án
              </p>
            </div>
          </div>
        }
        open={showAiTasksModal}
        onCancel={handleCloseAiTasksModal}
        width={800}
        footer={null}
        className="ai-tasks-modal"
      >
        <div className="p-6">
          {aiGeneratedTasks.length > 0 ? (
            <AiTasksSelector 
              tasks={aiGeneratedTasks}
              onAddTasks={handleAddAiTasksToProject}
              onCancel={handleCloseAiTasksModal}
            />
          ) : (
            <div className="text-center py-8">
              <Spin size="large" />
              <p className="mt-4 text-gray-500">AI đang phân tích và tạo nhiệm vụ...</p>
            </div>
          )}
        </div>
      </Modal>

      {/* Custom AI Prompt Modal */}
      <Modal
        title={
          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">🎯</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 m-0">
                AI Tạo Task Tùy Chỉnh
              </h3>
              <p className="text-sm text-gray-500 m-0">
                Yêu cầu AI tạo task theo ý muốn của bạn
              </p>
            </div>
          </div>
        }
        open={customAiModalOpen}
        onCancel={handleCloseCustomAiModal}
        width={600}
        footer={
          <div className="flex justify-end gap-3">
            <Button onClick={handleCloseCustomAiModal} size="large">
              Hủy bỏ
            </Button>
            <Button 
              type="primary"
              size="large"
              loading={generatingTasks}
              onClick={handleGenerateCustomTasks}
              className="bg-gradient-to-r from-orange-500 to-red-600 border-none"
              disabled={!customPrompt.trim()}
            >
              {generatingTasks ? "🤖 AI đang tạo..." : "🎯 Tạo Task"}
            </Button>
          </div>
        }
        className="custom-ai-modal"
      >
        <div className="p-6 space-y-4">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border border-orange-200">
            <h4 className="text-md font-semibold text-gray-800 mb-2 flex items-center gap-2">
              💡 Hướng dẫn sử dụng
            </h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• Mô tả cụ thể loại task bạn muốn AI tạo</p>
              <p>• Có thể yêu cầu theo chủ đề, kỹ năng, hoặc giai đoạn cụ thể</p>
              <p>• Ví dụ: "Tạo các task về security testing cho ứng dụng web"</p>
              <p>• Hoặc: "Tạo tasks marketing cho sản phẩm mới ra mắt"</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🎯 Yêu cầu tạo task:
            </label>
            <Input.TextArea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Ví dụ: Tạo các task về kiểm thử bảo mật cho ứng dụng web, bao gồm penetration testing, vulnerability scanning..."
              rows={4}
              className="rounded-lg border-gray-300"
              showCount
              maxLength={500}
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h5 className="text-sm font-semibold text-blue-800 mb-2">📋 Thông tin dự án hiện tại:</h5>
            <div className="text-sm text-blue-700">
              <p><strong>Dự án:</strong> {selectedProject?.name}</p>
              <p><strong>Mô tả:</strong> {selectedProject?.description}</p>
            </div>
          </div>
        </div>
      </Modal>

      {/* Custom AI Generated Tasks Modal */}
      <Modal
        title={
          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">🎯</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 m-0">
                Task Tùy Chỉnh Từ AI
              </h3>
              <p className="text-sm text-gray-500 m-0">
                Chọn các task bạn muốn thêm vào dự án
              </p>
            </div>
          </div>
        }
        open={showCustomTasksModal}
        onCancel={handleCloseCustomTasksModal}
        width={800}
        footer={null}
        className="custom-ai-tasks-modal"
      >
        <div className="p-6">
          {generatedCustomTasks.length > 0 ? (
            <AiTasksSelector 
              tasks={generatedCustomTasks}
              onAddTasks={handleAddCustomTasksToProject}
              onCancel={handleCloseCustomTasksModal}
            />
          ) : (
            <div className="text-center py-8">
              <Spin size="large" />
              <p className="mt-4 text-gray-500">AI đang tạo task theo yêu cầu của bạn...</p>
            </div>
          )}
        </div>
      </Modal>

    </div>
  );
};

export default Duan;
