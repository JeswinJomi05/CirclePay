import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import './TransactionsList.css';

const TransactionsList = ({ onViewAll }) => {

// Custom Merchant Logo Renderer
const MerchantLogo = ({ name }) => {
  switch (name) {
    case 'Swiggy':
      return (
        <div className="merchant-logo" style={{ backgroundColor: '#fc8019', color: 'white' }}>
          {/* Swiggy stylized 'S' inside logo */}
          <span style={{ fontSize: '13px', transform: 'skewX(-10deg)', fontWeight: 'bold' }}>S</span>
        </div>
      );
    case 'Salary Credit':
      return (
        <div className="merchant-logo" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
          {/* Landmark / Bank Icon representation */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="22" x2="21" y2="22"></line>
            <rect x="6" y="6" width="12" height="12"></rect>
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
          </svg>
        </div>
      );
    case 'Netflix':
      return (
        <div className="merchant-logo" style={{ backgroundColor: '#141414', color: '#e50914' }}>
          <span style={{ fontFamily: 'Impact, sans-serif', fontSize: '15px' }}>N</span>
        </div>
      );
    case 'Amazon':
      return (
        <div className="merchant-logo" style={{ backgroundColor: '#000000', color: 'white' }}>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: '13px', fontStyle: 'italic', fontWeight: 'bold', color: '#ff9900' }}>a</span>
        </div>
      );
    default:
      return (
        <div className="merchant-logo" style={{ backgroundColor: '#f1f5f9', color: '#64748b' }}>
          {name.charAt(0)}
        </div>
      );
  }
};

  const transactions = [
    {
      merchant: 'Swiggy',
      category: 'Food',
      categoryColor: '#09543D',
      type: 'Expense',
      amount: '-₹750',
      isIncome: false,
      date: 'May 15, 2024',
    },
    {
      merchant: 'Salary Credit',
      category: 'Income',
      categoryColor: '#09543D',
      type: 'Income',
      amount: '+₹24,560',
      isIncome: true,
      date: 'May 01, 2024',
    },
    {
      merchant: 'Netflix',
      category: 'Entertainment',
      categoryColor: '#3E63EC',
      type: 'Expense',
      amount: '-₹649',
      isIncome: false,
      date: 'Apr 30, 2024',
    },
    {
      merchant: 'Amazon',
      category: 'Shopping',
      categoryColor: '#F59E0B',
      type: 'Expense',
      amount: '-₹1,299',
      isIncome: false,
      date: 'Apr 28, 2024',
    },
    
  ];

  return (
    <div className="transactions-card">
      <div className="card-header">
        <h3 className="card-title">Recent Transactions</h3>
        <button
          type="button"
          className="view-all-link"
          onClick={onViewAll}
        >
          View All
        </button>
      </div>

      <div className="table-wrapper" style={{ flex: 1 }}>
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Merchant</th>
              <th>Category</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, idx) => (
              <tr key={idx}>
                <td>
                  <div className="merchant-cell">
                    <MerchantLogo name={tx.merchant} />
                    <span>{tx.merchant}</span>
                  </div>
                </td>
                <td>
                  <div className="category-cell">
                    <span 
                      className="category-dot" 
                      style={{ backgroundColor: tx.categoryColor }}
                    />
                    <span>{tx.category}</span>
                  </div>
                </td>
                <td>
                  <div className="type-cell">
                    {tx.isIncome ? (
                      <>
                        <ArrowUp className="type-icon income" size={14} />
                        <span>Income</span>
                      </>
                    ) : (
                      <>
                        <ArrowDown className="type-icon expense" size={14} />
                        <span>Expense</span>
                      </>
                    )}
                  </div>
                </td>
                <td>
                  <span className={`amount-cell ${tx.isIncome ? 'income' : 'expense'}`}>
                    {tx.amount}
                  </span>
                </td>
                <td>
                  <span className="date-cell">{tx.date}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionsList;
