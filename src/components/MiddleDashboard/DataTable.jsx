import React, { useState } from 'react';
import { Search, Download, CheckCircle2, Clock, ShieldCheck, ArrowUpDown, X } from 'lucide-react';

export default function DataTable({ tableData = [], activeContextName = 'Finance', onRemove }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = tableData.filter((row) => {
    const term = searchTerm.toLowerCase();
    return (
      row.entity.toLowerCase().includes(term) ||
      row.date.toLowerCase().includes(term) ||
      row.amount.toLowerCase().includes(term) ||
      row.status.toLowerCase().includes(term)
    );
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
      case 'Closed Won':
        return (
          <span className="table-status-pill approved">
            <CheckCircle2 size={11} /> {status}
          </span>
        );
      case 'Audited':
      case 'Verified':
        return (
          <span className="table-status-pill neutral">
            <ShieldCheck size={11} /> {status}
          </span>
        );
      case 'Processing':
      case 'In Review':
      case 'Pending':
      default:
        return (
          <span className="table-status-pill pending">
            <Clock size={11} /> {status}
          </span>
        );
    }
  };

  return (
    <div className="card-container data-table-card" id="data-preview-table-card">
      <div className="table-card-header">
        <div className="table-title-group">
          <h3 className="table-title">Recent Transactions ({activeContextName})</h3>
          <span className="table-subtitle">{filteredData.length} records</span>
        </div>

        <div className="table-actions">
          <div className="table-search-box">
            <Search size={12} className="search-icon" />
            <input
              type="text"
              placeholder="Filter transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="table-search-input"
            />
          </div>

          <button className="table-export-btn" title="Export CSV">
            <Download size={12} />
            <span>Export</span>
          </button>

          {onRemove && (
            <button className="visual-remove-btn" onClick={onRemove} title="Remove visual from canvas">
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      <div className="table-scroll-wrapper">
        <table className="erp-data-table">
          <thead>
            <tr>
              <th className="col-date">Date / Month <ArrowUpDown size={10} className="sort-icon" /></th>
              <th className="col-entity">Entity / Department</th>
              <th className="col-amount text-right">Amount</th>
              <th className="col-status text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((row) => (
                <tr key={row.id} className="table-row">
                  <td className="col-date font-mono">{row.date}</td>
                  <td className="col-entity font-medium">
                    {row.entity}
                  </td>
                  <td className="col-amount text-right font-mono font-semibold">
                    {row.amount}
                  </td>
                  <td className="col-status text-center">
                    {getStatusBadge(row.status)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="empty-table-state">
                  No matching records found for "{searchTerm}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
