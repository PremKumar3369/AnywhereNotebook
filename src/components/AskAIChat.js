// src/components/AskAIChat.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AskAIChat.module.css';
import { FaPaperPlane, FaPaperclip, FaMicrophone, FaMoon, FaSun } from 'react-icons/fa';

export default function AskAIChat() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your AI assistant. How can I help you today?", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const chatEndRef = useRef(null);
  const API_BASE = process.env.REACT_APP_API_BASE_URL;

  // 🔒 Check if logged in and fetch user info
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetch(`${API_BASE}/api/auth/getUserInfo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authdata': token
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          navigate('/login');
        } else {
          setUser(data);
        }
      })
      .catch(() => navigate('/login'));
  }, [navigate]);

 useEffect(() => {
  chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
}, [messages]);

  const handleSend = async (e) => {
    e.preventDefault(); 
    const trimmed = input.trim();
    if (!trimmed) return;

    setMessages(prev => [...prev, { text: trimmed, sender: 'user' }]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch(`${API_BASE}/api/notes/ask`,  {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authdata': localStorage.getItem('token') || ''
        },
        body: JSON.stringify({ question: trimmed })
      });
      const data = await res.json();
      const sorted = (data.results || []).sort((a, b) => a.distance - b.distance);
      const replyText = sorted.length
        ? `📌 Top match:\n\n${sorted[0].content}`
        : "🤖 No matching notes found.";
      setMessages(prev => [...prev, { text: replyText, sender: 'ai' }]);
    } catch {
      setMessages(prev => [...prev, { text: "⚠️ Server error occurred.", sender: 'ai' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = e => { if (e.key === 'Enter') handleSend(e); };

  const renderMessageText = text =>
    text.split('\n').map((line, i) => <div key={i}>{line}</div>);

  // ❗ If still loading user info, show a placeholder
  if (!user) {
    return <div className="loading-placeholder">Loading AI assistant...</div>;
  }

  return (
    // <div className={styles.askAiWrapper}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerTitle}>
            <h1>AI Assistant</h1>
            <div className={styles.botStatus}>
              <div className={styles.statusIndicator}></div>
              <span>Online</span>
            </div>
          </div>
          <div className={styles.userBanner}>
            {/* 👤 Optional: Display user info */}
            <span> <strong>{user.name}</strong></span>
          </div>
          <div className={styles.controls}>
            <button
              className={styles.themeToggle}
              onClick={() => setIsDarkTheme(!isDarkTheme)}
              aria-label="Toggle theme"
            >
              {isDarkTheme ? <FaSun /> : <FaMoon />}
            </button>
          </div>
        </header>

        <div className={styles.chatContainer}>
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`${styles.message} ${msg.sender === 'user'
                ? styles.userMessage : styles.botMessage}`}
            >
              <div className={styles.avatar}>{msg.sender === 'user' ? `${user.name}` : 'AI'}</div>
              <div className={styles.messageBubble}>
                {renderMessageText(msg.text)}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className={styles.typingIndicator}>
              <div className={styles.typingDots}>
                <div className={styles.typingDot}></div>
                <div className={styles.typingDot}></div>
                <div className={styles.typingDot}></div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className={styles.inputContainer}>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              className={styles.messageInput}
              placeholder="What notes did I write about topic?"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className={styles.actionButtons}>
              <button className={styles.actionButton}><FaPaperclip /></button>
              <button className={styles.actionButton}><FaMicrophone /></button>
              <button className={styles.sendButton} onClick={handleSend}>
                <span>Send</span> <FaPaperPlane />
              </button>
            </div>
          </div>
        </div>
      </div>
    // </div>
  );
}
