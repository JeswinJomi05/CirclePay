import React, { useMemo, useState } from 'react';
import {
  Users,
  Receipt,
  Wallet,
  Sparkles,
  ArrowUpRight,
  ArrowDownLeft,
  CalendarDays,
  Plus,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import './GroupsPage.css';

const GROUPS = [
  {
    id: 1,
    name: 'Trip to Goa',
    emoji: '🏖️',
    description:
      'A shared trip budget split between friends for flights, stays, meals, and local travel.',
    createdAt: 'Apr 2026',
    totalExpenses: 138400,
    category: 'Travel',
    members: [
      { id: 1, name: 'Aromal', role: 'You',       share: 34600, paid: 42000, net:  7400 },
      { id: 2, name: 'Riya',   role: 'Organizer', share: 34600, paid: 18000, net: -16600 },
      { id: 3, name: 'Arjun',  role: 'Traveler',  share: 34600, paid: 42000, net:  7400 },
      { id: 4, name: 'Mina',   role: 'Traveler',  share: 34600, paid: 30000, net: -4600 },
    ],
    expenseHistory: [
      { id: 1, title: 'Hotel booking',       amount: 62400, paidBy: 'Riya',   date: 'May 10', description: '3 nights in a beachfront villa.' },
      { id: 2, title: 'Fuel & local travel', amount: 18200, paidBy: 'Arjun',  date: 'May 12', description: 'Taxi rides and fuel for the island tour.' },
      { id: 3, title: 'Dinner split',        amount: 12800, paidBy: 'Aromal', date: 'May 13', description: 'Shared dinner and drinks at the hotel.' },
    ],
  },
  {
    id: 2,
    name: 'Apartment Bills',
    emoji: '🏠',
    description:
      'Monthly rent, utilities, groceries, and common-area costs for the shared flat.',
    createdAt: 'Jan 2026',
    totalExpenses: 64200,
    category: 'Home',
    members: [
      { id: 1, name: 'Aromal', role: 'You',      share: 16050, paid: 16050, net:  0    },
      { id: 2, name: 'Nisha',  role: 'Roommate', share: 16050, paid: 14200, net: -1850 },
      { id: 3, name: 'Dev',    role: 'Roommate', share: 16050, paid: 18000, net:  1950 },
      { id: 4, name: 'Meera',  role: 'Roommate', share: 16050, paid: 16050, net:  0    },
    ],
    expenseHistory: [
      { id: 1, title: 'Electricity bill', amount: 12400, paidBy: 'Dev',   date: 'Jun 01', description: 'Monthly power bill for the flat.' },
      { id: 2, title: 'Groceries',        amount: 15800, paidBy: 'Nisha', date: 'Jun 05', description: 'Food and kitchen essentials.' },
      { id: 3, title: 'Internet',         amount: 8600,  paidBy: 'Meera', date: 'Jun 08', description: 'Shared internet recharge.' },
    ],
  },
  {
    id: 3,
    name: 'Office Lunch Club',
    emoji: '🍱',
    description: 'Weekly lunch orders and shared snacks for the team.',
    createdAt: 'Mar 2026',
    totalExpenses: 18400,
    category: 'Food',
    members: [
      { id: 1, name: 'Aromal', role: 'You',      share: 2300, paid: 4500, net:  2200 },
      { id: 2, name: 'Kavya',  role: 'Teammate', share: 2300, paid: 1800, net:  -500 },
      { id: 3, name: 'Rohan',  role: 'Teammate', share: 2300, paid: 2300, net:   0   },
      { id: 4, name: 'Sana',   role: 'Teammate', share: 2300, paid: 2000, net:  -300 },
    ],
    expenseHistory: [
      { id: 1, title: 'Lunch order',  amount: 9600, paidBy: 'Kavya', date: 'Jun 14', description: 'Team lunch for the weekly meetup.' },
      { id: 2, title: 'Coffee run',   amount: 4200, paidBy: 'Rohan', date: 'Jun 16', description: 'Coffee and pastries for the team.' },
      { id: 3, title: 'Dessert box',  amount: 4600, paidBy: 'Aromal',date: 'Jun 18', description: 'Dessert for the afternoon stand-up.' },
    ],
  },
];

const AVATAR_COLORS = [
  'linear-gradient(135deg,#09543D,#22c55e)',
  'linear-gradient(135deg,#3E63EC,#818cf8)',
  'linear-gradient(135deg,#f59e0b,#fb923c)',
  'linear-gradient(135deg,#ec4899,#a855f7)',
  'linear-gradient(135deg,#06b6d4,#3b82f6)',
];

const fmt = (v) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);

const netClass = (v) => (v > 0 ? 'pos' : v < 0 ? 'neg' : 'zero');

// ─── New Group Modal Component ───
const NewGroupModal = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('🏖️');
  const [category, setCategory] = useState('Travel');
  const [description, setDescription] = useState('');
  
  const [members, setMembers] = useState(['Aromal']);
  const [memberNameInput, setMemberNameInput] = useState('');
  const [error, setError] = useState('');

  // Initial Spend Split options
  const [initialSpend, setInitialSpend] = useState('');
  const [payer, setPayer] = useState('Aromal');
  const [expenseTitle, setExpenseTitle] = useState('Initial Expense');

  const emojisList = ['🏖️', '🏠', '🍱', '🎨', '🍿', '🧗', '🚗', '🛍️', '💰', '🎮'];
  const categories = ['Travel', 'Home', 'Food', 'Other'];

  const handleAddMember = (e) => {
    e?.preventDefault();
    const cleanName = memberNameInput.trim();
    if (!cleanName) return;
    if (members.some(m => m.toLowerCase() === cleanName.toLowerCase())) {
      setError('Member name already exists');
      return;
    }
    setMembers(prev => [...prev, cleanName]);
    setMemberNameInput('');
    setError('');
  };

  const handleRemoveMember = (nameToRemove) => {
    if (nameToRemove === 'Aromal') return; // Cannot remove self
    setMembers(prev => {
      const updated = prev.filter(m => m !== nameToRemove);
      // Reset payer to Aromal if the selected payer is being removed
      if (payer === nameToRemove) {
        setPayer('Aromal');
      }
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Group name is required');
      return;
    }
    if (members.length < 2) {
      setError('Please add at least 1 other member');
      return;
    }

    const spendVal = parseFloat(initialSpend);
    const hasInitialSpend = !isNaN(spendVal) && spendVal > 0;

    let totalExpenses = 0;
    let newMembers = [];
    let expenseHistory = [];

    if (hasInitialSpend) {
      totalExpenses = spendVal;
      const shareAmount = spendVal / members.length;

      newMembers = members.map((mName, idx) => {
        const isPayer = mName === payer;
        const paid = isPayer ? spendVal : 0;
        const net = paid - shareAmount;
        return {
          id: idx + 1,
          name: mName,
          role: mName === 'Aromal' ? 'You' : (isPayer ? 'Organizer' : 'Member'),
          share: Math.round(shareAmount),
          paid: paid,
          net: Math.round(net)
        };
      });

      expenseHistory = [
        {
          id: 1,
          title: expenseTitle.trim() || 'Initial Expense',
          amount: spendVal,
          paidBy: payer,
          date: new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit' }).format(new Date()),
          description: `Initial group expense split between ${members.length} people.`
        }
      ];
    } else {
      newMembers = members.map((mName, idx) => ({
        id: idx + 1,
        name: mName,
        role: mName === 'Aromal' ? 'You' : 'Member',
        share: 0,
        paid: 0,
        net: 0
      }));
    }

    const newGroup = {
      id: Date.now(),
      name: name.trim(),
      emoji,
      description: description.trim() || `Shared expenses for ${name.trim()}`,
      category,
      createdAt: new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(new Date()),
      totalExpenses,
      members: newMembers,
      expenseHistory
    };

    onCreate(newGroup);
    // Reset state
    setName('');
    setEmoji('🏖️');
    setCategory('Travel');
    setDescription('');
    setMembers(['Aromal']);
    setMemberNameInput('');
    setInitialSpend('');
    setPayer('Aromal');
    setExpenseTitle('Initial Expense');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="gp-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="gp-modal-panel gp-modal-panel--sm"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="gp-modal-header">
          <div className="gp-modal-title-group">
            <div className="gp-modal-icon-ring">
              <Plus size={18} />
            </div>
            <div>
              <h2 className="gp-modal-title">New Group</h2>
              <p className="gp-modal-subtitle">Start splitting expenses with friends</p>
            </div>
          </div>
          <button className="gp-modal-close-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <form className="gp-modal-form" onSubmit={handleSubmit}>
          
          <div className="gp-form-group">
            <label className="gp-input-label">Group Name</label>
            <input
              type="text"
              className="gp-input-text"
              placeholder="e.g. Goa Trip, Flat 402 Utilities"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              autoFocus
            />
          </div>

          <div className="gp-form-group">
            <label className="gp-input-label">Group Icon / Emoji</label>
            <div className="gp-emoji-grid">
              {emojisList.map(item => (
                <button
                  key={item}
                  type="button"
                  className={`gp-emoji-btn ${emoji === item ? 'active' : ''}`}
                  onClick={() => setEmoji(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="gp-form-group">
            <label className="gp-input-label">Category</label>
            <div className="gp-category-grid">
              {categories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  className={`gp-category-btn ${category === cat ? 'active' : ''}`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="gp-form-group">
            <label className="gp-input-label">Description</label>
            <textarea
              className="gp-textarea"
              placeholder="What are these shared expenses for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          <div className="gp-form-group">
            <label className="gp-input-label">Add Members</label>
            <div className="gp-member-input-row">
              <input
                type="text"
                className="gp-input-text"
                placeholder="Enter friend's name"
                value={memberNameInput}
                onChange={(e) => {
                  setMemberNameInput(e.target.value);
                  if (error) setError('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddMember();
                  }
                }}
              />
              <button type="button" className="gp-member-add-btn" onClick={handleAddMember}>
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="gp-form-group">
            <label className="gp-input-label-sm">Active Members ({members.length})</label>
            <div className="gp-member-chips">
              {members.map(m => (
                <div key={m} className={`gp-member-chip ${m === 'Aromal' ? 'self' : ''}`}>
                  <span>{m}</span>
                  {m !== 'Aromal' && (
                    <button type="button" className="gp-member-chip-remove" onClick={() => handleRemoveMember(m)}>
                      <X size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Optional Spend Initializer Options */}
          <div className="gp-form-divider" />
          <div className="gp-form-section-title">Starting Expense (Optional)</div>
          
          <div className="gp-form-row">
            <div className="gp-form-group" style={{ flex: 1 }}>
              <label className="gp-input-label">Initial Spend (₹)</label>
              <input
                type="number"
                className="gp-input-text"
                placeholder="0"
                value={initialSpend}
                onChange={(e) => setInitialSpend(e.target.value)}
              />
            </div>

            {parseFloat(initialSpend) > 0 && (
              <div className="gp-form-group" style={{ flex: 1 }}>
                <label className="gp-input-label">Who Paid?</label>
                <select
                  className="gp-select"
                  value={payer}
                  onChange={(e) => setPayer(e.target.value)}
                >
                  {members.map(m => (
                    <option key={m} value={m}>{m === 'Aromal' ? 'You' : m}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {parseFloat(initialSpend) > 0 && (
            <div className="gp-form-group">
              <label className="gp-input-label">Expense Title</label>
              <input
                type="text"
                className="gp-input-text"
                placeholder="e.g. Flight Booking, Grocery Run"
                value={expenseTitle}
                onChange={(e) => setExpenseTitle(e.target.value)}
              />
            </div>
          )}

          {error && <div className="gp-form-error">{error}</div>}

          <div className="gp-modal-actions">
            <button type="button" className="gp-btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="gp-btn-submit">Create Group</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

/* ─────────────────────────── */
export default function GroupsPage() {
  const [groups, setGroups] = useState(GROUPS);
  const [activeId, setActiveId] = useState(GROUPS[0].id);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const group = useMemo(() => groups.find((g) => g.id === activeId) ?? groups[0], [activeId, groups]);

  const perPerson    = group.totalExpenses / Math.max(1, group.members.length);
  const settledCount = group.members.filter((m) => m.net === 0).length;
  const settledPct   = Math.round((settledCount / Math.max(1, group.members.length)) * 100);
  const pendingAmt   = group.members.filter((m) => m.net < 0).reduce((s, m) => s + Math.abs(m.net), 0);
  const maxPaid      = Math.max(...group.members.map((m) => m.paid), 1);

  const handleCreateGroup = (newGroup) => {
    setGroups(prev => [...prev, newGroup]);
    setActiveId(newGroup.id);
  };

  const handlePayMember = (memberId) => {
    setGroups(prevGroups => {
      return prevGroups.map(g => {
        if (g.id !== activeId) return g;
        
        const payerMember = g.members.find(m => m.id === memberId);
        if (!payerMember || payerMember.net >= 0) return g;

        const debt = Math.abs(payerMember.net);
        let remainingDebt = debt;

        // Update members list
        const updatedMembers = g.members.map(m => {
          if (m.id === memberId) {
            return {
              ...m,
              paid: m.share, // Set paid to share so net becomes 0
              net: 0
            };
          }
          return { ...m };
        });

        // Distribute received money to members who are owed (net > 0)
        const owedMembers = updatedMembers.filter(m => m.net > 0);
        owedMembers.forEach(m => {
          if (remainingDebt <= 0) return;
          const received = Math.min(m.net, remainingDebt);
          remainingDebt -= received;
          m.paid = Math.max(0, m.paid - received);
          m.net = Math.max(0, m.net - received);
        });

        // Add a timeline event to expenseHistory
        const settlementTx = {
          id: Date.now(),
          title: `${payerMember.name === 'Aromal' ? 'You' : payerMember.name} settled up`,
          amount: debt,
          paidBy: payerMember.name,
          date: new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit' }).format(new Date()),
          description: `${payerMember.name === 'Aromal' ? 'You' : payerMember.name} paid pending debt of ${fmt(debt)} to the group.`
        };

        return {
          ...g,
          members: updatedMembers,
          expenseHistory: [settlementTx, ...g.expenseHistory]
        };
      });
    });
  };

  return (
    <div className="gp-root">

      {/* ══ Page Header ══ */}
      <div className="gp-page-header">
        <div className="gp-page-header-text">
          <span className="gp-page-eyebrow">Collaboration</span>
          <h1 className="gp-page-title">Your Groups</h1>
        </div>
        <button 
          className="gp-cta-btn" 
          type="button"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={15} />
          New Group
        </button>
      </div>

      {/* ══ Group Tab Switcher ══ */}
      <div className="gp-tabs-wrap">
        {groups.map((g) => (
          <button
            key={g.id}
            type="button"
            className={`gp-tab ${activeId === g.id ? 'gp-tab--active' : ''}`}
            onClick={() => setActiveId(g.id)}
          >
            <span className="gp-tab-emoji">{g.emoji}</span>
            <span className="gp-tab-label">{g.name}</span>
            {activeId === g.id && <ChevronRight size={13} className="gp-tab-chevron" />}
          </button>
        ))}
      </div>

      {/* ══ Hero Banner ══ */}
      <div className="gp-hero">
        <div className="gp-hero-orb gp-hero-orb--1" />
        <div className="gp-hero-orb gp-hero-orb--2" />

        <div className="gp-hero-inner">
          <div className="gp-hero-badge">
            <Sparkles size={13} /> Group Details
          </div>

          <div className="gp-hero-headline">
            <span className="gp-hero-emoji">{group.emoji}</span>
            <h2 className="gp-hero-name">{group.name}</h2>
          </div>

          <p className="gp-hero-desc">{group.description}</p>

          <div className="gp-hero-chips">
            <span className="gp-chip"><Users size={12} />{group.members.length} members</span>
            <span className="gp-chip"><CalendarDays size={12} />Created {group.createdAt}</span>
            <span className="gp-chip gp-chip--accent">{group.category}</span>
          </div>
        </div>

        {/* ── Stats Row inside hero ── */}
        <div className="gp-stats-row">
          <div className="gp-stat">
            <TrendingUp size={16} className="gp-stat-icon" />
            <span className="gp-stat-label">Total Spend</span>
            <strong className="gp-stat-val">{fmt(group.totalExpenses)}</strong>
            <span className="gp-stat-sub">across {group.members.length} people</span>
          </div>
          <div className="gp-stat-divider" />
          <div className="gp-stat">
            <Wallet size={16} className="gp-stat-icon" />
            <span className="gp-stat-label">Per Person</span>
            <strong className="gp-stat-val">{fmt(perPerson)}</strong>
            <span className="gp-stat-sub">equal split</span>
          </div>
          <div className="gp-stat-divider" />
          <div className="gp-stat">
            <AlertCircle size={16} className="gp-stat-icon gp-stat-icon--warn" />
            <span className="gp-stat-label">Pending</span>
            <strong className="gp-stat-val gp-stat-val--warn">{fmt(pendingAmt)}</strong>
            <span className="gp-stat-sub">to be settled</span>
          </div>
          <div className="gp-stat-divider" />
          <div className="gp-stat">
            <CheckCircle2 size={16} className="gp-stat-icon gp-stat-icon--green" />
            <span className="gp-stat-label">Settled</span>
            <strong className="gp-stat-val gp-stat-val--green">{settledPct}%</strong>
            <div className="gp-stat-bar">
              <div className="gp-stat-bar-fill" style={{ width: `${settledPct}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* ══ Members Panel ══ */}
      <section className="gp-section">
        <div className="gp-section-head">
          <div className="gp-section-label-group">
            <span className="gp-section-kicker">Members</span>
            <h2 className="gp-section-title">Group Members</h2>
          </div>
          <button className="gp-ghost-btn" type="button">
            <Users size={13} /> Manage
          </button>
        </div>

        <div className="gp-member-list">
          {group.members.map((m, i) => (
            <div key={m.id} className="gp-member-row">
              {/* Avatar */}
              <div className="gp-avatar" style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>
                {m.name[0]}
              </div>

              {/* Name + role */}
              <div className="gp-member-identity">
                <strong>{m.name}</strong>
                <span>{m.role}</span>
              </div>

              {/* Progress bar — paid vs share */}
              <div className="gp-member-progress-wrap">
                <div className="gp-member-progress-track">
                  <div
                    className="gp-member-progress-fill"
                    style={{
                      width: `${Math.min(100, Math.round((m.paid / Math.max(1, group.totalExpenses)) * 100))}%`,
                      background: AVATAR_COLORS[i % AVATAR_COLORS.length],
                    }}
                  />
                </div>
                <span className="gp-member-paid-label">Paid {fmt(m.paid)}</span>
              </div>

              {/* Net badge & Pay button */}
              <div className="gp-member-action-col">
                <div className={`gp-net-badge gp-net-badge--${netClass(m.net)}`}>
                  {m.net > 0
                    ? <><ArrowUpRight size={13} />Gets {fmt(m.net)}</>
                    : m.net < 0
                      ? <><ArrowDownLeft size={13} />Owes {fmt(Math.abs(m.net))}</>
                      : <><CheckCircle2 size={13} />Settled</>}
                </div>
                {m.net < 0 && (
                  <button 
                    className="gp-pay-btn"
                    onClick={() => handlePayMember(m.id)}
                    type="button"
                  >
                    Pay
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ Balances Panel ══ */}
      <section className="gp-section">
        <div className="gp-section-head">
          <div className="gp-section-label-group">
            <span className="gp-section-kicker">Balances</span>
            <h2 className="gp-section-title">Individual Balances</h2>
          </div>
        </div>

        <div className="gp-balance-list">
          {group.members.map((m, i) => {
            const pct = Math.round((m.paid / maxPaid) * 100);
            return (
              <div key={m.id} className="gp-balance-row">
                <div className="gp-bal-left">
                  <div className="gp-bal-avatar" style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>
                    {m.name[0]}
                  </div>
                  <div className="gp-bal-name-block">
                    <strong>{m.name}</strong>
                    <span>{m.role}</span>
                  </div>
                </div>

                <div className="gp-bal-track-wrap">
                  <div className="gp-bal-track">
                    <div
                      className="gp-bal-fill"
                      style={{
                        width: `${pct}%`,
                        background: AVATAR_COLORS[i % AVATAR_COLORS.length],
                      }}
                    />
                  </div>
                  <div className="gp-bal-labels">
                    <span>Paid {fmt(m.paid)}</span>
                    <span>Share {fmt(m.share)}</span>
                  </div>
                </div>

                <span className={`gp-bal-net gp-bal-net--${netClass(m.net)}`}>
                  {m.net >= 0 ? '+' : ''}{fmt(m.net)}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ══ Expense History ══ */}
      <section className="gp-section">
        <div className="gp-section-head">
          <div className="gp-section-label-group">
            <span className="gp-section-kicker">History</span>
            <h2 className="gp-section-title">Expense History</h2>
          </div>
          <button className="gp-ghost-btn" type="button">
            <Receipt size={13} /> View all
          </button>
        </div>

        <div className="gp-timeline">
          {group.expenseHistory.length > 0 ? (
            group.expenseHistory.map((exp, i) => (
              <div key={exp.id} className="gp-timeline-item">
                {/* Line + dot */}
                <div className="gp-tl-spine">
                  <div className={`gp-tl-dot ${exp.amount > 20000 ? 'gp-tl-dot--big' : 'gp-tl-dot--small'}`}>
                    {exp.amount > 20000 ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                  </div>
                  {i < group.expenseHistory.length - 1 && <div className="gp-tl-line" />}
                </div>

                {/* Content card */}
                <div className="gp-tl-card">
                  <div className="gp-tl-card-top">
                    <div>
                      <h3 className="gp-tl-title">{exp.title}</h3>
                      <p className="gp-tl-desc">{exp.description}</p>
                    </div>
                    <strong className="gp-tl-amount">{fmt(exp.amount)}</strong>
                  </div>
                  <div className="gp-tl-meta">
                    <span>Paid by <strong>{exp.paidBy}</strong></span>
                    <span>{exp.date}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)', background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-color)', width: '100%' }}>
              No expenses recorded yet. Start splitting to see history!
            </div>
          )}
        </div>
      </section>

      {/* New Group Creation Modal Overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <NewGroupModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onCreate={handleCreateGroup}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
