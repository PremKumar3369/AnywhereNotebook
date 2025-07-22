import React, { useState, useEffect, useRef } from 'react';
import styles from './AskAIChat.module.css';
import { FaPaperPlane, FaPaperclip, FaMicrophone, FaMoon, FaSun } from 'react-icons/fa';

export default function AskAIChat() {
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your AI assistant. How can I help you today?", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    document.body.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light');
  }, [messages, isDarkTheme]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage = { text: trimmed, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:5000/api/notes/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authdata': localStorage.getItem('token') || '',
        },
        body: JSON.stringify({ question: trimmed }),
      });

      const data = await response.json();
      const sorted = data.results.sort((a, b) => a.distance - b.distance);
const replyText = sorted.length > 0
  ? `📌 Top match:\n\n${sorted[0].content}`
  : "🤖 No matching notes found.";


      setMessages((prev) => [...prev, { text: replyText, sender: 'ai' }]);
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setMessages((prev) => [...prev, { text: "⚠️ Server error occurred.", sender: 'ai' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  const renderMessageText = (text) =>
    text.split('\n').map((line, idx) => <div key={idx}>{line}</div>);

  return (
    <div className={styles.askAiWrapper}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerTitle}>
            <h1>AI Assistant</h1>
            <div className={styles.botStatus}>
              <div className={styles.statusIndicator}></div>
              <span>Online</span>
            </div>
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
              className={`${styles.message} ${msg.sender === 'user' ? styles.userMessage : styles.botMessage}`}
            >
              <div className={styles.avatar}>{msg.sender === 'user' ? 'U' : 'AI'}</div>
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
              onChange={(e) => setInput(e.target.value)}
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
    </div>
  );
}
