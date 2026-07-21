import React, { useState, useMemo } from 'react';
import {
  Target,
  Plus,
  Trash2,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  PiggyBank,
  Zap,
  Flag,
  X,
  ArrowUpRight,
  Milestone,
  Wallet,
  Home,
  Plane,
  Car,
  Laptop,
  GraduationCap,
  Heart,
  MoreHorizontal,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import './GoalsPage.css';

// ─── Mock Data & Premium Categories ──────────────────────────────────────────
const CATEGORY_ICONS = {
  Travel: Plane,
  Home: Home,
  Vehicle: Car,
  Tech: Laptop,
  Education: GraduationCap,
  Health: Heart,
  Emergency: Zap,
  Other: Target,
};

const CATEGORY_COLORS = {
  Travel:    { color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.08)', gradient: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', stops: ['#3B82F6', '#1D4ED8'] },
  Home:      { color: '#10B981', bg: 'rgba(16, 185, 129, 0.08)', gradient: 'linear-gradient(135deg, #10B981, #047857)', stops: ['#10B981', '#047857'] },
  Vehicle:   { color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.08)', gradient: 'linear-gradient(135deg, #F59E0B, #B45309)', stops: ['#F59E0B', '#B45309'] },
  Tech:      { color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.08)', gradient: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', stops: ['#8B5CF6', '#6D28D9'] },
  Education: { color: '#EC4899', bg: 'rgba(236, 72, 153, 0.08)', gradient: 'linear-gradient(135deg, #EC4899, #BE185D)', stops: ['#EC4899', '#BE185D'] },
  Health:    { color: '#14B8A6', bg: 'rgba(20, 184, 166, 0.08)', gradient: 'linear-gradient(135deg, #14B8A6, #0F766E)', stops: ['#14B8A6', '#0F766E'] },
  Emergency: { color: '#EF4444', bg: 'rgba(239, 68, 68, 0.08)', gradient: 'linear-gradient(135deg, #EF4444, #B91C1C)', stops: ['#EF4444', '#B91C1C'] },
  Other:     { color: '#6B7280', bg: 'rgba(107, 114, 128, 0.08)', gradient: 'linear-gradient(135deg, #9CA3AF, #6B7280)', stops: ['#9CA3AF', '#6B7280'] },
};

const INITIAL_GOALS = [
  {
    id: 1,
    name: 'Europe Vacation',
    category: 'Travel',
    targetAmount: 150000,
    savedAmount: 87500,
    targetDate: '2026-12-31',
    createdAt: '2026-01-15',
    contributions: [
      { date: '2026-07-08', amount: 10000 },
      { date: '2026-06-15', amount: 12500 },
      { date: '2026-05-30', amount: 15000 },
    ],
  },
  {
    id: 2,
    name: 'MacBook Pro',
    category: 'Tech',
    targetAmount: 220000,
    savedAmount: 220000,
    targetDate: '2026-08-01',
    createdAt: '2026-02-10',
    contributions: [
      { date: '2026-07-01', amount: 50000 },
      { date: '2026-06-15', amount: 70000 },
      { date: '2026-05-10', amount: 100000 },
    ],
  },
  {
    id: 3,
    name: 'Emergency Fund',
    category: 'Emergency',
    targetAmount: 300000,
    savedAmount: 95000,
    targetDate: '2027-06-30',
    createdAt: '2026-03-01',
    contributions: [
      { date: '2026-07-05', amount: 10000 },
      { date: '2026-06-05', amount: 15000 },
    ],
  },
  {
    id: 4,
    name: 'Home Down Payment',
    category: 'Home',
    targetAmount: 800000,
    savedAmount: 120000,
    targetDate: '2028-01-01',
    createdAt: '2026-01-01',
    contributions: [
      { date: '2026-07-01', amount: 20000 },
      { date: '2026-06-01', amount: 20000 },
      { date: '2026-05-01', amount: 20000 },
    ],
  },
  {
    id: 5,
    name: 'MBA Program',
    category: 'Education',
    targetAmount: 500000,
    savedAmount: 175000,
    targetDate: '2027-09-01',
    createdAt: '2026-04-15',
    contributions: [
      { date: '2026-07-10', amount: 25000 },
      { date: '2026-06-10', amount: 25000 },
    ],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const formatINR = (val) => `₹${Number(val).toLocaleString('en-IN')}`;

const daysUntil = (dateStr) => {
  const diff = new Date(dateStr) - new Date();
  return Math.max(Math.ceil(diff / 86400000), 0);
};

const getStatus = (goal) => {
  const pct = (goal.savedAmount / goal.targetAmount) * 100;
  if (pct >= 100) return 'completed';
  if (daysUntil(goal.targetDate) < 30) return 'urgent';
  return 'on-track';
};

// Circular SVG progress ring with gradient support
const CircleRing = ({ percent, size = 120, stroke = 10, gradientId, stops }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(percent, 100) / 100) * circ;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {stops && gradientId && (
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={stops[0]} />
            <stop offset="100%" stopColor={stops[1]} />
          </linearGradient>
        </defs>
      )}
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(226, 232, 240, 0.5)" strokeWidth={stroke} />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={gradientId ? `url(#${gradientId})` : '#6b7280'}
        strokeWidth={stroke}
        strokeDasharray={`${circ}`}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        className="goal-ring-progress"
      />
    </svg>
  );
};

// ─── Add Goal Modal ───────────────────────────────────────────────────────────
const AddGoalModal = ({ onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Travel');
  const [target, setTarget] = useState('');
  const [saved, setSaved] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) { setError('Goal name is required'); return; }
    if (!target || isNaN(target) || parseFloat(target) <= 0) { setError('Enter a valid target amount'); return; }
    if (!targetDate) { setError('Please pick a target date'); return; }

    onAdd({
      id: Date.now(),
      name: name.trim(),
      category,
      targetAmount: Math.round(parseFloat(target)),
      savedAmount: saved ? Math.min(Math.round(parseFloat(saved)), Math.round(parseFloat(target))) : 0,
      targetDate,
      createdAt: new Date().toISOString().split('T')[0],
      contributions: saved && parseFloat(saved) > 0
        ? [{ date: new Date().toISOString().split('T')[0], amount: Math.round(parseFloat(saved)) }]
        : [],
    });
    onClose();
  };

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal-panel"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
        transition={{ type: "spring", damping: 25, stiffness: 220 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-icon-ring">
              <Target size={20} />
            </div>
            <div>
              <h2 className="modal-title">New Savings Goal</h2>
              <p className="modal-subtitle">Set a target and start saving today</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="mf-group">
            <label>Goal Name</label>
            <input type="text" placeholder="e.g. Dream Vacation, New Car…" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="mf-row-2">
            <div className="mf-group">
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {Object.keys(CATEGORY_ICONS).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="mf-group">
              <label>Target Date</label>
              <input
                type="date"
                value={targetDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setTargetDate(e.target.value)}
              />
            </div>
          </div>

          <div className="mf-row-2">
            <div className="mf-group">
              <label>Target Amount (₹)</label>
              <input type="number" placeholder="e.g. 150000" value={target} onChange={(e) => setTarget(e.target.value)} />
            </div>

            <div className="mf-group">
              <label>Already Saved (₹) <span className="mf-optional">optional</span></label>
              <input type="number" placeholder="0" value={saved} onChange={(e) => setSaved(e.target.value)} />
            </div>
          </div>

          {error && <div className="mf-error">{error}</div>}

          <div className="mf-actions">
            <button type="button" className="mf-btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="mf-btn-create">
              <Plus size={15} />
              Create Goal
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// ─── Contribute Modal ─────────────────────────────────────────────────────────
const ContributeModal = ({ goal, onClose, onContribute }) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const remaining = goal.targetAmount - goal.savedAmount;
  const meta = CATEGORY_COLORS[goal.category] || CATEGORY_COLORS.Other;

  const handleSubmit = (e) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!amount || isNaN(val) || val <= 0) { setError('Enter a valid amount'); return; }
    if (val > remaining) { setError(`Max contribution is ${formatINR(remaining)}`); return; }
    onContribute(goal.id, Math.round(val));
    onClose();
  };

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal-panel modal-panel--sm"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
        transition={{ type: "spring", damping: 25, stiffness: 220 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-icon-ring" style={{ background: meta.bg, color: meta.color }}>
              <Wallet size={18} />
            </div>
            <div>
              <h2 className="modal-title">Add Funds</h2>
              <p className="modal-subtitle">{goal.name}</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="contrib-info-row">
          <div className="contrib-pill">
            <span className="contrib-pill-label">Remaining</span>
            <span className="contrib-pill-val">{formatINR(remaining)}</span>
          </div>
          <div className="contrib-pill">
            <span className="contrib-pill-label">Saved so far</span>
            <span className="contrib-pill-val" style={{ color: meta.color }}>{formatINR(goal.savedAmount)}</span>
          </div>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="mf-group">
            <label>Amount to Add (₹)</label>
            <input
              type="number"
              placeholder={`Max: ₹${remaining.toLocaleString('en-IN')}`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              autoFocus
            />
          </div>

          {/* Quick amount chips */}
          <div className="quick-chips-row">
            {[1000, 5000, 10000, 25000].filter(v => v <= remaining).map(v => (
              <button key={v} type="button" className="quick-chip" onClick={() => setAmount(String(v))}>
                +{formatINR(v)}
              </button>
            ))}
          </div>

          {error && <div className="mf-error">{error}</div>}

          <div className="mf-actions">
            <button type="button" className="mf-btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="mf-btn-create" style={{ background: meta.gradient }}>
              <ArrowUpRight size={15} />
              Contribute
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// ─── Goal Card Component ──────────────────────────────────────────────────────
const GoalCard = ({ goal, onDelete, onContribute }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pct = Math.min((goal.savedAmount / goal.targetAmount) * 100, 100);
  const status = getStatus(goal);
  const meta = CATEGORY_COLORS[goal.category] || CATEGORY_COLORS.Other;
  const Icon = CATEGORY_ICONS[goal.category] || Target;
  const days = daysUntil(goal.targetDate);
  const remaining = goal.targetAmount - goal.savedAmount;

  const statusConfig = {
    completed: { label: 'Completed', icon: CheckCircle2, cls: 'status--completed' },
    urgent:    { label: 'Urgent',    icon: AlertCircle,  cls: 'status--urgent'    },
    'on-track':{ label: 'On Track',  icon: TrendingUp,   cls: 'status--on-track'  },
  }[status];

  const StatusIcon = statusConfig.icon;
  const cardGradientId = `grad-ring-${goal.id}`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
      className={`goal-card ${status === 'completed' ? 'goal-card--completed' : ''}`}
    >
      {/* Top accent gradient bar */}
      <div className="goal-card-accent" style={{ background: meta.gradient }} />

      <div className="goal-card-body">
        {/* Header row */}
        <div className="gc-header">
          <div className="gc-icon-wrap" style={{ background: meta.bg, color: meta.color }}>
            <Icon size={20} />
          </div>

          <div className="gc-title-group">
            <h3 className="gc-name">{goal.name}</h3>
            <span className="gc-category">{goal.category}</span>
          </div>

          <div className="gc-menu-wrap">
            <span className={`gc-status-badge ${statusConfig.cls}`}>
              <StatusIcon size={11} />
              {statusConfig.label}
            </span>

            <div style={{ position: 'relative' }}>
              <button className="gc-menu-btn" onClick={() => setMenuOpen(o => !o)} aria-label="Options">
                <MoreHorizontal size={16} />
              </button>
              {menuOpen && (
                <>
                  {/* Backdrop overlay to close dropdown on click outside */}
                  <div style={{ position: 'fixed', inset: 0, zIndex: 25 }} onClick={() => setMenuOpen(false)} />
                  <div className="gc-dropdown">
                    <button
                      className="gc-dropdown-item"
                      onClick={() => {
                        setMenuOpen(false);
                        onContribute(goal);
                      }}
                    >
                      <ArrowUpRight size={13} /> Add Funds
                    </button>
                    <button
                      className="gc-dropdown-item gc-dropdown-item--danger"
                      onClick={() => {
                        setMenuOpen(false);
                        onDelete(goal.id);
                      }}
                    >
                      <Trash2 size={13} /> Delete Goal
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Progress ring + amounts */}
        <div className="gc-progress-section">
          <div className="gc-ring-wrap">
            <CircleRing percent={pct} size={110} stroke={9} gradientId={cardGradientId} stops={meta.stops} />
            <div className="gc-ring-label">
              <span className="gc-ring-pct" style={{ color: meta.color }}>{pct.toFixed(0)}%</span>
              <span className="gc-ring-sub">saved</span>
            </div>
          </div>

          <div className="gc-amounts">
            <div className="gc-amt-row">
              <span className="gc-amt-label">Saved</span>
              <span className="gc-amt-val" style={{ color: meta.color }}>{formatINR(goal.savedAmount)}</span>
            </div>
            <div className="gc-amt-divider" />
            <div className="gc-amt-row">
              <span className="gc-amt-label">Target</span>
              <span className="gc-amt-val">{formatINR(goal.targetAmount)}</span>
            </div>
            <div className="gc-amt-divider" />
            <div className="gc-amt-row">
              <span className="gc-amt-label">Remaining</span>
              <span className="gc-amt-val gc-amt-remaining">{formatINR(Math.max(remaining, 0))}</span>
            </div>
          </div>
        </div>

        {/* Linear progress bar */}
        <div className="gc-bar-track">
          <div className="gc-bar-fill" style={{ width: `${pct}%`, background: meta.gradient }} />
        </div>

        {/* Footer */}
        <div className="gc-footer">
          <div className="gc-deadline">
            <Clock size={12} />
            {status === 'completed'
              ? 'Goal achieved!'
              : `${days} day${days !== 1 ? 's' : ''} left`}
          </div>

          {status !== 'completed' && (
            <button
              className="gc-add-btn"
              style={{ background: meta.bg, color: meta.color }}
              onClick={() => onContribute(goal)}
            >
              <Plus size={13} />
              Add Funds
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ─── Main Page Component ──────────────────────────────────────────────────────
const GoalsPage = () => {
  const [goals, setGoals] = useState(INITIAL_GOALS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [contributeGoal, setContributeGoal] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');

  const handleAddGoal = (goal) => setGoals(prev => [goal, ...prev]);
  const handleDeleteGoal = (id) => setGoals(prev => prev.filter(g => g.id !== id));

  const handleContribute = (id, amount) => {
    setGoals(prev => prev.map(g => {
      if (g.id !== id) return g;
      const newSaved = Math.min(g.savedAmount + amount, g.targetAmount);
      return {
        ...g,
        savedAmount: newSaved,
        contributions: [
          { date: new Date().toISOString().split('T')[0], amount },
          ...g.contributions,
        ],
      };
    }));
  };

  // ── Stats Calculations
  const stats = useMemo(() => {
    const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0);
    const totalSaved  = goals.reduce((s, g) => s + g.savedAmount, 0);
    const completed   = goals.filter(g => getStatus(g) === 'completed').length;
    const urgent      = goals.filter(g => getStatus(g) === 'urgent').length;
    const overallPct  = totalTarget > 0 ? ((totalSaved / totalTarget) * 100).toFixed(1) : '0';
    return { totalTarget, totalSaved, completed, urgent, overallPct };
  }, [goals]);

  // ── Filtering logic
  const filteredGoals = useMemo(() => {
    if (filterStatus === 'All') return goals;
    return goals.filter(g => getStatus(g) === filterStatus.toLowerCase().replace(' ', '-'));
  }, [goals, filterStatus]);

  // ── All contributions flat list, sorted by date
  const allContributions = useMemo(() => {
    const list = [];
    goals.forEach(g => {
      g.contributions.forEach(c => {
        list.push({ ...c, goalName: g.name, category: g.category });
      });
    });
    return list.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  }, [goals]);

  const filterOptions = ['All', 'On Track', 'Urgent', 'Completed'];

  return (
    <motion.div
      className="goals-page"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* ── Page Header ── */}
      <div className="goals-header">
        <div>
          <h1 className="page-title">Savings Goals</h1>
          <p className="page-subtitle">Track your financial milestones and watch your dreams take shape</p>
        </div>

        <button className="goals-add-btn" onClick={() => setShowAddModal(true)}>
          <Plus size={16} />
          New Goal
        </button>
      </div>

      {/* ── Metrics Grid (Staggered Animation) ── */}
      <motion.div
        className="goals-metrics-grid"
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.06 }
          }
        }}
      >
        {/* Total Saved Card */}
        <motion.div
          className="goal-metric-card border-left-green"
          variants={{
            hidden: { opacity: 0, y: 10 },
            show: { opacity: 1, y: 0 }
          }}
        >
          <div className="goal-metric-info">
            <span className="goal-metric-label">Total Saved</span>
            <span className="goal-metric-value">{formatINR(stats.totalSaved)}</span>
            <div className="goal-metric-sub positive">
              <TrendingUp size={13} />
              <span>{stats.overallPct}% of all targets</span>
            </div>
          </div>
          <div className="goal-metric-icon bg-green-light">
            <PiggyBank size={24} className="c-green" />
          </div>
        </motion.div>

        {/* Total Target Card */}
        <motion.div
          className="goal-metric-card border-left-blue"
          variants={{
            hidden: { opacity: 0, y: 10 },
            show: { opacity: 1, y: 0 }
          }}
        >
          <div className="goal-metric-info">
            <span className="goal-metric-label">Total Target</span>
            <span className="goal-metric-value">{formatINR(stats.totalTarget)}</span>
            <div className="goal-metric-progress-track">
              <div
                className="goal-metric-progress-fill"
                style={{ width: `${stats.overallPct}%` }}
              />
            </div>
          </div>
          <div className="goal-metric-icon bg-blue-light">
            <Milestone size={22} className="c-blue" />
          </div>
        </motion.div>

        {/* Goals Completed Card */}
        <motion.div
          className="goal-metric-card border-left-amber"
          variants={{
            hidden: { opacity: 0, y: 10 },
            show: { opacity: 1, y: 0 }
          }}
        >
          <div className="goal-metric-info">
            <span className="goal-metric-label">Goals Completed</span>
            <span className="goal-metric-value">{stats.completed} <span className="goal-metric-total">/ {goals.length}</span></span>
            <div className="goal-metric-sub positive">
              <CheckCircle2 size={13} />
              <span>Fully achieved</span>
            </div>
          </div>
          <div className="goal-metric-icon bg-amber-light">
            <Flag size={22} className="c-amber" />
          </div>
        </motion.div>

        {/* Needs Attention Card */}
        <motion.div
          className="goal-metric-card border-left-rose"
          variants={{
            hidden: { opacity: 0, y: 10 },
            show: { opacity: 1, y: 0 }
          }}
        >
          <div className="goal-metric-info">
            <span className="goal-metric-label">Needs Attention</span>
            <span className="goal-metric-value">{stats.urgent}</span>
            <div className={`goal-metric-sub ${stats.urgent > 0 ? 'negative' : 'positive'}`}>
              <AlertCircle size={13} />
              <span>{stats.urgent > 0 ? 'Deadlines approaching' : 'All on schedule'}</span>
            </div>
          </div>
          <div className="goal-metric-icon bg-rose-light">
            <AlertCircle size={22} className="c-rose" />
          </div>
        </motion.div>
      </motion.div>

      {/* ── Main Content (full width, no sidebar) ── */}
      <div className="goals-cards-section">
          
          {/* Overall Progress Landscape Card (Moved from Sidebar) */}
          <div className="overall-progress-card shadow-card">
            <div className="overall-card-left">
              <div className="sc-header">
                <h3 className="sc-title">Overall Progress</h3>
                <span className="gf-tab-count" style={{ fontSize: '11px', padding: '2px 8px' }}>
                  {parseFloat(stats.overallPct).toFixed(0)}%
                </span>
              </div>

              <div className="overall-ring-wrap">
                <CircleRing
                  percent={parseFloat(stats.overallPct)}
                  size={130}
                  stroke={11}
                  gradientId="overall-ring-grad"
                  stops={['#09543D', '#10B981']}
                />
                <div className="overall-ring-label">
                  <span className="overall-ring-pct">{parseFloat(stats.overallPct).toFixed(0)}%</span>
                  <span className="overall-ring-sub">Overall</span>
                </div>
              </div>

              <div className="overall-stats-row">
                <div className="overall-stat">
                  <span className="overall-stat-label">Saved</span>
                  <span className="overall-stat-val c-green">{formatINR(stats.totalSaved)}</span>
                </div>
                <div className="overall-stat-divider" />
                <div className="overall-stat">
                  <span className="overall-stat-label">Left</span>
                  <span className="overall-stat-val">{formatINR(Math.max(stats.totalTarget - stats.totalSaved, 0))}</span>
                </div>
              </div>
            </div>

            <div className="overall-card-right">
              <h4 className="mini-bars-title">Per-Goal Breakdown</h4>
              <div className="mini-bars">
                {goals.map(g => {
                  const pct = Math.min((g.savedAmount / g.targetAmount) * 100, 100);
                  const m = CATEGORY_COLORS[g.category] || CATEGORY_COLORS.Other;
                  return (
                    <div key={g.id} className="mini-bar-row">
                      <span className="mini-bar-name">{g.name}</span>
                      <div className="mini-bar-track">
                        <motion.div
                          className="mini-bar-fill"
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          style={{ background: m.gradient }}
                        />
                      </div>
                      <span className="mini-bar-pct" style={{ color: m.color }}>{pct.toFixed(0)}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Goals List Filter & Grid */}
          <div className="goals-list-wrapper">
            <div className="goals-filter-row">
              <div className="goals-filter-tabs">
                {filterOptions.map(opt => (
                  <button
                    key={opt}
                    className={`gf-tab ${filterStatus === opt ? 'active' : ''}`}
                    onClick={() => setFilterStatus(opt)}
                  >
                    {opt}
                    {opt !== 'All' && (
                      <span className="gf-tab-count">
                        {goals.filter(g =>
                          opt === 'Completed' ? getStatus(g) === 'completed' :
                          opt === 'Urgent'    ? getStatus(g) === 'urgent' :
                          getStatus(g) === 'on-track'
                        ).length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <span className="goals-count-label">{filteredGoals.length} goal{filteredGoals.length !== 1 ? 's' : ''}</span>
            </div>

            {/* Cards Grid with Framer Motion Layout Reordering */}
            {filteredGoals.length === 0 ? (
              <motion.div className="goals-empty-state" layout>
                <div className="goals-empty-icon"><Target size={36} /></div>
                <h3>No goals here yet</h3>
                <p>Create your first savings goal to get started.</p>
                <button className="goals-add-btn" onClick={() => setShowAddModal(true)}>
                  <Plus size={14} /> Add a Goal
                </button>
              </motion.div>
            ) : (
              <motion.div className="goals-cards-grid" layout>
                <AnimatePresence mode="popLayout">
                  {filteredGoals.map(goal => (
                    <GoalCard
                      key={goal.id}
                      goal={goal}
                      onDelete={handleDeleteGoal}
                      onContribute={(g) => setContributeGoal(g)}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>

          {/* Recent Contributions Grid Card (Moved from Sidebar & Styled Horizontally) */}
          <div className="recent-contributions-card shadow-card">
            <div className="sc-header">
              <h3 className="sc-title">Recent Contributions</h3>
              <ArrowUpRight size={16} className="sc-header-icon" />
            </div>

            <div className="contrib-horizontal-grid">
              {allContributions.length === 0 ? (
                <p className="no-contrib-text">No contributions yet.</p>
              ) : (
                allContributions.map((c, i) => {
                  const m = CATEGORY_COLORS[c.category] || CATEGORY_COLORS.Other;
                  const Icon = CATEGORY_ICONS[c.category] || Target;
                  return (
                    <motion.div
                      key={i}
                      className="contrib-grid-item"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <div className="contrib-item-header">
                        <div className="contrib-icon-wrap" style={{ background: m.bg, color: m.color }}>
                          <Icon size={20} />
                        </div>
                        <span className="contrib-amount" style={{ color: m.color }}>+{formatINR(c.amount)}</span>
                      </div>
                      <div className="contrib-item-details">
                        <span className="contrib-goal-name">{c.goalName}</span>
                        <span className="contrib-date">{c.date}</span>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>

      </div>

      {/* ── Modals with AnimatePresence Transitions ── */}
      <AnimatePresence>
        {showAddModal && (
          <AddGoalModal onClose={() => setShowAddModal(false)} onAdd={handleAddGoal} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {contributeGoal && (
          <ContributeModal
            goal={contributeGoal}
            onClose={() => setContributeGoal(null)}
            onContribute={handleContribute}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default GoalsPage;
