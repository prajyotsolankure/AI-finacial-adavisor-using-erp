import React, { useState } from 'react';
import './MiddleDashboard.css';
import MetricCards from './MetricCards';
import ChartCard from './ChartCard';
import DataTable from './DataTable';
import AllocationDonut from './AllocationDonut';
import VisualsTray, { AVAILABLE_VISUALS } from './VisualsTray';
import { RefreshCw, Filter, Plus, ArrowDown, LayoutDashboard } from 'lucide-react';

export default function MiddleDashboard({ activeContextData }) {
  // Power BI Canvas state: Visuals active on canvas
  const [activeVisualIds, setActiveVisualIds] = useState(['kpi', 'chart', 'table']);
  const [isDragOver, setIsDragOver] = useState(false);

  if (!activeContextData) return null;

  const handleAddVisual = (id) => {
    if (!activeVisualIds.includes(id)) {
      setActiveVisualIds((prev) => [...prev, id]);
    }
  };

  const handleRemoveVisual = (id) => {
    setActiveVisualIds((prev) => prev.filter((item) => item !== id));
  };

  const handleResetCanvas = () => {
    setActiveVisualIds([]);
  };

  const handleAddAll = () => {
    setActiveVisualIds(['kpi', 'chart', 'table']);
  };

  // Drag and drop handlers for Power BI Canvas
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    // Check if leaving canvas container
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const visualId = e.dataTransfer.getData('text/plain');
    if (visualId && AVAILABLE_VISUALS.some((v) => v.id === visualId)) {
      handleAddVisual(visualId);
    }
  };

  return (
    <main className="middle-dashboard" id="middle-dashboard-column">
      {/* 1. Header Bar */}
      <div className="dashboard-topbar">
        <div className="context-heading-area">
          <h2 className="context-main-title">
            {activeContextData.title}
          </h2>
          <span className="context-main-subtitle">
            {activeContextData.subtitle}
          </span>
        </div>

        <div className="topbar-quick-actions">
          <button className="topbar-pill-btn" title="Refresh Live ERP Feed">
            <RefreshCw size={12} />
            <span>Sync</span>
          </button>
          <button className="topbar-pill-btn" title="Filter timeframe">
            <Filter size={12} />
            <span>FY 2026</span>
          </button>
        </div>
      </div>

      {/* 2. Power BI Visuals Shelf: Drag items onto canvas to display */}
      <VisualsTray
        activeVisualIds={activeVisualIds}
        onAddVisual={handleAddVisual}
        onResetCanvas={handleResetCanvas}
        onAddAll={handleAddAll}
      />

      {/* 3. Power BI Interactive Canvas with Drag & Drop Zone */}
      <div
        className={`powerbi-canvas-workspace ${isDragOver ? 'drag-over' : ''}`}
        id="powerbi-canvas"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Render Only Dragged / Placed Visuals */}
        {activeVisualIds.includes('kpi') && (
          <MetricCards
            metrics={activeContextData.metrics}
            onRemove={() => handleRemoveVisual('kpi')}
          />
        )}

        {activeVisualIds.includes('chart') && (
          <ChartCard
            chartData={activeContextData.chart}
            onRemove={() => handleRemoveVisual('chart')}
          />
        )}

        {activeVisualIds.includes('breakdown') && (
          <AllocationDonut
            onRemove={() => handleRemoveVisual('breakdown')}
          />
        )}

        {activeVisualIds.includes('table') && (
          <DataTable
            tableData={activeContextData.tableData}
            activeContextName={activeContextData.name}
            onRemove={() => handleRemoveVisual('table')}
          />
        )}

        {/* Empty Canvas State (Displays when all visuals are removed or canvas cleared) */}
        {activeVisualIds.length === 0 && (
          <div className="canvas-empty-state">
            <div className="empty-state-icon-box">
              <LayoutDashboard size={28} className="empty-icon" />
            </div>
            <h3 className="empty-state-title">Power BI Canvas is Clean</h3>
            <p className="empty-state-desc">
              Drag visualizations from the shelf above and drop them here to render your custom report.
            </p>
            <div className="empty-quick-add-row">
              {AVAILABLE_VISUALS.map((item) => (
                <button
                  key={item.id}
                  className="empty-add-pill"
                  onClick={() => handleAddVisual(item.id)}
                >
                  <Plus size={11} />
                  <span>Add {item.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Drag Over Overlay Guide */}
        {isDragOver && (
          <div className="drop-target-guide">
            <ArrowDown size={18} className="guide-arrow animate-bounce" />
            <span className="guide-text">Drop visual to render on Power BI canvas</span>
          </div>
        )}
      </div>
    </main>
  );
}
