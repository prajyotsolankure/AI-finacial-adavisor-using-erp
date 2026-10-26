import React, { useState } from 'react';
import './App.css';
import LeftSidebar from './components/LeftSidebar/LeftSidebar';
import MiddleDashboard from './components/MiddleDashboard/MiddleDashboard';
import RightChatbot from './components/RightChatbot/RightChatbot';
import { ERP_CONTEXTS } from './data/mockData';

export default function App() {
  const [activeContextId, setActiveContextId] = useState('finance');

  const activeContextData = ERP_CONTEXTS[activeContextId] || ERP_CONTEXTS.finance;

  return (
    <div className="app-container" id="erp-ai-advisor-app">
      {/* 1. LEFT TOOLBAR COLUMN (Width: 15-20% of screen): Database context switcher */}
      <LeftSidebar
        activeContextId={activeContextId}
        onSelectContext={setActiveContextId}
        activeContextData={activeContextData}
      />

      {/* 2. MIDDLE DASHBOARD COLUMN (Width: 50-55% of screen): Primary data visualization panel */}
      <MiddleDashboard
        activeContextData={activeContextData}
      />

      {/* 3. RIGHT CHATBOT COLUMN (Width: 25-30% of screen): Conversational interface panel */}
      <RightChatbot
        activeContextId={activeContextId}
      />
    </div>
  );
}
