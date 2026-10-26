import React, { useState } from 'react';
import './LeftSidebar.css';
import { 
  Building2, 
  Landmark, 
  TrendingUp, 
  Users, 
  Database,
  ChevronRight,
  ChevronLeft,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';

export default function LeftSidebar({ 
  activeContextId, 
  onSelectContext, 
  activeContextData,
  defaultExpanded = false
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const navItems = [
    { 
      id: 'finance', 
      label: 'Finance', 
      icon: <Landmark size={18} strokeWidth={2} />,
    },
    { 
      id: 'sales', 
      label: 'Sales', 
      icon: <TrendingUp size={18} strokeWidth={2} />,
    },
    { 
      id: 'hr', 
      label: 'HR', 
      icon: <Users size={18} strokeWidth={2} />,
    },
  ];

  const handleItemClick = (id) => {
    onSelectContext(id);
    // When any item is clicked, expand the toolbar
    if (!isExpanded) {
      setIsExpanded(true);
    }
  };

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <aside 
      className={`left-sidebar ${isExpanded ? 'expanded' : 'collapsed-toolbar'}`} 
      id="left-sidebar-column"
      aria-expanded={isExpanded}
    >
      <div className="sidebar-top">
        {/* Brand Header / Compact Toolbar Toggle */}
        <div className="sidebar-brand-wrapper">
          <button 
            className="brand-icon-wrapper" 
            onClick={toggleExpand}
            title={isExpanded ? "Collapse to Toolbar" : "Expand Toolbar"}
            aria-label="Toggle Sidebar Navigation"
          >
            <Building2 size={18} strokeWidth={2.2} />
          </button>
          
          <div className="brand-info">
            <h1 className="brand-title">ERP AI Advisor</h1>
            <span className="brand-tag">Enterprise Intelligence</span>
          </div>

          <button 
            className="collapse-toggle-btn"
            onClick={toggleExpand}
            title={isExpanded ? "Collapse to Toolbar" : "Expand Toolbar"}
            aria-label={isExpanded ? "Collapse to Toolbar" : "Expand Toolbar"}
          >
            {isExpanded ? <PanelLeftClose size={14} /> : <PanelLeftOpen size={14} />}
          </button>
        </div>

        {/* Database Context Switcher Navigation */}
        <nav className="nav-section" aria-label="Database Context Switcher">
          <div className="nav-section-label">
            {isExpanded ? "Database Context" : "Context"}
          </div>
          
          <div className="nav-button-stack" role="tablist">
            {navItems.map((item) => {
              const isActive = activeContextId === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-btn-${item.id}`}
                  role="tab"
                  aria-selected={isActive}
                  aria-label={item.label}
                  className={`context-nav-btn ${isActive ? 'active' : ''}`}
                  onClick={() => handleItemClick(item.id)}
                  title={!isExpanded ? `${item.label} (Click to open & expand)` : item.label}
                >
                  <div className="btn-content-left">
                    <span className="btn-vector-icon" aria-hidden="true">
                      {item.icon}
                    </span>
                    <span className="context-label">{item.label}</span>
                  </div>

                  {isActive ? (
                    <span className="active-dot" aria-hidden="true" />
                  ) : (
                    <ChevronRight size={13} className="nav-arrow" />
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Footer Area */}
      <div className="sidebar-footer">
        <div className="schema-pill" title={`Active schema: ${activeContextData?.dbSchema || 'erp_default_v1'}`}>
          <Database size={13} className="schema-icon" />
          <span className="schema-name">{activeContextData?.dbSchema || 'erp_default_v1'}</span>
        </div>

        <div className="user-profile" title="Alex Mercer (CFO Office)">
          <div className="user-avatar" aria-label="User Avatar">AD</div>
          <div className="user-details">
            <span className="user-name">Alex Mercer</span>
            <span className="user-role">CFO Office</span>
          </div>
        </div>

        {/* Dedicated expand/collapse button for slim toolbar */}
        {!isExpanded && (
          <button 
            className="toolbar-expand-trigger" 
            onClick={toggleExpand}
            title="Expand Sidebar"
            aria-label="Expand Sidebar"
          >
            <ChevronRight size={14} />
          </button>
        )}
      </div>
    </aside>
  );
}
