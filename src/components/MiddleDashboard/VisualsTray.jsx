import React from 'react';
import { 
  GripVertical, 
  BarChart3, 
  LayoutGrid, 
  Table2, 
  PieChart, 
  Plus,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export const AVAILABLE_VISUALS = [
  {
    id: 'kpi',
    name: 'KPI Metric Cards',
    type: 'Cards',
    icon: <LayoutGrid size={14} />,
    desc: '4 Executive Metrics',
  },
  {
    id: 'chart',
    name: 'Trajectory Chart',
    type: 'Line / Bar',
    icon: <BarChart3 size={14} />,
    desc: 'FY2026 Interactive Chart',
  },
  {
    id: 'table',
    name: 'Ledger Table',
    type: 'Grid',
    icon: <Table2 size={14} />,
    desc: 'Audited Transactions',
  },
  {
    id: 'breakdown',
    name: 'Allocation Donut',
    type: 'Donut',
    icon: <PieChart size={14} />,
    desc: 'Budget Distribution',
  }
];

export default function VisualsTray({ 
  activeVisualIds, 
  onAddVisual, 
  onResetCanvas,
  onAddAll
}) {
  const handleDragStart = (e, visualId) => {
    e.dataTransfer.setData('text/plain', visualId);
    e.dataTransfer.effectAllowed = 'copyMove';
  };

  return (
    <div className="powerbi-tray-container" id="powerbi-visuals-shelf">
      <div className="tray-left">
        <div className="tray-badge">
          <Sparkles size={11} className="tray-sparkle" />
          <span>Power BI Visuals Shelf</span>
        </div>
        <span className="tray-hint">Drag visual to canvas to display:</span>
      </div>

      <div className="tray-items-shelf">
        {AVAILABLE_VISUALS.map((item) => {
          const isPlaced = activeVisualIds.includes(item.id);
          return (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStart(e, item.id)}
              className={`tray-draggable-chip ${isPlaced ? 'placed' : ''}`}
              title={isPlaced ? `${item.name} is on canvas. Drag to duplicate or reposition.` : `Drag ${item.name} onto canvas`}
              onClick={() => {
                if (!isPlaced) onAddVisual(item.id);
              }}
            >
              <GripVertical size={12} className="drag-handle-icon" />
              <span className="chip-icon">{item.icon}</span>
              <span className="chip-name">{item.name}</span>
              {!isPlaced ? (
                <Plus size={11} className="chip-add-icon" />
              ) : (
                <span className="chip-placed-dot" title="Active on canvas" />
              )}
            </div>
          );
        })}
      </div>

      <div className="tray-actions">
        <button 
          className="tray-action-btn"
          title="Restore standard Power BI layout"
          onClick={onAddAll}
        >
          Preset
        </button>
        <button 
          className="tray-action-btn reset"
          title="Clear canvas to drag from scratch"
          onClick={onResetCanvas}
        >
          <RotateCcw size={11} />
          Clear
        </button>
      </div>
    </div>
  );
}
