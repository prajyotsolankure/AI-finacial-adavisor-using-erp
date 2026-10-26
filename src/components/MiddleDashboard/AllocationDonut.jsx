import React, { useState } from 'react';
import { PieChart as PieIcon, MoreHorizontal, X } from 'lucide-react';

export default function AllocationDonut({ onRemove }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const categories = [
    { label: 'Engineering & Product', percent: 42, amount: '$520.8k', color: '#207bff' },
    { label: 'Sales & Marketing', percent: 28, amount: '$347.2k', color: '#0f1e33' },
    { label: 'Cloud Infrastructure', percent: 18, amount: '$223.2k', color: '#334b6e' },
    { label: 'Operations & Admin', percent: 12, amount: '$148.8k', color: '#94a3b8' },
  ];

  // Calculate SVG stroke dashes for a 100-circumference circle (r = 15.9155)
  const radius = 35;
  const circumference = 2 * Math.PI * radius; // ~219.91

  let accumulatedPercent = 0;

  return (
    <div className="card-container donut-card" id="allocation-donut-card">
      <div className="card-drag-header">
        <div className="card-header-left">
          <PieIcon size={14} className="visual-header-icon" />
          <h3 className="visual-title">Budget Allocation by Cost Center</h3>
        </div>
        <div className="card-header-right">
          <span className="visual-type-tag">Power BI Donut</span>
          {onRemove && (
            <button className="visual-remove-btn" onClick={onRemove} title="Remove visual from canvas">
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      <div className="donut-content-layout">
        {/* SVG Donut */}
        <div className="donut-svg-wrapper">
          <svg viewBox="0 0 100 100" className="donut-svg">
            {categories.map((cat, idx) => {
              const strokeDasharray = `${(cat.percent / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
              accumulatedPercent += cat.percent;

              const isHovered = hoveredIdx === idx;

              return (
                <circle
                  key={cat.label}
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke={cat.color}
                  strokeWidth={isHovered ? "13" : "10"}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  style={{
                    transition: 'stroke-width 0.2s ease, opacity 0.2s ease',
                    opacity: hoveredIdx === null || isHovered ? 1 : 0.6,
                    cursor: 'pointer'
                  }}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              );
            })}
          </svg>
          <div className="donut-center-label">
            <span className="center-value font-mono font-bold">100%</span>
            <span className="center-sub">Allocated</span>
          </div>
        </div>

        {/* Legend */}
        <div className="donut-legend-grid">
          {categories.map((cat, idx) => (
            <div
              key={cat.label}
              className={`donut-legend-row ${hoveredIdx === idx ? 'active' : ''}`}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div className="legend-label-col">
                <span className="legend-swatch" style={{ backgroundColor: cat.color }} />
                <span className="legend-text">{cat.label}</span>
              </div>
              <div className="legend-val-col">
                <span className="legend-amount font-mono">{cat.amount}</span>
                <span className="legend-percent font-mono">({cat.percent}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
