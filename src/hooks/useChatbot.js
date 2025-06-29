import { useState, useCallback, useRef, useEffect } from 'react';

export const useChatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: Date.now(),
      sender: "bot",
      text: "Hey there 👋\nHow can I help you today?",
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    }
  ]);
  
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileAwaitingPrompt, setFileAwaitingPrompt] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const addMessage = useCallback((message) => {
    const newMessage = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      ...message
    };
    
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, []);

  const updateLastMessage = useCallback((updates) => {
    setMessages(prev => {
      const updated = [...prev];
      if (updated.length > 0) {
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          ...updates
        };
      }
      return updated;
    });
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: Date.now(),
        sender: "bot",
        text: "Chat cleared. How can I help you?",
        timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      }
    ]);
  }, []);

  const toggleMinimize = useCallback(() => {
    setIsMinimized(prev => !prev);
  }, []);

  const setFileContent = useCallback((file, content) => {
    setUploadedFile({ file, content });
    setFileAwaitingPrompt(true);
  }, []);

  const clearFile = useCallback(() => {
    setUploadedFile(null);
    setFileAwaitingPrompt(false);
  }, []);

  return {
    messages,
    isTyping,
    setIsTyping,
    isMinimized,
    uploadedFile,
    fileAwaitingPrompt,
    messagesEndRef,
    addMessage,
    updateLastMessage,
    clearMessages,
    toggleMinimize,
    setFileContent,
    clearFile
  };
};
