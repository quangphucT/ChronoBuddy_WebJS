import { useState } from "react";
import ChatbotIcon from "../../../components/ChatbotIcon";
import "./index.scss";
import Chatform from "../chatform";
import QuickActions from "./components/QuickActions";
import MessageBubble from "./components/MessageBubble";
import { useChatbot } from "../../../hooks/useChatbot";
import { generateBotResponse } from "../../../service/generateBotResponse";
import mammoth from "mammoth";

const ChatBoxV2 = () => {
  const {
    messages,
    isTyping,
    setIsTyping,
    isMinimized,
    uploadedFile,
    fileAwaitingPrompt,
    messagesEndRef,
    addMessage,
    clearMessages,
    toggleMinimize,
    setFileContent,
    clearFile
  } = useChatbot();

  const [message, setMessage] = useState("");
  const [showQuickActions, setShowQuickActions] = useState(true);

  const handleSendMessage = async (messageText = message) => {
    if (!messageText.trim() || isTyping) return;

    // Add user message
    addMessage({
      sender: "user",
      text: messageText
    });

    setMessage("");
    setIsTyping(true);
    setShowQuickActions(false);

    try {
      let botReplyText;
      const userMessages = [...messages, { sender: "user", text: messageText }];

      if (fileAwaitingPrompt && uploadedFile) {
        // Handle file processing
        botReplyText = await generateBotResponse([
          ...userMessages,
          {
            sender: "user",
            text: `Dưới đây là nội dung file:\n${uploadedFile.content}\n\nYêu cầu của tôi: ${messageText}`,
          },
        ]);
        clearFile();
      } else {
        // Normal conversation
        botReplyText = await generateBotResponse(userMessages);
      }

      addMessage({
        sender: "bot",
        text: botReplyText
      });
    } catch (err) {
      console.error('Error generating bot response:', err);
      addMessage({
        sender: "bot",
        text: "Sorry, I encountered an error. Please try again."
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleUploadFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    addMessage({
      sender: "user",
      text: `📎 Đã gửi file: ${file.name}`
    });

    addMessage({
      sender: "bot",
      text: "File đã nhận. Vui lòng nhập yêu cầu bạn muốn xử lý từ file này 👇"
    });

    try {
      let content = "";
      
      if (file.name.endsWith(".docx")) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        content = result.value;
      } else if (file.name.endsWith(".txt")) {
        content = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result?.toString() || "");
          reader.readAsText(file);
        });
      } else {
        addMessage({
          sender: "bot",
          text: "❌ Chỉ hỗ trợ file .docx hoặc .txt"
        });
        return;
      }

      setFileContent(file, content);
    } catch (error) {
      console.error('Error processing file:', error);
      addMessage({
        sender: "bot",
        text: "❌ Có lỗi xảy ra khi xử lý file"
      });
    }
  };

  const handleQuickAction = (prompt) => {
    handleSendMessage(prompt);
  };

  const handleCopyMessage = (message) => {
    // You can add a toast notification here
    console.log('Message copied:', message.text);
  };

  const handleDeleteMessage = (messageId) => {
    // Implementation for deleting messages if needed
    console.log('Delete message:', messageId);
  };

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear the chat history?')) {
      clearMessages();
      setShowQuickActions(true);
      setMessage("");
    }
  };

  return (
    <div className="chatbot-container">
      <div className={`chatbot-wrapper ${isMinimized ? 'minimized' : ''}`}>
        {/* Header */}
        <div className="chat-header">
          <div className="header-content">
            <div className="chatbot-icon">
              <ChatbotIcon />
            </div>
            <h2 className="header-title">Todo Assistant</h2>
            <div className="status-indicator"></div>
          </div>
          <div className="header-actions">
            {!isMinimized && (
              <button 
                className="minimize-btn"
                onClick={handleClearChat}
                title="Clear chat"
                style={{ marginRight: '0.5rem' }}
              >
                <span className="material-symbols-rounded">delete_sweep</span>
              </button>
            )}
            <button 
              className="minimize-btn"
              onClick={toggleMinimize}
              title={isMinimized ? "Maximize" : "Minimize"}
            >
              <span className="material-symbols-rounded">
                {isMinimized ? "keyboard_arrow_up" : "keyboard_arrow_down"}
              </span>
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Body */}
            <div className="chat-body">
              <div className="messages-container">
                {/* Quick Actions */}
                {showQuickActions && messages.length <= 1 && (
                  <QuickActions 
                    onActionClick={handleQuickAction}
                    isTyping={isTyping}
                  />
                )}

                {/* Messages */}
                {messages.map((msg) => (
                  <MessageBubble
                    key={msg.id}
                    message={msg}
                    onCopy={handleCopyMessage}
                    onDelete={handleDeleteMessage}
                  />
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="message bot-message">
                    <div className="typing-indicator">
                      <div className="typing-dots">
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                      </div>
                      <span className="typing-text">Assistant is typing...</span>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Footer */}
            <div className="chat-footer">
              <Chatform
                message={message}
                setMessage={setMessage}
                handleSendMessage={() => handleSendMessage()}
                handleUploadFile={handleUploadFile}
                isTyping={isTyping}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatBoxV2;
