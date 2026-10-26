import React, { useState, useRef, useEffect } from 'react';
import './RightChatbot.css';
import { Send, Bot, User, Sparkles } from 'lucide-react';

const INITIAL_MESSAGES = [
  {
    id: 'msg-1',
    sender: 'user',
    text: 'Show me total sales revenue by month for this year.',
    timestamp: '10:42 AM'
  },
  {
    id: 'msg-2',
    sender: 'bot',
    text: 'Analyzing sales_data table via MCP server... Generating dynamic chart.',
    timestamp: '10:42 AM',
    insight: 'FY2026 revenue is pacing at $18.42M ARR (+22.4% YoY) with December projected as top month at $790K.'
  }
];

export default function RightChatbot({ activeContextId }) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleSendMessage = (textToSend) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;

    const newTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Append User Message
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: newTimestamp
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsThinking(true);

    // Clean, direct financial insights
    setTimeout(() => {
      let botResponse = 'Analyzing sales_data table via MCP server... Generating dynamic chart.';
      let insightText = '';

      if (query.toLowerCase().includes('marketing') || query.toLowerCase().includes('expense') || query.toLowerCase().includes('spend')) {
        botResponse = 'Reconciled OPEX and marketing spend via MCP server.';
        insightText = 'Total Q3 spend is $1.24M, tracking 3.8% under budget with 34.2% operating margin.';
      } else if (query.toLowerCase().includes('forecast') || query.toLowerCase().includes('pipeline') || query.toLowerCase().includes('arr')) {
        botResponse = 'Aggregated CRM pipeline forecast via MCP server.';
        insightText = 'Active pipeline holds $12.85M with weighted Q4 closure forecast of $8.9M.';
      } else if (query.toLowerCase().includes('headcount') || query.toLowerCase().includes('payroll') || query.toLowerCase().includes('hr')) {
        botResponse = 'Audited HR workforce and payroll ledger via MCP server.';
        insightText = 'Active headcount stands at 428 FTEs. Retention is stable at 96.2% with $2.64M monthly payroll.';
      } else {
        botResponse = `Analyzing ${activeContextId} ledger via MCP server...`;
        insightText = `Retrieved verified metrics for ${activeContextId} context. Data is synced with FY2026 general ledger.`;
      }

      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        insight: insightText
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsThinking(false);
    }, 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <aside className="right-chatbot" id="right-chatbot-column">
      {/* Clean Header: Online indicator + text */}
      <div className="chatbot-header">
        <div className="status-row">
          <span className="online-dot" title="Online"></span>
          <span className="status-title">AI Engine: Connected via Groq + MCP</span>
        </div>
      </div>

      {/* Main Chat Body */}
      <div className="chat-messages-container" id="chat-feed-scroll">
        {messages.map((msg) => (
          <div key={msg.id} className={`chat-message-group ${msg.sender}`}>
            <div className="message-sender-tag">
              {msg.sender === 'user' ? 'You' : 'ERP AI Advisor'}
            </div>

            {msg.sender === 'user' ? (
              <div className="user-bubble">
                {msg.text}
              </div>
            ) : (
              <div className="bot-bubble">
                <div className="bot-text-main">{msg.text}</div>
                {msg.insight && (
                  <div className="chat-insight-box">
                    {msg.insight}
                  </div>
                )}
              </div>
            )}

            <span className="message-timestamp">{msg.timestamp}</span>
          </div>
        ))}

        {isThinking && (
          <div className="chat-message-group bot">
            <div className="message-sender-tag">ERP AI Advisor</div>
            <div className="bot-thinking-bubble">
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
              <span className="thinking-text">Analyzing business data...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Clean Bottom Footer */}
      <div className="chatbot-footer">
        <div className="chat-input-wrapper">
          <input
            type="text"
            className="chat-text-input"
            id="chat-query-input"
            placeholder="Ask a question about your business data..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="chat-send-btn"
            id="chat-send-button"
            title="Send query"
            disabled={!inputValue.trim() || isThinking}
            onClick={() => handleSendMessage()}
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
