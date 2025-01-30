import React, { useState, useRef, useEffect } from 'react';

const Chat = ({ isOpen, onClose, onSendMessage, messages }) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>Chat</h3>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.isLocal ? 'local' : 'remote'}`}>
            <div className="message-sender">{msg.sender}</div>
            <div className="message-content">{msg.content}</div>
            <div className="message-time">{msg.time}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="message-form">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
