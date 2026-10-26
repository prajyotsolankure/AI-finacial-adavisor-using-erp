import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';

describe('App 3-Section Dashboard Integration', () => {
  it('renders all three columns side-by-side', () => {
    const { container } = render(<App />);

    expect(container.querySelector('#left-sidebar-column')).toBeInTheDocument();
    expect(container.querySelector('#middle-dashboard-column')).toBeInTheDocument();
    expect(container.querySelector('#right-chatbot-column')).toBeInTheDocument();
  });

  it('switches dashboard context between Finance, Sales, and HR dynamically', () => {
    render(<App />);

    // Initially in Finance
    expect(screen.getByText('Financial Health & Treasury Overview')).toBeInTheDocument();
    expect(screen.getByText('$4,892,450')).toBeInTheDocument();

    // Click Sales button
    const salesBtn = screen.getByRole('tab', { name: /Sales/i });
    fireEvent.click(salesBtn);

    // Context changes to Sales
    expect(screen.getByText('Sales Performance & CRM Pipeline')).toBeInTheDocument();
    expect(screen.getByText('$18,420,000')).toBeInTheDocument();

    // Click HR button
    const hrBtn = screen.getByRole('tab', { name: /HR/i });
    fireEvent.click(hrBtn);

    // Context changes to HR
    expect(screen.getByText('Workforce & Human Capital Analytics')).toBeInTheDocument();
    expect(screen.getByText('28 Roles')).toBeInTheDocument();
  });
});
