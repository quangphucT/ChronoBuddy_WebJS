import React, { useState } from 'react';

const MessageBubble = ({ message, onCopy, onDelete }) => {
  const [showActions, setShowActions] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    if (onCopy) onCopy(message);
  };

  const handleDelete = () => {
    if (onDelete) onDelete(message.id);
  };

  return (
    <div 
      className={`message ${message.sender}-message`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="message-bubble">
        <div className="message-text">{message.text}</div>
        <div className="message-footer">
          <div className="message-time">{message.timestamp}</div>
          {message.sender === 'user' && (
            <div className="message-status">
              <span className="status-icon sent">✓</span>
            </div>
          )}
        </div>
        
        {showActions && (
          <div className="message-actions">
            <button 
              className="action-btn copy-btn"
              onClick={handleCopy}
              title="Copy message"
            >
              <span className="material-symbols-rounded">content_copy</span>
            </button>
            {message.sender === 'user' && onDelete && (
              <button 
                className="action-btn delete-btn"
                onClick={handleDelete}
                title="Delete message"
              >
                <span className="material-symbols-rounded">delete</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
