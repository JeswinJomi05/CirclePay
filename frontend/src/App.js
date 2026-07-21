import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Topbar from './components/Topbar';
import BalanceCard from './components/BalanceCard';
import TransactionsList from './components/TransactionsList';
import ScanExpensesCard from './components/ScanExpensesCard';
import TopExpenses from './components/TopExpenses';
import ActiveDebtsCard from './components/ActiveDebtsCard';
import ExpensesPage from './components/ExpensesPage';
import GoalsPage from './components/GoalsPage';
import GroupsPage from './components/GroupsPage';

function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const handleViewAllTransactions = () => setActiveTab('Expense');

  return (
    <div className="app-wrapper">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="main-content">
        
        {activeTab === 'Dashboard' ? (
          <>
            <Topbar />
            <div className="dashboard-hero">
              <BalanceCard />
            </div>

            <div className="dashboard-content-grid">
              <TransactionsList onViewAll={handleViewAllTransactions} />
              <ScanExpensesCard />
              <ActiveDebtsCard />
              <TopExpenses />
            </div>
          </>
        ) : activeTab === 'Expense' ? (
          <ExpensesPage />
        ) : activeTab === 'Goals' ? (
          <GoalsPage />
        ) : activeTab === 'Groups' ? (
          <GroupsPage />
        ) : (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-secondary)', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', marginTop: '24px', border: '1px solid var(--border-color)' }}>
            <h2>{activeTab} Section</h2>
            <p style={{ marginTop: '8px', opacity: 0.8 }}>This view is currently under construction.</p>
          </div>
        )}
        
        <footer className="footer">
          <p>© 2024  Finance. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}

export default App;
