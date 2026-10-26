import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import RightChatbot from '../components/RightChatbot/RightChatbot';

describe('RightChatbot Component', () => {
  it('renders online status header with "AI Engine: Connected via Groq + MCP"', () => {
    render(<RightChatbot activeContextId="finance" />);

    expect(screen.getByText('AI Engine: Connected via Groq + MCP')).toBeInTheDocument();
  });

  it('renders initial required formatted dialogue sequence', () => {
    render(<RightChatbot activeContextId="finance" />);

    // Check user initial message
    expect(
      screen.getByText('Show me total sales revenue by month for this year.')
    ).toBeInTheDocument();

    // Check bot initial response
    expect(
      screen.getByText('Analyzing sales_data table via MCP server... Generating dynamic chart.')
    ).toBeInTheDocument();

    // Check clean insight summary
    expect(
      screen.getByText(/FY2026 revenue is pacing at \$18\.42M ARR/i)
    ).toBeInTheDocument();
  });

  it('renders the styled input placeholder and send button', () => {
    render(<RightChatbot activeContextId="finance" />);

    const input = screen.getByPlaceholderText('Ask a question about your business data...');
    const sendBtn = screen.getByRole('button', { name: /send query/i });

    expect(input).toBeInTheDocument();
    expect(sendBtn).toBeInTheDocument();
    expect(sendBtn).toBeDisabled(); // Disabled when empty
  });

  it('allows typing and sending a question, generating a clean bot response', async () => {
    render(<RightChatbot activeContextId="finance" />);

    const input = screen.getByPlaceholderText('Ask a question about your business data...');
    const sendBtn = screen.getByRole('button', { name: /send query/i });

    fireEvent.change(input, { target: { value: 'Breakdown Q3 marketing expenses' } });
    expect(sendBtn).not.toBeDisabled();

    fireEvent.click(sendBtn);

    // Verify user message appears
    expect(screen.getByText('Breakdown Q3 marketing expenses')).toBeInTheDocument();

    // Verify thinking indicator appears
    expect(screen.getByText(/Analyzing business data.../i)).toBeInTheDocument();

    // Wait for response
    await waitFor(() => {
      expect(
        screen.getByText(/Reconciled OPEX and marketing spend via MCP server/i)
      ).toBeInTheDocument();
    }, { timeout: 2000 });
  });
});
