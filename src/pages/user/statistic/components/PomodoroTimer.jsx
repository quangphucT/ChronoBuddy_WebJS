import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Progress, Typography, Select, InputNumber, notification, Space, Divider } from 'antd';
import { 
  PlayCircleOutlined, 
  PauseCircleOutlined, 
  ReloadOutlined,
  SettingOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CoffeeOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import './PomodoroTimer.scss';

const { Title, Text } = Typography;
const { Option } = Select;

const PomodoroTimer = ({ visible, onClose }) => {
  // Timer states
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [currentSession, setCurrentSession] = useState('work'); // 'work', 'short', 'long'
  const [completedSessions, setCompletedSessions] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);
  
  // Settings
  const [settings, setSettings] = useState({
    workTime: 25,
    shortBreak: 5,
    longBreak: 15,
    sessionsBeforeLongBreak: 4,
    autoStartBreaks: true,
    notifications: true,
    sounds: true
  });

  // UI states
  const [showSettings, setShowSettings] = useState(false);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  // Session configurations - moved to useMemo to avoid dependency issues
  const sessionConfig = React.useMemo(() => ({
    work: {
      time: settings.workTime * 60,
      title: 'Làm việc tập trung',
      color: '#ff6b35',
      icon: <ClockCircleOutlined />,
      nextSession: completedSessions % settings.sessionsBeforeLongBreak === settings.sessionsBeforeLongBreak - 1 ? 'long' : 'short'
    },
    short: {
      time: settings.shortBreak * 60,
      title: 'Nghỉ ngắn',
      color: '#52c41a',
      icon: <CoffeeOutlined />,
      nextSession: 'work'
    },
    long: {
      time: settings.longBreak * 60,
      title: 'Nghỉ dài',
      color: '#1890ff',
      icon: <CoffeeOutlined />,
      nextSession: 'work'
    }
  }), [settings.workTime, settings.shortBreak, settings.longBreak, completedSessions, settings.sessionsBeforeLongBreak]);

  // Initialize timer when session changes
  useEffect(() => {
    const config = sessionConfig[currentSession];
    setTimeLeft(config.time);
    setIsRunning(false);
  }, [currentSession, sessionConfig]);

  // Handle session completion
  const handleSessionComplete = React.useCallback(() => {
    setIsRunning(false);
    
    if (currentSession === 'work') {
      setCompletedSessions(prev => prev + 1);
      setTotalSessions(prev => prev + 1);
    }

    // Show notification
    if (settings.notifications) {
      const config = sessionConfig[currentSession];
      notification.success({
        message: 'Phiên hoàn thành!',
        description: `${config.title} đã kết thúc. Chuyển sang phiên tiếp theo.`,
        icon: <CheckCircleOutlined style={{ color: config.color }} />,
        duration: 4,
      });
    }

    // Play sound
    if (settings.sounds && audioRef.current) {
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    }

    // Auto start next session
    if (settings.autoStartBreaks) {
      setTimeout(() => {
        setCurrentSession(sessionConfig[currentSession].nextSession);
      }, 2000);
    }
  }, [currentSession, settings.notifications, settings.sounds, settings.autoStartBreaks, sessionConfig]);

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSessionComplete();
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft, handleSessionComplete]);

  // Control functions
  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(sessionConfig[currentSession].time);
  };

  const handleSessionChange = (session) => {
    setCurrentSession(session);
    setIsRunning(false);
  };

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const getProgress = () => {
    const total = sessionConfig[currentSession].time;
    return ((total - timeLeft) / total) * 100;
  };

  // Settings handlers
  const handleSettingsChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetStats = () => {
    setCompletedSessions(0);
    setTotalSessions(0);
    notification.info({
      message: 'Đã reset thống kê',
      description: 'Tất cả số liệu đã được đặt lại về 0.',
    });
  };

  const currentConfig = sessionConfig[currentSession];

  return (
    <>
      <Modal
        title={
          <div className="pomodoro-modal-header">
            <Space>
              {currentConfig.icon}
              <span>Pomodoro Timer - {currentConfig.title}</span>
            </Space>
          </div>
        }
        open={visible}
        onCancel={onClose}
        footer={null}
        width={500}
        className="pomodoro-modal"
        centered
      >
        <div className="pomodoro-container">
          {/* Timer Display */}
          <div className="timer-display">
            <Progress
              type="circle"
              percent={getProgress()}
              format={() => formatTime(timeLeft)}
              size={200}
              strokeColor={currentConfig.color}
              strokeWidth={6}
              className="timer-progress"
            />
          </div>

          {/* Session Info */}
          <div className="session-info">
            <Title level={4} style={{ color: currentConfig.color, margin: '16px 0 8px 0' }}>
              {currentConfig.title}
            </Title>
            <Text type="secondary">
              {currentSession === 'work' ? 'Tập trung làm việc!' : 'Thời gian nghỉ ngơi'}
            </Text>
          </div>

          {/* Controls */}
          <div className="timer-controls">
            <Space size="large">
              {!isRunning ? (
                <Button
                  type="primary"
                  size="large"
                  icon={<PlayCircleOutlined />}
                  onClick={handleStart}
                  style={{ backgroundColor: currentConfig.color, borderColor: currentConfig.color }}
                >
                  Bắt đầu
                </Button>
              ) : (
                <Button
                  size="large"
                  icon={<PauseCircleOutlined />}
                  onClick={handlePause}
                >
                  Tạm dừng
                </Button>
              )}
              
              <Button
                size="large"
                icon={<ReloadOutlined />}
                onClick={handleReset}
              >
                Đặt lại
              </Button>

              <Button
                size="large"
                icon={<SettingOutlined />}
                onClick={() => setShowSettings(!showSettings)}
              >
                Cài đặt
              </Button>
            </Space>
          </div>

          {/* Session Selector */}
          <div className="session-selector">
            <Space>
              <Button
                type={currentSession === 'work' ? 'primary' : 'default'}
                onClick={() => handleSessionChange('work')}
                style={currentSession === 'work' ? { backgroundColor: '#ff6b35', borderColor: '#ff6b35' } : {}}
              >
                Làm việc
              </Button>
              <Button
                type={currentSession === 'short' ? 'primary' : 'default'}
                onClick={() => handleSessionChange('short')}
                style={currentSession === 'short' ? { backgroundColor: '#52c41a', borderColor: '#52c41a' } : {}}
              >
                Nghỉ ngắn
              </Button>
              <Button
                type={currentSession === 'long' ? 'primary' : 'default'}
                onClick={() => handleSessionChange('long')}
                style={currentSession === 'long' ? { backgroundColor: '#1890ff', borderColor: '#1890ff' } : {}}
              >
                Nghỉ dài
              </Button>
            </Space>
          </div>

          {/* Statistics */}
          <div className="pomodoro-stats">
            <Space split={<Divider type="vertical" />} size="large">
              <div className="stat-item">
                <TrophyOutlined style={{ color: '#faad14', fontSize: 20 }} />
                <div>
                  <Text strong>{completedSessions}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>Hoàn thành</Text>
                </div>
              </div>
              <div className="stat-item">
                <ClockCircleOutlined style={{ color: '#722ed1', fontSize: 20 }} />
                <div>
                  <Text strong>{totalSessions}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>Tổng phiên</Text>
                </div>
              </div>
              <div className="stat-item">
                <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 20 }} />
                <div>
                  <Text strong>{Math.round((completedSessions / Math.max(totalSessions, 1)) * 100)}%</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>Hiệu suất</Text>
                </div>
              </div>
            </Space>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="settings-panel">
              <Divider>Cài đặt thời gian</Divider>
              
              <div className="settings-grid">
                <div className="setting-item">
                  <Text>Thời gian làm việc (phút):</Text>
                  <InputNumber
                    min={1}
                    max={60}
                    value={settings.workTime}
                    onChange={(value) => handleSettingsChange('workTime', value)}
                  />
                </div>
                
                <div className="setting-item">
                  <Text>Nghỉ ngắn (phút):</Text>
                  <InputNumber
                    min={1}
                    max={30}
                    value={settings.shortBreak}
                    onChange={(value) => handleSettingsChange('shortBreak', value)}
                  />
                </div>
                
                <div className="setting-item">
                  <Text>Nghỉ dài (phút):</Text>
                  <InputNumber
                    min={5}
                    max={60}
                    value={settings.longBreak}
                    onChange={(value) => handleSettingsChange('longBreak', value)}
                  />
                </div>
                
                <div className="setting-item">
                  <Text>Phiên trước nghỉ dài:</Text>
                  <InputNumber
                    min={2}
                    max={10}
                    value={settings.sessionsBeforeLongBreak}
                    onChange={(value) => handleSettingsChange('sessionsBeforeLongBreak', value)}
                  />
                </div>
              </div>

              <Divider>Tùy chọn khác</Divider>
              
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button
                  type={settings.autoStartBreaks ? 'primary' : 'default'}
                  onClick={() => handleSettingsChange('autoStartBreaks', !settings.autoStartBreaks)}
                  style={{ width: '100%' }}
                >
                  Tự động bắt đầu nghỉ: {settings.autoStartBreaks ? 'BẬT' : 'TẮT'}
                </Button>
                
                <Button
                  type={settings.notifications ? 'primary' : 'default'}
                  onClick={() => handleSettingsChange('notifications', !settings.notifications)}
                  style={{ width: '100%' }}
                >
                  Thông báo: {settings.notifications ? 'BẬT' : 'TẮT'}
                </Button>
                
                <Button
                  type={settings.sounds ? 'primary' : 'default'}
                  onClick={() => handleSettingsChange('sounds', !settings.sounds)}
                  style={{ width: '100%' }}
                >
                  Âm thanh: {settings.sounds ? 'BẬT' : 'TẮT'}
                </Button>

                <Button danger onClick={resetStats} style={{ width: '100%' }}>
                  Reset thống kê
                </Button>
              </Space>
            </div>
          )}
        </div>
      </Modal>

      {/* Audio for notifications */}
      <audio
        ref={audioRef}
        preload="auto"
        src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmkjBSiJ2u+/+aMkNnfH8N2QQAoUXrTp66hVFApGn+DyvmkjBSiJ2u+//oSKhWxdX3SYr6yQYTY1YKHQuqthHAY/mtvyw3IlBSyBzvLYiTcIGWi77eqfTRAMU6fj8LRhGgU0htHy0no= "
      />
    </>
  );
};

export default PomodoroTimer;
