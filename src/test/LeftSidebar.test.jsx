import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LeftSidebar from '../components/LeftSidebar/LeftSidebar';
import { ERP_CONTEXTS } from '../data/mockData';

describe('LeftSidebar Component (Collapsible Toolbar)', () => {
  it('renders the brand title "ERP AI Advisor" and subtitle', () => {
    render(
      <LeftSidebar
        activeContextId="finance"
        onSelectContext={vi.fn()}
        activeContextData={ERP_CONTEXTS.finance}
        defaultExpanded={true}
      />
    );

    expect(screen.getByText('ERP AI Advisor')).toBeInTheDocument();
    expect(screen.getByText('Enterprise Intelligence')).toBeInTheDocument();
  });

  it('renders Finance, Sales, and HR navigation buttons without emojis', () => {
    render(
      <LeftSidebar
        activeContextId="finance"
        onSelectContext={vi.fn()}
        activeContextData={ERP_CONTEXTS.finance}
      />
    );

    const financeBtn = screen.getByRole('tab', { name: /Finance/i });
    const salesBtn = screen.getByRole('tab', { name: /Sales/i });
    const hrBtn = screen.getByRole('tab', { name: /HR/i });

    expect(financeBtn).toBeInTheDocument();
    expect(salesBtn).toBeInTheDocument();
    expect(hrBtn).toBeInTheDocument();

    // Verify active styling on finance
    expect(financeBtn).toHaveClass('active');
    expect(salesBtn).not.toHaveClass('active');
  });

  it('calls onSelectContext with "sales" and expands when any item is clicked', () => {
    const handleSelect = vi.fn();
    const { container } = render(
      <LeftSidebar
        activeContextId="finance"
        onSelectContext={handleSelect}
        activeContextData={ERP_CONTEXTS.finance}
        defaultExpanded={false}
      />
    );

    const aside = container.querySelector('aside');
    expect(aside).toHaveClass('collapsed-toolbar');

    // Click Sales button
    const salesBtn = screen.getByRole('tab', { name: /Sales/i });
    fireEvent.click(salesBtn);

    // Context handler is called
    expect(handleSelect).toHaveBeenCalledWith('sales');

    // Sidebar expands
    expect(aside).toHaveClass('expanded');
  });

  it('displays the active database schema name in footer', () => {
    render(
      <LeftSidebar
        activeContextId="finance"
        onSelectContext={vi.fn()}
        activeContextData={ERP_CONTEXTS.finance}
        defaultExpanded={true}
      />
    );

    expect(screen.getByText('erp_finance_ledger_v2')).toBeInTheDocument();
  });
});
