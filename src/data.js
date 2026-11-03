export const seedTransactions = [
  { id: 1, title: 'Salary', category: 'Income', date: '2026-11-01', amount: 3250, type: 'income', note: 'Monthly salary' },
  { id: 2, title: 'Rent', category: 'Housing', date: '2026-11-02', amount: 1100, type: 'expense' },
  { id: 3, title: 'Weekly groceries', category: 'Food', date: '2026-11-02', amount: 86.4, type: 'expense' },
  { id: 4, title: 'Train pass', category: 'Transport', date: '2026-11-03', amount: 74, type: 'expense' },
  { id: 5, title: 'Freelance project', category: 'Income', date: '2026-11-04', amount: 420, type: 'income' },
  { id: 6, title: 'Dinner out', category: 'Food', date: '2026-11-05', amount: 38.5, type: 'expense' },
  { id: 7, title: 'Streaming', category: 'Entertainment', date: '2026-11-06', amount: 12.99, type: 'expense' },
  { id: 8, title: 'Electricity', category: 'Bills', date: '2026-11-07', amount: 63, type: 'expense' },
  { id: 9, title: 'Gym membership', category: 'Health', date: '2026-11-08', amount: 29, type: 'expense' }
]
export const seedBudgets = [
  { id: 1, category: 'Food', limit: 350 },
  { id: 2, category: 'Transport', limit: 150 },
  { id: 3, category: 'Entertainment', limit: 100 },
  { id: 4, category: 'Bills', limit: 220 },
  { id: 5, category: 'Housing', limit: 1200 }
]
export const money = value => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(value)
