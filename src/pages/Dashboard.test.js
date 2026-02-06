import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from './Dashboard';
import '@testing-library/jest-dom';

global.fetch = jest.fn();

describe('Dashboard Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('clears all transactions and resets balance to zero', async () => {
  // FIX 1: Mock window.confirm so it doesn't crash the test
  // This simulates the user clicking "OK" on the popup
  window.confirm = jest.fn(() => true);

  // Mock fetch to return one transaction initially
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => [{ id: 1, description: 'Test', amount: 10, product: 'Current', startedDate: new Date().toISOString() }]
  });
  
  // Mock categories too (since your code calls resCat.json)
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => []
  });

  render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>
  );

  // Wait for loading to finish
  await waitFor(() => {
    expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
  });

  // Find the button (ensure the name matches your component text exactly)
  const clearButton = screen.getByRole('button', { name: /Clear All Data/i });

  // Setup the mock for the actual DELETE/CLEAR call
  fetch.mockResolvedValueOnce({ ok: true });
  // Setup the mock for the subsequent REFRESH fetch
  fetch.mockResolvedValue({ ok: true, json: async () => [] });

  fireEvent.click(clearButton);

  // FIX 2: Use getAllByText because £0.00 appears in multiple cards
  await waitFor(() => {
    const balanceElements = screen.getAllByText(/£0.00/i);
    expect(balanceElements.length).toBeGreaterThan(0);
    expect(balanceElements[0]).toBeInTheDocument();
  });
});

  test('shows "No Transactions" message when list is empty', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => []
    });

    // FIX: Wrap in MemoryRouter
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/no transactions found/i)).toBeInTheDocument();
    });
  });
});
