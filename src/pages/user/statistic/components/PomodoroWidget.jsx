import React, { useState, useEffect } from 'react';
import { Card, Progress, Typography, Button, Space } from 'antd';
import { 
  PlayCircleOutlined, 
  PauseCircleOutlined, 
  ClockCircleOutlined,
  FireOutlined 
} from '@ant-design/icons';
import './PomodoroWidget.scss';

const { Text, Title } = Typography;

const PomodoroWidget = ({ onOpenFullTimer }) => {
  // Quick timer states (mini version)
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);

  useEffect(() => {
    let interval = null;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      setSessions(prev => prev + 1);
      setTimeLeft(25 * 60); // Reset to 25 minutes
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    return ((25 * 60 - timeLeft) / (25 * 60)) * 100;
  };

  const handleToggle = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(25 * 60);
  };

  return (
    <Card className="pomodoro-widget" bodyStyle={{ padding: '16px' }}>
      <div className="widget-header">
        <Space>
          <ClockCircleOutlined style={{ color: '#ff6b35', fontSize: 16 }} />
          <Title level={5} style={{ margin: 0, color: '#333' }}>
            Pomodoro
          </Title>
        </Space>
        <Button
          type="link"
          size="small"
          onClick={onOpenFullTimer}
          style={{ padding: 0, height: 'auto' }}
        >
          Mở rộng
        </Button>
      </div>

      <div className="timer-display-mini">
        <Progress
          type="circle"
          percent={getProgress()}
          format={() => formatTime(timeLeft)}
          size={80}
          strokeColor={isRunning ? '#ff6b35' : '#d9d9d9'}
          strokeWidth={8}
        />
      </div>

      <div className="timer-controls-mini">
        <Space>
          <Button
            type={isRunning ? 'default' : 'primary'}
            size="small"
            icon={isRunning ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
            onClick={handleToggle}
            style={!isRunning ? { backgroundColor: '#ff6b35', borderColor: '#ff6b35' } : {}}
          >
            {isRunning ? 'Tạm dừng' : 'Bắt đầu'}
          </Button>
          <Button size="small" onClick={handleReset}>
            Reset
          </Button>
        </Space>
      </div>

      <div className="session-count">
        <Space>
          <FireOutlined style={{ color: '#faad14' }} />
          <Text style={{ fontSize: 12, color: '#666' }}>
            {sessions} phiên hoàn thành
          </Text>
        </Space>
      </div>
    </Card>
  );
};

export default PomodoroWidget;
