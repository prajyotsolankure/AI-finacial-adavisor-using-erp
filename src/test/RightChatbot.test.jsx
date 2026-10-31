import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import RightChatbot from '../components/RightChatbot/RightChatbot';

describe('RightChatbot Component', () => {
  it('renders online status header with "AI Engine: Connected via Gemini + MongoDB"', () => {
    render(<RightChatbot activeContextId="finance" />);

    expect(screen.getByText('AI Engine: Connected via Gemini + MongoDB')).toBeInTheDocument();
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

    // Wait for response (handles either live backend response or fallback)
    await waitFor(() => {
      const matchedElements = screen.getAllByText((content, element) => {
        return Boolean(element?.textContent && /operating expenditures|query_operating_spend|Reconciled OPEX/i.test(element.textContent));
      });
      expect(matchedElements.length).toBeGreaterThan(0);
    }, { timeout: 4000 });
  });

  it('supports minimizing to rail and restoring back to normal view', () => {
    render(<RightChatbot activeContextId="finance" />);

    // Click minimize button
    const minimizeBtn = screen.getByRole('button', { name: /minimize chat/i });
    fireEvent.click(minimizeBtn);

    // Verify minimized state
    expect(screen.getByRole('button', { name: /expand ai advisor/i })).toBeInTheDocument();
    expect(screen.getByText('AI Financial Advisor')).toBeInTheDocument();

    // Click expand button
    const expandBtn = screen.getByRole('button', { name: /expand ai advisor/i });
    fireEvent.click(expandBtn);

    // Verify restored back to normal
    expect(screen.getByText('AI Engine: Connected via Gemini + MongoDB')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ask a question about your business data...')).toBeInTheDocument();
  });

  it('supports maximizing and restoring back to normal view', () => {
    const { container } = render(<RightChatbot activeContextId="finance" />);

    const chatbotElement = container.querySelector('#right-chatbot-column');
    expect(chatbotElement).toHaveClass('normal');

    // Click maximize button
    const maximizeBtn = screen.getByRole('button', { name: /maximize chat/i });
    fireEvent.click(maximizeBtn);

    expect(chatbotElement).toHaveClass('maximized');

    // Click restore button
    const restoreBtn = screen.getByRole('button', { name: /restore normal size/i });
    fireEvent.click(restoreBtn);

    expect(chatbotElement).toHaveClass('normal');
  });
});

