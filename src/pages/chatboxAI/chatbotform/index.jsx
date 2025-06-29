import { useEffect, useRef, useState } from "react";
import ChatbotIcon from "../../../components/ChatbotIcon";
import "./index.scss";
import Chatform from "../chatform";
import { generateBotResponse } from "../../../service/generateBotResponse";
import mammoth from "mammoth";

const ChatBox = () => {
  const bottomRef = useRef(null); 
  const [message, setMessage] = useState("");
  const [uploadedFileContent, setUploadedFileContent] = useState("");
  const [fileAwaitingPrompt, setFileAwaitingPrompt] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hey there 👋\nHow can I help you today?",
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    }
  ]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const newMessages = [...messages, { 
      sender: "user", 
      text: message, 
      timestamp 
    }];
    setMessages(newMessages);
    setMessage("");
    setIsTyping(true);

    let botReplyText;

    try {
      if (fileAwaitingPrompt) {
        // Trường hợp người dùng vừa gửi file xong và gõ yêu cầu
        botReplyText = await generateBotResponse([
          ...newMessages,
          {
            sender: "user",
            text: `Dưới đây là nội dung file:\n${uploadedFileContent}\n\nYêu cầu của tôi: ${message}`,
          },
        ]);
        setFileAwaitingPrompt(false);
        setUploadedFileContent("");
      } else {
        // Trường hợp bình thường
        botReplyText = await generateBotResponse(newMessages);
      }

      setMessages((prev) => [
        ...prev,
        { 
          sender: "bot", 
          text: botReplyText,
          timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        },
      ]);
    } catch (err) {
      console.error('Error generating bot response:', err);
      setMessages((prev) => [
        ...prev,
        { 
          sender: "bot", 
          text: "Sorry, I encountered an error. Please try again.",
          timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Mỗi khi messages thay đổi → cuộn xuống cuối
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleUploadFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    setMessages((prev) => [
      ...prev,
      { 
        sender: "user", 
        text: `📎 Đã gửi file: ${file.name}`,
        timestamp 
      },
      { 
        sender: "bot", 
        text: "File đã nhận. Vui lòng nhập yêu cầu bạn muốn xử lý từ file này 👇",
        timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      },
    ]);

    if (file.name.endsWith(".docx")) {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      setUploadedFileContent(result.value);
      setFileAwaitingPrompt(true);
    } else if (file.name.endsWith(".txt")) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedFileContent(reader.result?.toString() || "");
        setFileAwaitingPrompt(true);
      };
      reader.readAsText(file);
    } else {
      setMessages((prev) => [
        ...prev,
        { 
          sender: "bot", 
          text: "❌ Chỉ hỗ trợ file .docx hoặc .txt",
          timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        },
      ]);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-wrapper">
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
            <button className="minimize-btn">
              <span className="material-symbols-rounded">keyboard_arrow_down</span>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="chat-body">
          <div className="messages-container">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.sender}-message`}>
                <div className="message-bubble">
                  <div className="message-text">{msg.text}</div>
                  <div className="message-time">{msg.timestamp}</div>
                </div>
              </div>
            ))}
            
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
            
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Footer */}
        <div className="chat-footer">
          <Chatform
            message={message}
            setMessage={setMessage}
            handleSendMessage={handleSendMessage}
            handleUploadFile={handleUploadFile}
            isTyping={isTyping}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
