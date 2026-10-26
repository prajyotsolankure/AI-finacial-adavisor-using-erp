import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MiddleDashboard from '../components/MiddleDashboard/MiddleDashboard';
import { ERP_CONTEXTS } from '../data/mockData';

describe('MiddleDashboard Component (Power BI Interactive Canvas)', () => {
  const financeData = ERP_CONTEXTS.finance;

  it('renders context title and all KPI metrics correctly', () => {
    render(<MiddleDashboard activeContextData={financeData} />);

    // Check title
    expect(screen.getByText(financeData.title)).toBeInTheDocument();

    // Check KPI metrics
    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    expect(screen.getByText('$4,892,450')).toBeInTheDocument();
    expect(screen.getByText('Monthly Spend')).toBeInTheDocument();
    expect(screen.getByText('$1,240,180')).toBeInTheDocument();
    expect(screen.getByText('Active Headcount')).toBeInTheDocument();
    expect(screen.getByText('428 FTEs')).toBeInTheDocument();
  });

  it('renders interactive chart controls and switches between Line and Bar views', () => {
    render(<MiddleDashboard activeContextData={financeData} />);

    const lineBtn = screen.getByRole('button', { name: /line/i });
    const barBtn = screen.getByRole('button', { name: /bar/i });

    expect(lineBtn).toBeInTheDocument();
    expect(barBtn).toBeInTheDocument();
    expect(lineBtn).toHaveClass('active');

    // Switch to Bar view
    fireEvent.click(barBtn);
    expect(barBtn).toHaveClass('active');
    expect(lineBtn).not.toHaveClass('active');
  });

  it('renders the data preview table with Date/Month, Entity, Amount, Status columns', () => {
    render(<MiddleDashboard activeContextData={financeData} />);

    expect(screen.getByText(/Date \/ Month/i)).toBeInTheDocument();
    expect(screen.getByText(/Entity \/ Department/i)).toBeInTheDocument();
    expect(screen.getByText(/Amount/i)).toBeInTheDocument();
    expect(screen.getByText(/Status/i)).toBeInTheDocument();

    // Verify first row entity
    expect(screen.getByText('Apex Global Cloud Solutions')).toBeInTheDocument();
    expect(screen.getByText('$148,200.00')).toBeInTheDocument();
  });

  it('filters data table rows based on search input', () => {
    render(<MiddleDashboard activeContextData={financeData} />);

    const searchInput = screen.getByPlaceholderText(/Filter transactions.../i);
    expect(screen.getByText('Apex Global Cloud Solutions')).toBeInTheDocument();
    expect(screen.getByText('Starlight Media Enterprise')).toBeInTheDocument();

    // Search for Starlight
    fireEvent.change(searchInput, { target: { value: 'Starlight' } });

    expect(screen.getByText('Starlight Media Enterprise')).toBeInTheDocument();
    expect(screen.queryByText('Apex Global Cloud Solutions')).not.toBeInTheDocument();
  });

  it('supports Power BI canvas interactions: clearing, dragging, and displaying visuals only when added', () => {
    render(<MiddleDashboard activeContextData={financeData} />);

    // Check Power BI Visuals Shelf exists
    expect(screen.getByText('Power BI Visuals Shelf')).toBeInTheDocument();

    // Click Clear button to wipe canvas
    const clearBtn = screen.getByTitle(/Clear canvas to drag from scratch/i);
    fireEvent.click(clearBtn);

    // Canvas is now clean and empty
    expect(screen.getByText('Power BI Canvas is Clean')).toBeInTheDocument();
    expect(screen.queryByText('Total Revenue')).not.toBeInTheDocument();

    // Now drag / drop or add "KPI Metric Cards"
    const addKpiBtn = screen.getByRole('button', { name: /Add KPI Metric Cards/i });
    fireEvent.click(addKpiBtn);

    // Now only does it display!
    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    expect(screen.getByText('$4,892,450')).toBeInTheDocument();
  });
});
