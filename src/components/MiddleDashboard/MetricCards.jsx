import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, CreditCard, Users, PieChart, X, LayoutGrid } from 'lucide-react';

export default function MetricCards({ metrics = [], onRemove }) {
  const getIcon = (id) => {
    switch (id) {
      case 'rev':
      case 'arr':
        return <DollarSign size={16} className="metric-icon" />;
      case 'spend':
      case 'closed':
      case 'payroll':
        return <CreditCard size={16} className="metric-icon" />;
      case 'headcount':
      case 'headcount_total':
        return <Users size={16} className="metric-icon" />;
      default:
        return <PieChart size={16} className="metric-icon" />;
    }
  };

  return (
    <div className="powerbi-visual-block" id="kpi-visual-block">
      {onRemove && (
        <div className="visual-block-header">
          <div className="visual-header-left">
            <LayoutGrid size={13} className="visual-header-icon" />
            <span className="visual-header-title">KPI Metric Cards</span>
          </div>
          <button className="visual-remove-btn" onClick={onRemove} title="Remove visual from canvas">
            <X size={12} />
          </button>
        </div>
      )}
      <div className="metric-cards-grid" id="kpi-cards-row">
        {metrics.map((metric) => (
          <div key={metric.id} className="card-container metric-card">
            <div className="metric-header">
              <span className="metric-title">{metric.title}</span>
              {getIcon(metric.id)}
            </div>
            
            <div className="metric-body">
              <div className="metric-value">{metric.value}</div>
              <div className="metric-footer-row">
                <span className={`metric-badge ${metric.isPositive ? 'positive' : 'negative'}`}>
                  {metric.isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                  {metric.change}
                </span>
                <span className="metric-subtext">{metric.subtext}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
