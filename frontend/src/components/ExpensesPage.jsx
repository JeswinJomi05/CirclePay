import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Tag, 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  ChevronRight,
  Percent,
  Sparkles,
  ArrowDownLeft,
  ArrowUpRight
} from 'lucide-react';
import './ExpensesPage.css';

// Initial Mock Data
const INITIAL_TRANSACTIONS = [
  { id: 1, merchant: 'Swiggy', category: 'Food', amount: 750, date: '2026-07-01' },
  { id: 2, merchant: 'Netflix', category: 'Entertainment', amount: 649, date: '2026-07-02' },
  { id: 3, merchant: 'Amazon', category: 'Shopping', amount: 1299, date: '2026-07-03' },
  { id: 4, merchant: 'Uber India', category: 'Travel', amount: 450, date: '2026-07-03' },
  { id: 5, merchant: 'Zomato', category: 'Food', amount: 1200, date: '2026-07-04' },
  { id: 6, merchant: 'Electricity Bill', category: 'Utilities', amount: 2450, date: '2026-07-04' },
  { id: 7, merchant: 'Starbucks', category: 'Food', amount: 480, date: '2026-07-05' },
  { id: 8, merchant: 'BookMyShow', category: 'Entertainment', amount: 900, date: '2026-07-05' },
  { id: 9, merchant: 'H&M Shopping', category: 'Shopping', amount: 3499, date: '2026-07-06' },
  { id: 10, merchant: 'HP Fuel Station', category: 'Travel', amount: 1500, date: '2026-07-06' },
];

const CATEGORY_META = {
  Food: { color: '#09543D', bgLight: '#e6f0ed' },
  Entertainment: { color: '#3E63EC', bgLight: '#eff2fe' },
  Shopping: { color: '#F59E0B', bgLight: '#fffbeb' },
  Utilities: { color: '#8B5CF6', bgLight: '#f5f3ff' },
  Travel: { color: '#EC4899', bgLight: '#fdf2f8' }
};

const BUDGET_LIMIT = 25000; // Monthly Budget

const ExpensesPage = () => {
  // Page States
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [timeframe, setTimeframe] = useState('Week'); // Year, Month, Week
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Hover state for Trend Area Chart
  const [hoveredDataPoint, setHoveredDataPoint] = useState(null);
  
  // Selected / Hovered category on Donut Chart
  const [activeCategory, setActiveCategory] = useState(null);

  // Form State
  const [merchant, setMerchant] = useState('');
  const [category, setCategory] = useState('Food');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [formError, setFormError] = useState('');

  // SVG Area Chart Dimensions
  const chartWidth = 650;
  const chartHeight = 260;
  const chartPadding = { top: 20, right: 30, bottom: 40, left: 55 };


  // Calculate stats based on transactions
  const stats = useMemo(() => {
    const total = transactions.reduce((sum, tx) => sum + tx.amount, 0);
    const budgetPercent = Math.min((total / BUDGET_LIMIT) * 100, 100).toFixed(1);
    const dailyAverage = (total / 6).toFixed(0); // Divided by 6 days in mock range
    const remaining = Math.max(BUDGET_LIMIT - total, 0);

    return { total, budgetPercent, dailyAverage, remaining };
  }, [transactions]);

  // Aggregate Category Data for Donut Chart
  const categoryData = useMemo(() => {
    const map = {};
    Object.keys(CATEGORY_META).forEach(cat => {
      map[cat] = 0;
    });

    transactions.forEach(tx => {
      if (map[tx.category] !== undefined) {
        map[tx.category] += tx.amount;
      }
    });

    const list = Object.keys(map).map(name => ({
      name,
      amount: map[name],
      percentage: stats.total > 0 ? ((map[name] / stats.total) * 100).toFixed(1) : 0,
      ...CATEGORY_META[name]
    })).filter(item => item.amount > 0);

    // Sort by amount descending
    return list.sort((a, b) => b.amount - a.amount);
  }, [transactions, stats.total]);

  // Generate grouped bar chart data based on selected timeframe
  // Each point has: label, primary (Total Spend), secondary (New Expenses)
  const trendData = useMemo(() => {
    if (timeframe === 'Week') {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const primaryMap = { '01': 0, '02': 0, '03': 0, '04': 0, '05': 0, '06': 0, '07': 0 };
      transactions.forEach(tx => {
        const day = tx.date.split('-')[2];
        if (primaryMap[day] !== undefined) primaryMap[day] += tx.amount;
      });
      // Secondary series = new (recent) expenses: simulate as ~40-65% of primary
      const ratios = [0.55, 0.45, 0.62, 0.5, 0.58, 0.4, 0.48];
      return days.map((day, idx) => {
        const key = `0${idx + 1}`;
        const primary = primaryMap[key] || 0;
        return { label: day, primary, secondary: Math.round(primary * ratios[idx]) };
      });
    } else if (timeframe === 'Month') {
      const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      const weeklyMap = { w1: 0, w2: 0, w3: 0, w4: 0 };
      transactions.forEach(tx => {
        const day = parseInt(tx.date.split('-')[2]);
        if (day <= 7) weeklyMap.w1 += tx.amount;
        else if (day <= 14) weeklyMap.w2 += tx.amount;
        else if (day <= 21) weeklyMap.w3 += tx.amount;
        else weeklyMap.w4 += tx.amount;
      });
      const keys = ['w1', 'w2', 'w3', 'w4'];
      const ratios = [0.52, 0.48, 0.6, 0.44];
      return labels.map((label, idx) => {
        const primary = weeklyMap[keys[idx]] || 0;
        return { label, primary, secondary: Math.round(primary * ratios[idx]) };
      });
    } else {
      // Year view — monthly labels with simulated data
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      const basePrimary = [18000, 14000, 28000, 19000, 16000, 21000];
      const ratios = [0.6, 0.5, 0.62, 0.55, 0.48, 0.58];
      return months.map((label, idx) => ({
        label,
        primary: basePrimary[idx],
        secondary: Math.round(basePrimary[idx] * ratios[idx])
      }));
    }
  }, [transactions, timeframe]);

  // Compute grouped bar chart coordinates
  const chartCoordinates = useMemo(() => {
    if (trendData.length === 0) return [];

    const maxVal = Math.max(...trendData.map(d => Math.max(d.primary, d.secondary)), 1000);

    const usableWidth = chartWidth - chartPadding.left - chartPadding.right;
    const usableHeight = chartHeight - chartPadding.top - chartPadding.bottom;
    const count = trendData.length;
    const groupWidth = usableWidth / count;
    const barGap = 3;
    const barWidth = Math.min(22, groupWidth / 2 - barGap - 4);

    return trendData.map((d, index) => {
      const groupX = chartPadding.left + index * groupWidth;
      const centerX = groupX + groupWidth / 2;
      const primaryBarX = centerX - barWidth - barGap / 2;
      const secondaryBarX = centerX + barGap / 2;

      const primaryH = Math.max((d.primary / maxVal) * usableHeight, 4);
      const secondaryH = Math.max((d.secondary / maxVal) * usableHeight, 4);
      const bottomY = chartPadding.top + usableHeight;

      return {
        label: d.label,
        primary: d.primary,
        secondary: d.secondary,
        maxVal,
        centerX,
        primaryBarX,
        secondaryBarX,
        barWidth,
        primaryY: bottomY - primaryH,
        primaryH,
        secondaryY: bottomY - secondaryH,
        secondaryH,
        bottomY
      };
    });
  }, [trendData, chartPadding.left, chartPadding.right, chartPadding.top, chartPadding.bottom, chartWidth, chartHeight]);

  // Add Expense Submission
  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!merchant.trim()) {
      setFormError('Merchant name is required');
      return;
    }
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setFormError('Please enter a valid amount');
      return;
    }

    const newTx = {
      id: Date.now(),
      merchant: merchant.trim(),
      category,
      amount: Math.round(parseFloat(amount)),
      date: date || new Date().toISOString().split('T')[0]
    };

    setTransactions(prev => [newTx, ...prev]);
    setMerchant('');
    setAmount('');
    setFormError('');
  };

  // Delete transaction
  const handleDeleteTransaction = (id) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id));
  };

  // Filters
  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchesCategory = selectedCategoryFilter === 'All' || tx.category === selectedCategoryFilter;
      const matchesSearch = tx.merchant.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            tx.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [transactions, selectedCategoryFilter, searchTerm]);

  // Concentric Radial Chart helper computations
  const radialRays = useMemo(() => {
    if (categoryData.length === 0) return [];
    const maxVal = Math.max(...categoryData.map(c => c.amount), 1);
    const baseRadius = 82;
    const ringSpacing = 13;

    return categoryData.map((cat, idx) => {
      const radius = baseRadius - idx * ringSpacing;
      const circ = 2 * Math.PI * radius;
      const fillRatio = cat.amount / maxVal;
      const maxArcRatio = 0.85; 
      const dashLength = fillRatio * maxArcRatio * circ;

      return {
        ...cat,
        radius,
        circ,
        dashLength,
        fillRatio: (fillRatio * 100).toFixed(0)
      };
    });
  }, [categoryData]);

  // Center display information on Radial Chart
  const focusedRadialInfo = useMemo(() => {
    if (activeCategory) {
      const found = radialRays.find(c => c.name === activeCategory);
      if (found) return found;
    }
    return { name: 'Total Spent', amount: stats.total, percentage: '100', color: 'var(--text-primary)' };
  }, [activeCategory, radialRays, stats.total]);

  return (
    <div className="expenses-page animate-fade-in">
      <div className="expenses-header">
        <div>
          <h1 className="page-title">Expense Analytics</h1>
          <p className="page-subtitle">Track, analyze, and optimize your monthly outflow</p>
        </div>
        
        <div className="timeframe-selector">
          {['Year', 'Month', 'Week'].map(tf => (
            <button
              key={tf}
              className={`timeframe-btn ${timeframe === tf ? 'active' : ''}`}
              onClick={() => setTimeframe(tf)}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: 4 Metric Cards */}
      <div className="metrics-grid">
        <div className="metric-card shadow-card border-left-green">
          <div className="metric-card-info">
            <span className="metric-title">Total Outflow</span>
            <span className="metric-value">₹{stats.total.toLocaleString('en-IN')}</span>
            <div className="metric-trend negative">
              <TrendingUp size={14} />
              <span>Out of ₹{BUDGET_LIMIT.toLocaleString('en-IN')} Limit</span>
            </div>
          </div>
          <div className="metric-icon-box bg-green-light">
            <ArrowUpRight size={24} className="c-green" />
          </div>
        </div>

        <div className="metric-card shadow-card border-left-blue">
          <div className="metric-card-info">
            <span className="metric-title">Budget Used</span>
            <span className="metric-value">{stats.budgetPercent}%</span>
            <div className="metric-progress-track">
              <div 
                className="metric-progress-bar bg-blue" 
                style={{ width: `${stats.budgetPercent}%` }}
              />
            </div>
          </div>
          <div className="metric-icon-box bg-blue-light">
            <Percent size={22} className="c-blue" />
          </div>
        </div>

        <div className="metric-card shadow-card border-left-amber">
          <div className="metric-card-info">
            <span className="metric-title">Avg. Daily Spend</span>
            <span className="metric-value">₹{parseInt(stats.dailyAverage).toLocaleString('en-IN')}</span>
            <span className="metric-subtext">Estimated current rate</span>
          </div>
          <div className="metric-icon-box bg-amber-light">
            <Sparkles size={22} className="c-amber" />
          </div>
        </div>

        <div className="metric-card shadow-card border-left-rose">
          <div className="metric-card-info">
            <span className="metric-title">Remaining Budget</span>
            <span className="metric-value">₹{stats.remaining.toLocaleString('en-IN')}</span>
            <div className="metric-trend positive">
              <ArrowDownLeft size={14} />
              <span>Safe-to-spend buffer</span>
            </div>
          </div>
          <div className="metric-icon-box bg-rose-light">
            <ArrowDownLeft size={24} className="c-rose" />
          </div>
        </div>
      </div>

      {/* Grid: Charts Area */}
      <div className="charts-container-grid">
        {/* Grouped Bar Chart — Outflow Trend */}
        <div className="chart-card shadow-card trend-chart-card">
          <div className="chart-card-header">
            <div>
              <h3 className="chart-card-title">Outflow Trend</h3>
              <p className="chart-card-sub">{timeframe} spending overview</p>
            </div>
            {/* Legend */}
            <div className="grouped-bar-legend">
              <span className="gbl-dot" style={{ background: '#09543D' }} />
              <span className="gbl-label">Total Spend</span>
              <span className="gbl-dot" style={{ background: '#3E63EC' }} />
              <span className="gbl-label">New Expenses</span>
            </div>
          </div>

          <div
            className="svg-chart-wrapper trend-chart-svg-wrapper"
            onMouseLeave={() => setHoveredDataPoint(null)}
          >
            {chartCoordinates.length > 0 && (
              <svg width="100%" height="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
                <defs>
                  <linearGradient id="bar-primary-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#09543D" stopOpacity="1" />
                    <stop offset="100%" stopColor="#09543D" stopOpacity="0.55" />
                  </linearGradient>
                  <linearGradient id="bar-secondary-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3E63EC" stopOpacity="1" />
                    <stop offset="100%" stopColor="#3E63EC" stopOpacity="0.55" />
                  </linearGradient>
                  <linearGradient id="bar-primary-hover" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0a6b4d" stopOpacity="1" />
                    <stop offset="100%" stopColor="#09543D" stopOpacity="0.8" />
                  </linearGradient>
                  <linearGradient id="bar-secondary-hover" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5577f5" stopOpacity="1" />
                    <stop offset="100%" stopColor="#3E63EC" stopOpacity="0.8" />
                  </linearGradient>
                </defs>

                {/* Horizontal grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                  const usableHeight = chartHeight - chartPadding.top - chartPadding.bottom;
                  const y = chartPadding.top + ratio * usableHeight;
                  return (
                    <line
                      key={index}
                      x1={chartPadding.left}
                      y1={y}
                      x2={chartWidth - chartPadding.right}
                      y2={y}
                      stroke={ratio === 1 ? '#cbd5e1' : '#e2e8f0'}
                      strokeWidth={ratio === 1 ? '1.5' : '1'}
                      strokeDasharray={ratio === 1 ? '0' : '5 4'}
                    />
                  );
                })}

                {/* Grouped Bars */}
                {chartCoordinates.map((coord, idx) => {
                  const isHovered = hoveredDataPoint?.label === coord.label;
                  return (
                    <g key={idx}
                      onMouseEnter={() => setHoveredDataPoint(coord)}
                      style={{ cursor: 'pointer' }}
                    >
                      {/* Primary bar — Total Spend (forest green) */}
                      <rect
                        x={coord.primaryBarX}
                        y={coord.primaryY}
                        width={coord.barWidth}
                        height={coord.primaryH}
                        rx="4"
                        ry="4"
                        fill={isHovered ? 'url(#bar-primary-hover)' : 'url(#bar-primary-grad)'}
                        opacity={hoveredDataPoint === null || isHovered ? 1 : 0.5}
                        style={{ transition: 'all 0.2s ease' }}
                      />
                      {/* Secondary bar — New Expenses (royal blue) */}
                      <rect
                        x={coord.secondaryBarX}
                        y={coord.secondaryY}
                        width={coord.barWidth}
                        height={coord.secondaryH}
                        rx="4"
                        ry="4"
                        fill={isHovered ? 'url(#bar-secondary-hover)' : 'url(#bar-secondary-grad)'}
                        opacity={hoveredDataPoint === null || isHovered ? 1 : 0.5}
                        style={{ transition: 'all 0.2s ease' }}
                      />
                    </g>
                  );
                })}

                {/* X Axis Labels */}
                {chartCoordinates.map((coord, idx) => (
                  <text
                    key={idx}
                    x={coord.centerX}
                    y={chartHeight - 10}
                    textAnchor="middle"
                    fill={hoveredDataPoint?.label === coord.label ? '#09543D' : '#94a3b8'}
                    fontSize="11"
                    fontWeight={hoveredDataPoint?.label === coord.label ? '700' : '500'}
                    style={{ transition: 'all 0.15s ease' }}
                  >
                    {coord.label}
                  </text>
                ))}

                {/* Y Axis Labels */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                  const maxVal = chartCoordinates[0]?.maxVal || 1000;
                  const val = Math.round(maxVal * (1 - ratio));
                  const usableH = chartHeight - chartPadding.top - chartPadding.bottom;
                  const y = chartPadding.top + ratio * usableH + 4;
                  return (
                    <text key={idx} x={chartPadding.left - 8} y={y} textAnchor="end"
                      fill="#94a3b8" fontSize="10" fontWeight="500">
                      {val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}
                    </text>
                  );
                })}
              </svg>
            )}

            {/* Floating tooltip on hover */}
            {hoveredDataPoint && (
              <div
                className="trend-tooltip"
                style={{
                  left: `${(hoveredDataPoint.centerX / chartWidth) * 100}%`,
                  top: `${Math.max((hoveredDataPoint.primaryY / chartHeight) * 100 - 18, 2)}%`,
                }}
              >
                <div className="trend-tooltip-day">{hoveredDataPoint.label}</div>
                <div className="trend-tooltip-amount" style={{ color: '#09543D' }}>
                  ₹{hoveredDataPoint.primary.toLocaleString('en-IN')}
                  <span className="trend-tooltip-series"> Total</span>
                </div>
                <div className="trend-tooltip-amount" style={{ color: '#3E63EC', fontSize: '12px', marginTop: '2px' }}>
                  ₹{hoveredDataPoint.secondary.toLocaleString('en-IN')}
                  <span className="trend-tooltip-series"> New</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Category Breakdown Radial */}
        <div className="chart-card shadow-card">
          <div className="chart-card-header">
            <h3 className="chart-card-title">Category Breakdown</h3>
            <span className="chart-tag">Concentric Rings</span>
          </div>

          <div className="donut-chart-container">
            <div className="donut-svg-wrapper">
              <svg width="200" height="200" viewBox="0 0 200 200">
                {transactions.length === 0 ? (
                  <circle cx="100" cy="100" r="70" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                ) : (
                  radialRays.map((ray, idx) => (
                    <g key={idx}>
                      {/* Concentric Grey Track Background */}
                      <circle
                        cx="100"
                        cy="100"
                        r={ray.radius}
                        fill="none"
                        stroke="#f1f5f9"
                        strokeWidth="8"
                      />
                      {/* Active Colored Progress Segment */}
                      <circle
                        cx="100"
                        cy="100"
                        r={ray.radius}
                        fill="none"
                        stroke={ray.color}
                        strokeWidth={activeCategory === ray.name ? 11 : 8}
                        strokeDasharray={`${ray.dashLength} ${ray.circ}`}
                        strokeDashoffset={0}
                        strokeLinecap="round"
                        transform="rotate(-90 100 100)"
                        className="donut-segment"
                        onMouseEnter={() => setActiveCategory(ray.name)}
                        onMouseLeave={() => setActiveCategory(null)}
                        style={{ cursor: 'pointer', transition: 'all 0.25s ease' }}
                      />
                    </g>
                  ))
                )}
              </svg>

              {/* Inside info content */}
              <div className="donut-center-info">
                <span className="center-cat-name" style={{ color: focusedRadialInfo.color }}>
                  {focusedRadialInfo.name}
                </span>
                <span className="center-cat-val">
                  ₹{focusedRadialInfo.amount.toLocaleString('en-IN')}
                </span>
                {focusedRadialInfo.name !== 'Total Spent' && (
                  <span className="center-cat-percent">
                    Share: {focusedRadialInfo.percentage}%
                  </span>
                )}
              </div>
            </div>

            {/* Donut Legend */}
            <div className="donut-legend">
              {categoryData.length === 0 ? (
                <p className="no-legend-text">No expense categories to show.</p>
              ) : (
                categoryData.map((cat, idx) => (
                  <div 
                    key={idx} 
                    className={`legend-item ${activeCategory === cat.name ? 'highlighted' : ''}`}
                    onMouseEnter={() => setActiveCategory(cat.name)}
                    onMouseLeave={() => setActiveCategory(null)}
                  >
                    <span className="legend-badge" style={{ backgroundColor: cat.color }} />
                    <div className="legend-details">
                      <span className="legend-label">{cat.name}</span>
                      <span className="legend-percent">{cat.percentage}% of total</span>
                    </div>
                    <span className="legend-val">₹{cat.amount.toLocaleString('en-IN')}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Lower Section (Add Expense Form & Filters/List) */}
      <div className="bottom-dashboard-grid">
        {/* Left Side: Recent Entries / Filters */}
        <div className="bottom-card list-card shadow-card">
          <div className="bottom-card-header">
            <h3 className="bottom-card-title">Expense Transactions</h3>
            
            <div className="search-filters-row">
              <div className="search-input-box">
                <Search size={14} />
                <input 
                  type="text" 
                  placeholder="Search merchant..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="filter-select-box">
                <Filter size={14} />
                <select 
                  value={selectedCategoryFilter} 
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                >
                  <option value="All">All Categories</option>
                  {Object.keys(CATEGORY_META).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="transactions-list-scroll">
            {filteredTransactions.length === 0 ? (
              <div className="empty-list-placeholder">
                <p>No matching transactions found.</p>
              </div>
            ) : (
              filteredTransactions.map((tx) => {
                const meta = CATEGORY_META[tx.category] || { color: '#64748b', bgLight: '#f1f5f9' };
                return (
                  <div key={tx.id} className="expense-list-row">
                    <div className="expense-row-left">
                      <div 
                        className="cat-icon-container" 
                        style={{ backgroundColor: meta.bgLight, color: meta.color }}
                      >
                        {tx.merchant.charAt(0).toUpperCase()}
                      </div>
                      <div className="expense-row-details">
                        <span className="tx-merchant-name">{tx.merchant}</span>
                        <div className="tx-meta-info">
                          <span className="tx-category-badge" style={{ backgroundColor: meta.bgLight, color: meta.color }}>
                            {tx.category}
                          </span>
                          <span className="tx-date-str">{tx.date}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="expense-row-right">
                      <span className="tx-amount-text">-₹{tx.amount.toLocaleString('en-IN')}</span>
                      <button 
                        className="tx-delete-btn" 
                        onClick={() => handleDeleteTransaction(tx.id)}
                        aria-label="Delete entry"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Log Expense Form */}
        <div className="bottom-card form-card shadow-card">
          <div className="bottom-card-header">
            <h3 className="bottom-card-title">Quick Log Expense</h3>
            <p className="bottom-card-subtitle">Add a manual expense entry below</p>
          </div>

          <form onSubmit={handleAddExpense} className="expense-add-form">
            <div className="form-group">
              <label htmlFor="merchant"><DollarSign size={14} /> Merchant Name</label>
              <input 
                id="merchant"
                type="text" 
                placeholder="e.g. Swiggy, Amazon, Uber" 
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
              />
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="amount"><Plus size={14} /> Amount (₹)</label>
                <input 
                  id="amount"
                  type="number" 
                  placeholder="Amount" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="category"><Tag size={14} /> Category</label>
                <select 
                  id="category"
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {Object.keys(CATEGORY_META).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="date"><Calendar size={14} /> Date</label>
              <input 
                id="date"
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            {formError && <div className="form-error-msg">{formError}</div>}

            <button type="submit" className="form-submit-btn">
              <span>Log Transaction</span>
              <ChevronRight size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExpensesPage;
