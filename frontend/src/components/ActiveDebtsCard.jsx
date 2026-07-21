import React from 'react';
import { Bell, ArrowUpRight, ArrowDownLeft, CheckCircle2 } from 'lucide-react';
import './ActiveDebtsCard.css';

const ActiveDebtsCard = () => {
  const debts = [
    {
      id: 1,
      name: 'Devika',
      avatar: 'D',
      avatarColor: '#3E63EC',
      avatarBg: '#eff2fe',
      type: 'owed_to_you', // owes you money
      description: 'Owes you for Trip',
      amount: '₹5,500',
      actionLabel: 'Remind',
    },
    {
      id: 2,
      name: 'Aromal',
      avatar: 'A',
      avatarColor: '#09543D',
      avatarBg: '#e6f0ed',
      type: 'you_owe', // you owe money
      description: 'You owe for Dinner',
      amount: '₹4,200',
      actionLabel: 'Settle',
    },
    {
      id: 3,
      name: 'Adarsh',
      avatar: 'Ad',
      avatarColor: '#F59E0B',
      avatarBg: '#fffbeb',
      type: 'owed_to_you',
      description: 'Owes you for Movie',
      amount: '₹1,800',
      actionLabel: 'Remind',
    },
  ];

  return (
    <div className="active-debts-card">
      <div className="card-header">
        <h3 className="card-title">Active Debts</h3>
        <span className="debt-summary-badge">3 Pending</span>
      </div>

      <div className="debts-overall-summary">
        <div className="summary-item owed-to-you">
          <div className="summary-icon-box">
            <ArrowUpRight size={16} />
          </div>
          <div className="summary-info">
            <span className="summary-label">Owed to you</span>
            <span className="summary-value green">₹7,300</span>
          </div>
        </div>

        <div className="summary-divider" />

        <div className="summary-item you-owe">
          <div className="summary-icon-box">
            <ArrowDownLeft size={16} />
          </div>
          <div className="summary-info">
            <span className="summary-label">You owe</span>
            <span className="summary-value red">₹4,200</span>
          </div>
        </div>
      </div>

      <div className="debts-list">
        {debts.map((debt) => (
          <div key={debt.id} className="debt-item">
            <div className="debt-item-left">
              <div 
                className="debt-avatar" 
                style={{ backgroundColor: debt.avatarBg, color: debt.avatarColor }}
              >
                {debt.avatar}
              </div>
              <div className="debt-item-info">
                <span className="debt-name">{debt.name}</span>
                <span className="debt-desc">{debt.description}</span>
              </div>
            </div>

            <div className="debt-item-right">
              <div className="debt-amount-box">
                <span className={`debt-amount ${debt.type === 'owed_to_you' ? 'owed-green' : 'owe-red'}`}>
                  {debt.type === 'owed_to_you' ? '+' : '-'}{debt.amount}
                </span>
              </div>
              <button 
                className={`debt-action-btn ${debt.type === 'owed_to_you' ? 'btn-remind' : 'btn-settle'}`}
                aria-label={`${debt.actionLabel} ${debt.name}`}
              >
                {debt.type === 'owed_to_you' ? <Bell size={14} /> : <CheckCircle2 size={14} />}
                <span>{debt.actionLabel}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveDebtsCard;
