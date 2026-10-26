import React, { useState } from 'react';
import { BarChart3, LineChart as LineIcon, X } from 'lucide-react';

export default function ChartCard({ chartData, onRemove }) {
  const [chartType, setChartType] = useState('line'); // 'line' | 'bar'
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!chartData || !chartData.series) {
    return null;
  }

  const series = chartData.series;
  const maxVal = Math.max(...series.map(s => Math.max(s.primary, s.secondary, s.benchmark || 0))) * 1.15;
  
  // SVG coordinates calculations
  const svgWidth = 720;
  const svgHeight = 220;
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;
  
  const chartInnerWidth = svgWidth - paddingLeft - paddingRight;
  const chartInnerHeight = svgHeight - paddingTop - paddingBottom;

  const getX = (index) => paddingLeft + (index / (series.length - 1)) * chartInnerWidth;
  const getY = (val) => paddingTop + chartInnerHeight - (val / maxVal) * chartInnerHeight;

  // Generate SVG paths for Line chart
  const primaryPoints = series.map((s, idx) => ({ x: getX(idx), y: getY(s.primary) }));
  const secondaryPoints = series.map((s, idx) => ({ x: getX(idx), y: getY(s.secondary) }));

  const generateSmoothPath = (points) => {
    if (points.length === 0) return '';
    return points.reduce((acc, point, i, arr) => {
      if (i === 0) return `M ${point.x},${point.y}`;
      const prev = arr[i - 1];
      const cx = (prev.x + point.x) / 2;
      return `${acc} C ${cx},${prev.y} ${cx},${point.y} ${point.x},${point.y}`;
    }, '');
  };

  const primaryPath = generateSmoothPath(primaryPoints);
  const secondaryPath = generateSmoothPath(secondaryPoints);
  
  const primaryAreaPath = primaryPoints.length > 0 
    ? `${primaryPath} L ${primaryPoints[primaryPoints.length - 1].x},${paddingTop + chartInnerHeight} L ${primaryPoints[0].x},${paddingTop + chartInnerHeight} Z`
    : '';

  const hoveredItem = hoveredIndex !== null ? series[hoveredIndex] : null;

  return (
    <div className="card-container chart-card" id="interactive-chart-card">
      {/* Chart Top Header & Controls */}
      <div className="chart-header">
        <div className="chart-title-group">
          <h2 className="chart-title">{chartData.title}</h2>
          <span className="chart-subtitle">{chartData.unit}</span>
        </div>

        <div className="chart-controls">
          {/* Legend */}
          <div className="chart-legend">
            <div className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: '#207bff' }}></span>
              <span className="legend-text">{chartData.primaryLabel}</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: '#182a44' }}></span>
              <span className="legend-text">{chartData.secondaryLabel}</span>
            </div>
          </div>

          {/* Line / Bar Switcher */}
          <div className="chart-type-toggle">
            <button
              className={`toggle-btn ${chartType === 'line' ? 'active' : ''}`}
              onClick={() => setChartType('line')}
              title="Line Graph View"
            >
              <LineIcon size={13} />
              <span>Line</span>
            </button>
            <button
              className={`toggle-btn ${chartType === 'bar' ? 'active' : ''}`}
              onClick={() => setChartType('bar')}
              title="Bar Chart View"
            >
              <BarChart3 size={13} />
              <span>Bar</span>
            </button>
          </div>

          {onRemove && (
            <button className="visual-remove-btn" onClick={onRemove} title="Remove visual from canvas">
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Main Interactive SVG Chart Area */}
      <div className="chart-svg-container" onMouseLeave={() => setHoveredIndex(null)}>
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="chart-svg"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Subtle Minimal Primary Tint */}
            <linearGradient id="cleanAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#207bff" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#207bff" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = paddingTop + chartInnerHeight * ratio;
            const labelVal = Math.round(maxVal * (1 - ratio));
            return (
              <g key={i}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={svgWidth - paddingRight}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  fontSize="10"
                  fill="#94a3b8"
                  fontFamily="inherit"
                  fontWeight="400"
                >
                  {labelVal}
                </text>
              </g>
            );
          })}

          {/* Render Line Chart */}
          {chartType === 'line' && (
            <>
              {/* Very subtle Area */}
              <path d={primaryAreaPath} fill="url(#cleanAreaGrad)" />

              {/* Secondary Trend Line (Navy Blue) */}
              <path
                d={secondaryPath}
                fill="none"
                stroke="#182a44"
                strokeWidth="1.8"
                strokeDasharray="4 4"
                strokeLinecap="round"
                opacity="0.45"
              />

              {/* Primary Trend Line (#207bff clean stroke - Blue where important) */}
              <path
                d={primaryPath}
                fill="none"
                stroke="#207bff"
                strokeWidth="2.4"
                strokeLinecap="round"
              />

              {/* Points: discreet, only highlighted on hover */}
              {series.map((item, idx) => {
                const x = getX(idx);
                const y1 = getY(item.primary);
                const isHovered = hoveredIndex === idx;

                if (!isHovered) return null;

                return (
                  <g key={idx}>
                    <circle
                      cx={x}
                      cy={y1}
                      r={5}
                      fill="#ffffff"
                      stroke="#207bff"
                      strokeWidth={2}
                    />
                  </g>
                );
              })}
            </>
          )}

          {/* Render Bar Chart */}
          {chartType === 'bar' && (
            <>
              {series.map((item, idx) => {
                const groupWidth = chartInnerWidth / series.length;
                const barWidth = Math.min(12, groupWidth * 0.3);
                const centerX = paddingLeft + (idx + 0.5) * groupWidth;
                
                const h1 = (item.primary / maxVal) * chartInnerHeight;
                const h2 = (item.secondary / maxVal) * chartInnerHeight;
                
                const y1 = paddingTop + chartInnerHeight - h1;
                const y2 = paddingTop + chartInnerHeight - h2;
                
                const isHovered = hoveredIndex === idx;

                return (
                  <g key={idx} opacity={hoveredIndex === null || isHovered ? 1 : 0.45}>
                    {/* Secondary Bar (Navy Blue) */}
                    <rect
                      x={centerX - barWidth - 1}
                      y={y2}
                      width={barWidth}
                      height={h2}
                      rx="2"
                      fill="#182a44"
                      opacity="0.5"
                    />
                    {/* Primary Bar (#207bff - Blue where important) */}
                    <rect
                      x={centerX + 1}
                      y={y1}
                      width={barWidth}
                      height={h1}
                      rx="2"
                      fill="#207bff"
                    />
                  </g>
                );
              })}
            </>
          )}

          {/* X-Axis labels & Hit areas */}
          {series.map((item, idx) => {
            const x = chartType === 'line' 
              ? getX(idx) 
              : paddingLeft + (idx + 0.5) * (chartInnerWidth / series.length);
            const isHovered = hoveredIndex === idx;

            return (
              <g key={idx}>
                <text
                  x={x}
                  y={paddingTop + chartInnerHeight + 16}
                  textAnchor="middle"
                  fontSize="10.5"
                  fontWeight={isHovered ? '600' : '400'}
                  fill={isHovered ? '#0f172a' : '#94a3b8'}
                  fontFamily="inherit"
                >
                  {item.label}
                </text>

                {/* Subtle vertical hover guide */}
                {isHovered && (
                  <line
                    x1={x}
                    y1={paddingTop}
                    x2={x}
                    y2={paddingTop + chartInnerHeight}
                    stroke="#cbd5e1"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                )}

                {/* Transparent hover capture */}
                <rect
                  x={x - (chartInnerWidth / series.length) / 2}
                  y={paddingTop}
                  width={chartInnerWidth / series.length}
                  height={chartInnerHeight + 25}
                  fill="transparent"
                  cursor="pointer"
                  onMouseEnter={() => setHoveredIndex(idx)}
                />
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredItem && (
          <div
            className="chart-tooltip-popup"
            style={{
              left: `${Math.min(85, Math.max(15, (hoveredIndex / (series.length - 1)) * 100))}%`
            }}
          >
            <div className="tooltip-header">{hoveredItem.label} 2026</div>
            <div className="tooltip-row">
              <span className="tooltip-indicator" style={{ background: '#207bff' }}></span>
              <span className="tooltip-name">{chartData.primaryLabel}:</span>
              <span className="tooltip-value font-bold">{hoveredItem.primary}k</span>
            </div>
            <div className="tooltip-row">
              <span className="tooltip-indicator" style={{ background: '#94a3b8' }}></span>
              <span className="tooltip-name">{chartData.secondaryLabel}:</span>
              <span className="tooltip-value">{hoveredItem.secondary}k</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
