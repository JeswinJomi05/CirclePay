import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

test('renders the dashboard shell', () => {
  render(<App />);
  expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
});

test('opens the expense page when the recent transactions view all link is clicked', async () => {
  render(<App />);

  const recentTransactionsCard = screen.getByText(/recent transactions/i).closest('.transactions-card');
  await userEvent.click(within(recentTransactionsCard).getByRole('button', { name: /view all/i }));

  expect(await screen.findByText(/expense transactions/i)).toBeInTheDocument();
  expect(screen.getByText(/quick log expense/i)).toBeInTheDocument();
});
