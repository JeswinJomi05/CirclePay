import React from 'react';
import { CupSoda, Headphones, ShoppingBag, ChevronRight } from 'lucide-react';
import './TopExpenses.css';

const TopExpenses = () => {
  const expenses = [
    {
      name: 'Food',
      percentage: '48% of total',
      progress: 48,
      amount: '₹24,560',
      icon: CupSoda,
      color: '#09543D',
      bgLight: '#e6f0ed',
    },
    {
      name: 'Entertainment',
      percentage: '32% of total',
      progress: 32,
      amount: '₹24,560',
      icon: Headphones,
      color: '#3E63EC',
      bgLight: '#eff2fe',
    },
    {
      name: 'Shopping',
      percentage: '20% of total',
      progress: 20,
      amount: '₹24,560',
      icon: ShoppingBag,
      color: '#F59E0B',
      bgLight: '#fffbeb',
    },
  ];

  return (
    <div className="top-expenses-card">
      <div className="card-header">
        <h3 className="card-title">Top Expenses</h3>
        <a href="#expenses" className="view-all-link">View All</a>
      </div>

      <div className="expenses-list">
        {expenses.map((expense, index) => {
          const Icon = expense.icon;
          return (
            <div key={index} className="expense-item">
              <div 
                className="expense-icon-box" 
                style={{ backgroundColor: expense.bgLight, color: expense.color }}
              >
                <Icon size={20} />
              </div>
              
              <div className="expense-details">
                <div className="expense-meta-row">
                  <span className="expense-name">{expense.name}</span>
                  <span className="expense-percentage">{expense.percentage}</span>
                </div>
                <div className="progress-track">
                  <div 
                    className="progress-bar" 
                    style={{ 
                      width: `${expense.progress}%`, 
                      backgroundColor: expense.color 
                    }}
                  />
                </div>
              </div>

              <div className="expense-amount-wrapper">
                <span className="expense-value">{expense.amount}</span>
                <ChevronRight className="chevron-icon" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopExpenses;
