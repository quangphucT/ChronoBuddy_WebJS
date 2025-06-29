const Chatform = ({ message, setMessage, handleSendMessage, handleUploadFile, isTyping }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isTyping) {
      handleSendMessage();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="chat-input-form">
      <input
        type="text"
        className="message-input"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={isTyping}
      />
      
      <div className="input-actions">
        <label className="file-upload-btn">
          <span className="material-symbols-rounded">attach_file</span>
          <input
            type="file"
            onChange={handleUploadFile}
            accept=".pdf,.txt,.docx"
            disabled={isTyping}
          />
        </label>

        {message.trim() && !isTyping && (
          <button
            type="submit"
            className="send-btn"
          >
            <span className="material-symbols-rounded">send</span>
          </button>
        )}
      </div>
    </form>
  );
};

export default Chatform;