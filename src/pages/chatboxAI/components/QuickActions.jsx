import React from 'react';

const QuickActions = ({ onActionClick, isTyping }) => {
  const quickActions = [
    {
      id: 'help',
      label: '❓ Help',
      prompt: 'How can you help me with my tasks?'
    },
    {
      id: 'create-task',
      label: '📝 Create Task',
      prompt: 'Help me create a new task'
    },
    {
      id: 'organize',
      label: '📋 Organize',
      prompt: 'Help me organize my existing tasks'
    },
    {
      id: 'deadline',
      label: '⏰ Deadlines',
      prompt: 'Show me my upcoming deadlines'
    },
    {
      id: 'productivity',
      label: '📈 Productivity',
      prompt: 'Give me productivity tips'
    }
  ];

  return (
    <div className="quick-actions">
      {quickActions.map((action) => (
        <button
          key={action.id}
          className="quick-action"
          onClick={() => onActionClick(action.prompt)}
          disabled={isTyping}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
