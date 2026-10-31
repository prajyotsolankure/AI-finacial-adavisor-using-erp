import React, { useState, useEffect } from 'react';
import './App.css';
import LeftSidebar from './components/LeftSidebar/LeftSidebar';
import MiddleDashboard from './components/MiddleDashboard/MiddleDashboard';
import RightChatbot from './components/RightChatbot/RightChatbot';
import { ERP_CONTEXTS } from './data/mockData';

export default function App() {
  const [activeContextId, setActiveContextId] = useState('finance');
  const [activeContextData, setActiveContextData] = useState(
    ERP_CONTEXTS[activeContextId] || ERP_CONTEXTS.finance
  );

  useEffect(() => {
    // Set fallback initial context
    setActiveContextData(ERP_CONTEXTS[activeContextId] || ERP_CONTEXTS.finance);

    // Fetch real-time aggregated records directly from MongoDB Atlas backend
    let isMounted = true;
    fetch(`http://localhost:5000/api/context/${activeContextId}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success && data.context) {
          setActiveContextData(data.context);
        }
      })
      .catch(() => {
        // Fallback remains active if backend is unreachable
      });

    return () => {
      isMounted = false;
    };
  }, [activeContextId]);

  return (
    <div className="app-container" id="erp-ai-advisor-app">
      {/* 1. LEFT TOOLBAR COLUMN: Database context switcher */}
      <LeftSidebar
        activeContextId={activeContextId}
        onSelectContext={setActiveContextId}
        activeContextData={activeContextData}
      />

      {/* 2. MIDDLE DASHBOARD COLUMN: Real-time data visualization panel */}
      <MiddleDashboard
        activeContextData={activeContextData}
      />

      {/* 3. RIGHT CHATBOT COLUMN: Conversational interface panel with Gemini AI */}
      <RightChatbot
        activeContextId={activeContextId}
      />
    </div>
  );
}
