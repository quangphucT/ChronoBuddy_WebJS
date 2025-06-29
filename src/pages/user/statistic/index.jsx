import { Card, Progress, Select, Avatar, Typography, Button, Spin, Modal } from "antd";
import "./index.scss";
import {
  CheckCircleOutlined,
  ProjectOutlined,
  ClockCircleOutlined,
  MoreOutlined,
  UserOutlined,
  PlayCircleOutlined,
  FileTextOutlined,
  FilePdfOutlined,
  FileImageOutlined,
  FileOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

import { useSelector } from "react-redux";
import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";

import dayjs from "dayjs";

import { countWorkSpaceUnCompleted } from "../../../apis/workSpace-Upcompleted/countWorkSpaceUnCompletedApi";
import { countWorkSpaceCompleted } from "../../../apis/workSpace-Upcompleted/countWorkSpaceCompletedApi";
import { getAllWorkSpaceUser } from "../../../apis/WorkSpaceUser/getAllWorkSpaceUserApi";
import { getTop5TaskUnCompleted } from "../../../apis/task/getTop5TaskUnCompleted";
import PomodoroTimer from "./components/PomodoroTimer";
import PomodoroWidget from "./components/PomodoroWidget";

const { Title, Text } = Typography;

const StatisticOwn = ({ onNavigateToProjects }) => {
  const user_id = useSelector((store) => store?.user?.id);
  const _userName = useSelector((store) => store?.user?.username);

  // count workspace uncompleted
  const [duanUnCompleted, setDuanUnCompleted] = useState(null);
  // count workspace completed
  const [duanCompleted, setDuanCompleted] = useState(null);
  // get all wworkspace user
  const [allWorkSpaceUser, setAllWorkSpaceUser] = useState([]);
  // top 5 task uncompleted
  const [top5TaskUnCompleted, setTop5TaskUnCompleted] = useState([]);
  // loading state
  const [loading, setLoading] = useState(true);
  // pomodoro modal state
  const [pomodoroVisible, setPomodoroVisible] = useState(false);
  // recent files from localStorage
  const [recentFiles, setRecentFiles] = useState([]);
  // file detail modal state
  const [fileDetailVisible, setFileDetailVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  // count workspace uncompleted
  const fetchingWorkSpaceUnCompleted = async () => {
    try {
      const response = await countWorkSpaceUnCompleted(user_id);
      setDuanUnCompleted(response.data.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message?.error ||
          "Error while fetching workspaces!"
      );
    }
  };

  // count workspace completed
  const fetchingWorkSpacesCompleted = async () => {
    try {
      const response = await countWorkSpaceCompleted(user_id);
      setDuanCompleted(response.data.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message?.error ||
          "Error while fetching workspaces!"
      );
    }
  };

  // fetching data workspace user
  const fetchingAllWorkSpaceUser = async () => {
    try {
      const response = await getAllWorkSpaceUser(user_id);
      setAllWorkSpaceUser(response.data.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message?.error ||
          "Error while fetching workspaces user!"
      );
    }
  };

  // get top 5 task uncompleted
  const fetchingTop5TaskUnCompleted = async () => {
    try {
      const response = await getTop5TaskUnCompleted(user_id);
      setTop5TaskUnCompleted(response.data.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message?.error ||
          "Error while fetching top 5 tasks!"
      );
    }
  };

  // load recent files from localStorage
  const loadRecentFiles = useCallback(() => {
    try {
      const allKeys = Object.keys(localStorage);
      const files = [];
      
      console.log('All localStorage keys:', allKeys);
      
      // Check all localStorage keys for file data
      allKeys.forEach(key => {
        try {
          const data = localStorage.getItem(key);
          if (data) {
            const parsedData = JSON.parse(data);
            console.log(`Key: ${key}, Data:`, parsedData);
            
            // Check if this looks like file data (has name, size, type properties)
            // Also check for different possible structures
            if (parsedData && typeof parsedData === 'object') {
              // Check if it's a direct file object
              if (parsedData.name && parsedData.size !== undefined && parsedData.type) {
                files.push({
                  id: key,
                  name: parsedData.name,
                  type: parsedData.type,
                  size: parsedData.size,
                  url: parsedData.url || null,
                  uploadedAt: parsedData.uploadedAt || new Date().toISOString(),
                  taskId: parsedData.taskId || null,
                  projectId: parsedData.projectId || null,
                  workspaceId: parsedData.workspaceId || null
                });
                console.log('Found file:', parsedData.name);
              }
              // Check if it's an array of files
              else if (Array.isArray(parsedData)) {
                parsedData.forEach((item, index) => {
                  if (item && item.name && item.size !== undefined && item.type) {
                    files.push({
                      id: `${key}_${index}`,
                      name: item.name,
                      type: item.type,
                      size: item.size,
                      url: item.url || null,
                      uploadedAt: item.uploadedAt || new Date().toISOString(),
                      taskId: item.taskId || null,
                      projectId: item.projectId || null,
                      workspaceId: item.workspaceId || null
                    });
                    console.log('Found file in array:', item.name);
                  }
                });
              }
            }
          }
        } catch (error) {
          // Skip invalid JSON or non-object data
          console.debug('Skipping key:', key, error.message);
        }
      });

      // Sort by uploadedAt descending (newest first)
      files.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
      
      // Take only the latest 10 files
      setRecentFiles(files.slice(0, 10));
      
      console.log('Final loaded files:', files);
    } catch (error) {
      console.error('Error loading recent files:', error);
      setRecentFiles([]);
    }
  }, []);

  // helper function to get file icon based on file type
  const getFileIcon = (fileType) => {
    if (!fileType) return <FileOutlined />;
    
    const type = fileType.toLowerCase();
    if (type.includes('pdf')) return <FilePdfOutlined />;
    if (type.includes('image') || type.includes('png') || type.includes('jpg') || type.includes('jpeg')) {
      return <FileImageOutlined />;
    }
    if (type.includes('text') || type.includes('txt') || type.includes('doc')) {
      return <FileTextOutlined />;
    }
    return <FileOutlined />;
  };

  // helper function to format file size
  const formatFileSize = (sizeString) => {
    // If size is already a string like "2.5 MB", return it
    if (typeof sizeString === 'string' && sizeString.includes(' ')) {
      return sizeString;
    }
    
    // If size is a number in bytes
    const bytes = parseFloat(sizeString) || 0;
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // helper function to handle file download/view
  const handleFileAction = (file) => {
    setSelectedFile(file);
    setFileDetailVisible(true);
  };

  // helper function to close file detail modal
  const closeFileDetail = () => {
    setFileDetailVisible(false);
    setSelectedFile(null);
  };

  // helper function to download/view file
  const downloadFile = (file) => {
    if (file.url) {
      // If there's a URL, open it
      window.open(file.url, '_blank');
    } else {
      // Try to get file content from localStorage and create blob
      try {
        const fileData = localStorage.getItem(file.id);
        if (fileData) {
          const parsedData = JSON.parse(fileData);
          
          // If there's base64 data or file content
          if (parsedData.content || parsedData.data) {
            const content = parsedData.content || parsedData.data;
            
            // Create blob and download
            let blob;
            if (content.startsWith('data:')) {
              // Data URL format
              const response = fetch(content);
              response.then(res => res.blob()).then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = file.name;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
              });
            } else {
              // Try as base64
              try {
                const byteCharacters = atob(content);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                  byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                blob = new Blob([byteArray], { type: file.type });
                
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = file.name;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
              } catch {
                toast.error('Không thể tải file: Định dạng file không hỗ trợ');
              }
            }
          } else {
            toast.info(`File "${file.name}" được lưu tại localStorage nhưng không có nội dung để tải`);
          }
        } else {
          toast.error('Không tìm thấy file trong localStorage');
        }
      } catch (error) {
        console.error('Error downloading file:', error);
        toast.error('Lỗi khi tải file');
      }
    }
  };

  // helper function to check if file can be previewed
  const canPreviewFile = (file) => {
    if (!file || !file.type) return false;
    const type = file.type.toLowerCase();
    return type.includes('image') || type.includes('text') || type.includes('pdf');
  };

  // helper function to preview file content
  const previewFile = (file) => {
    try {
      const fileData = localStorage.getItem(file.id);
      if (fileData) {
        const parsedData = JSON.parse(fileData);
        
        if (parsedData.content || parsedData.data) {
          const content = parsedData.content || parsedData.data;
          
          if (file.type.includes('image')) {
            // For images, show in new window
            const newWindow = window.open();
            newWindow.document.write(`
              <html>
                <head><title>${file.name}</title></head>
                <body style="margin:0; display:flex; justify-content:center; align-items:center; min-height:100vh; background:#f0f0f0;">
                  <img src="${content}" style="max-width:100%; max-height:100vh;" alt="${file.name}"/>
                </body>
              </html>
            `);
          } else if (file.type.includes('text')) {
            // For text files, decode and show
            try {
              const textContent = atob(content);
              const newWindow = window.open();
              newWindow.document.write(`
                <html>
                  <head><title>${file.name}</title></head>
                  <body style="padding:20px; font-family:monospace; white-space:pre-wrap;">
                    ${textContent}
                  </body>
                </html>
              `);
            } catch {
              toast.error('Không thể hiển thị nội dung file text');
            }
          } else {
            // For other types, try to download
            downloadFile(file);
          }
        } else {
          toast.info('File không có nội dung để xem trước');
        }
      }
    } catch (error) {
      console.error('Error previewing file:', error);
      toast.error('Lỗi khi xem trước file');
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchingAllWorkSpaceUser(),
          fetchingWorkSpaceUnCompleted(),
          fetchingWorkSpacesCompleted(),
          fetchingTop5TaskUnCompleted(),
        ]);
        // Load recent files from localStorage
        loadRecentFiles();
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user_id) {
      fetchAllData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user_id]);

  // Debug useEffect to check localStorage
  useEffect(() => {
    console.log('Debug: Checking localStorage on component mount');
    console.log('Total localStorage keys:', Object.keys(localStorage).length);
    
    // Try loading files again
    loadRecentFiles();
  }, [loadRecentFiles]);

  return (
    <div className="statistic-container">
      {/* Header */}
      <div className="header-section">
        <div className="greeting">
          <Title level={2} className="greeting-title">
            Chào {_userName || "Htahis"}
          </Title>
          <Text className="greeting-subtitle">
            Thứ bảy, {dayjs().format("DD.MM.YYYY")} | {dayjs().format("HH:mm")}{" "}
            AM
          </Text>
        </div>
        <div className="pomodoro-timer">
          <Button 
            type="primary" 
            className="pomodoro-btn"
            icon={<PlayCircleOutlined />}
            onClick={() => setPomodoroVisible(true)}
          >
            Pomodoro ⏯️
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <Card className="stat-card">
          <div className="stat-content">
            <div className="stat-icon blue">
              <CheckCircleOutlined />
            </div>
            <div className="stat-info">
              <Text className="stat-label">Dự án chưa hoàn thành</Text>
              <Title level={3} className="stat-number">
                {loading ? <Spin size="large" /> : <>{duanUnCompleted}</>}
              </Title>
            </div>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-content">
            <div className="stat-icon green">
              <ProjectOutlined />
            </div>
            <div className="stat-info">
              <Text className="stat-label">Dự án đã hoàn thành</Text>
              <Title level={3} className="stat-number">
                {loading ? <Spin size="large" /> : <>{duanCompleted}</>}
              </Title>
            </div>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-content">
            <div className="stat-icon orange">
              <ClockCircleOutlined />
            </div>
            <div className="stat-info">
              <Text className="stat-label">Số nhiệm vụ chưa hoàn thành</Text>
              <Title level={3} className="stat-number">
                0
              </Title>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="content-grid">
        {/* Recent Activity */}
        <Card className="activity-card">
          <div className="card-header">
            <Title level={4}>Hoạt động gần đây</Title>
            <MoreOutlined className="more-icon" />
          </div>
          <div className="user-activity">
            <div className="user-info">
              <Avatar icon={<UserOutlined />} />
              <Text strong>Htahis Thân</Text>
            </div>
            <Button type="link" className="view-all-btn">
              Xem tất cả
            </Button>
          </div>
          <div className="activity-files">
            {recentFiles.length > 0 ? (
              recentFiles.map((file) => (
                <div 
                  key={file.id} 
                  className="file-item"
                  onClick={() => handleFileAction(file)}
                  style={{ cursor: 'pointer' }}
                  title={`${file.name} (${formatFileSize(file.size)})`}
                >
                  <div className="file-icon">
                    {getFileIcon(file.type)}
                  </div>
                  <Text className="file-name" ellipsis>
                    {file.name.length > 12 ? `${file.name.substring(0, 12)}...` : file.name}
                  </Text>
                </div>
              ))
            ) : (
              <div className="no-files">
                <Text type="secondary">Chưa có file nào được tìm thấy ({Object.keys(localStorage).length} items in localStorage)</Text>
              </div>
            )}
          </div>
        </Card>

        {/* Projects */}
        <Card className="projects-card">
          <div className="card-header">
            <Title level={4}>Dự án</Title>
            <MoreOutlined className="more-icon" />
          </div>
          <div className="project-list">
            {loading ? (
              <div style={{ textAlign: "center", padding: "20px" }}>
                <Spin size="large" />
              </div>
            ) : allWorkSpaceUser.length > 0 ? (
              allWorkSpaceUser.map((workspace) => (
                <div key={workspace.id} className="project-item">
                  <div className="project-info">
                    <div className="project-icon">📁</div>
                    <div>
                      <Text strong>{workspace.name}</Text>
                      <div className="project-time">
                        {workspace.status === "PENDING"
                          ? "Đang thực hiện"
                          : workspace.status === "COMPLETED"
                          ? "Hoàn thành"
                          : workspace.status}
                      </div>
                    </div>
                  </div>
                  <div className="project-status">
                    <span
                      className={`status-badge ${
                        workspace.status === "COMPLETED"
                          ? "completed"
                          : "ongoing"
                      }`}
                    >
                      {workspace.progress}%
                    </span>
                    <Progress
                      percent={workspace.progress}
                      showInfo={false}
                      strokeColor={
                        workspace.progress === 100 ? "#52c41a" : "#FF8C00"
                      }
                      className="project-progress"
                    />
                  </div>
                </div>
              ))
            ) : (
              <div
                style={{ textAlign: "center", padding: "20px", color: "#999" }}
              >
                <Text>Chưa có dự án nào</Text>
              </div>
            )}
          </div>
          <div className="card-footer">
            <Button onClick={() => onNavigateToProjects()} type="primary" className="view-all-projects">
              Xem tất cả
            </Button>
          </div>
        </Card>

        {/* Tasks To Complete */}
        <Card className="tasks-card">
          <div className="card-header">
            <Title level={4}>Nhiệm vụ cần hoàn thành</Title>
            <MoreOutlined className="more-icon" />
          </div>
          <div className="tasks-header">
            <Text className="task-col-header">Tên nhiệm vụ</Text>
            <Text className="task-col-header">Dự án</Text>
            <Text className="task-col-header">Mức độ</Text>
            <Text className="task-col-header">Hạn chót</Text>
          </div>
          
          <div className="tasks-list">
            {loading ? (
              <div style={{ textAlign: "center", padding: "20px" }}>
                <Spin size="large" />
              </div>
            ) : top5TaskUnCompleted.length > 0 ? (
              top5TaskUnCompleted.map((task, index) => (
                <div key={index} className="task-item">
                  <Text className="task-name" strong>{task.taskTitle}</Text>
                  <Text className="task-project">{task.workspaceName}</Text>
                  <span className="task-priority medium">Medium</span>
                  <Text className="task-due-date">
                    {dayjs(task.dueDate).format("DD/MM/YYYY")}
                  </Text>
                </div>
              ))
            ) : (
              <div style={{ textAlign: "center", padding: "20px", color: "#999" }}>
                <Text>Không có nhiệm vụ nào cần hoàn thành</Text>
              </div>
            )}
          </div>

          <div className="card-footer">
            <Button onClick={() => onNavigateToProjects()} type="primary" className="view-all-tasks">
              Xem tất cả
            </Button>
          </div>
        </Card>

        {/* Pomodoro Widget */}
        <PomodoroWidget onOpenFullTimer={() => setPomodoroVisible(true)} />

       
      </div>

      {/* Pomodoro Timer Modal */}
      <PomodoroTimer
        visible={pomodoroVisible}
        onClose={() => setPomodoroVisible(false)}
      />

      {/* File Detail Modal */}
      <Modal
        title="Chi tiết file"
        visible={fileDetailVisible}
        onCancel={closeFileDetail}
        footer={[
          <Button key="close" onClick={closeFileDetail}>
            Đóng
          </Button>,
          selectedFile && canPreviewFile(selectedFile) && (
            <Button key="preview" onClick={() => previewFile(selectedFile)}>
              Xem trước
            </Button>
          ),
          selectedFile && (
            <Button key="download" type="primary" onClick={() => downloadFile(selectedFile)}>
              {selectedFile?.url ? 'Mở file' : 'Tải xuống'}
            </Button>
          )
        ]}
        width={600}
      >
        {selectedFile && (
          <div className="file-detail-content">
            <div className="file-info">
              <div className="file-icon-large">
                {getFileIcon(selectedFile.type)}
              </div>
              <div className="file-details">
                <h3>{selectedFile.name}</h3>
                <p><strong>Loại file:</strong> {selectedFile.type}</p>
                <p><strong>Kích thước:</strong> {formatFileSize(selectedFile.size)}</p>
                <p><strong>Ngày tải lên:</strong> {dayjs(selectedFile.uploadedAt).format("DD/MM/YYYY HH:mm")}</p>
                <p><strong>Trạng thái:</strong> 
                  <span style={{ color: selectedFile.url ? '#52c41a' : '#f5a623', marginLeft: '8px' }}>
                    {selectedFile.url ? 'Có thể truy cập online' : 'Lưu trữ cục bộ'}
                  </span>
                </p>
                {selectedFile.url && (
                  <p><strong>URL:</strong> <a href={selectedFile.url} target="_blank" rel="noopener noreferrer">Xem file</a></p>
                )}
                {!selectedFile.url && (
                  <p style={{ color: '#666', fontSize: '12px', fontStyle: 'italic' }}>
                    File được lưu trữ trong localStorage. Bạn có thể tải xuống hoặc xem trước (nếu hỗ trợ).
                  </p>
                )}
                {selectedFile.taskId && (
                  <p><strong>Task ID:</strong> {selectedFile.taskId}</p>
                )}
                {selectedFile.projectId && (
                  <p><strong>Project ID:</strong> {selectedFile.projectId}</p>
                )}
                {selectedFile.workspaceId && (
                  <p><strong>Workspace ID:</strong> {selectedFile.workspaceId}</p>
                )}
                {selectedFile && canPreviewFile(selectedFile) && (
                  <p style={{ color: '#1890ff', fontSize: '12px', fontStyle: 'italic' }}>
                    ✓ File này có thể xem trước
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StatisticOwn;
