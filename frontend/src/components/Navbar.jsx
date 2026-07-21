import React, { useState, useRef, useEffect } from 'react';
import {
  LayoutGrid,
  Target,
  BanknoteArrowDown,
  UsersRound,
  Bell,
  User,
  Settings,
  LogOut,
  CreditCard,
  ShieldCheck,
  ChevronDown,
  CheckCheck,
  ArrowUpRight,
  ArrowDownLeft,
  AlertCircle,
} from 'lucide-react';
import logo from '../circlepay_logo.png';
import './Navbar.css';

const notifications = [
  {
    id: 1,
    icon: ArrowDownLeft,
    iconClass: 'notif-icon income',
    title: 'Payment Received',
    desc: 'Riya sent you ₹1,200 for dinner split.',
    time: '2 min ago',
    unread: true,
  },
  {
    id: 2,
    icon: AlertCircle,
    iconClass: 'notif-icon alert',
    title: 'Debt Reminder',
    desc: 'You owe Arjun ₹850. Due in 2 days.',
    time: '1 hr ago',
    unread: true,
  },
  {
    id: 3,
    icon: ArrowUpRight,
    iconClass: 'notif-icon expense',
    title: 'Payment Sent',
    desc: 'You paid ₹3,400 for the trip expenses.',
    time: 'Yesterday',
    unread: false,
  },
  {
    id: 4,
    icon: ShieldCheck,
    iconClass: 'notif-icon success',
    title: 'Account Verified',
    desc: 'Your KYC verification is complete.',
    time: '2 days ago',
    unread: false,
  },
];

const profileMenu = [
  { icon: User,       label: 'My Profile',    desc: 'View & edit profile' },
  { icon: CreditCard, label: 'Payment Methods', desc: 'Manage cards & UPI' },
  { icon: Settings,   label: 'Settings',      desc: 'App preferences' },
];

const Navbar = ({ activeTab = 'Dashboard', setActiveTab }) => {
  const [notifOpen, setNotifOpen]     = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifRef   = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target))   setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const unreadCount = notifications.filter(n => n.unread).length;

  const menuItems = [
    { name: 'Dashboard', icon: LayoutGrid,       active: activeTab === 'Dashboard'  },
    { name: 'Expense',   icon: BanknoteArrowDown, active: activeTab === 'Expense' },
    { name: 'Groups',    icon: UsersRound,        active: activeTab === 'Groups' },
    { name: 'Goals',     icon: Target,            active: activeTab === 'Goals' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-brand">
          <img src={logo} alt="CirclePay Logo" className="navbar-brand-logo" />
        </div>
      </div>

      <div className="navbar-right">
        <div className="navbar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.name}
                href={`#${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                className={`navbar-link ${item.active ? 'active' : ''}`}
                onClick={(e) => {
                  if (setActiveTab) {
                    e.preventDefault();
                    setActiveTab(item.name);
                  }
                }}
              >
                <Icon className="navbar-icon" />
                <span>{item.name}</span>
              </a>
            );
          })}
        </div>

        <button className="navbar-split-btn">
          <UsersRound size={16} />
          <span>Split an Amount</span>
        </button>

        {/* ── Notification button + dropdown ── */}
        <div className="navbar-dropdown-wrapper" ref={notifRef}>
          <button
            className={`navbar-notification-btn ${notifOpen ? 'active' : ''}`}
            aria-label="Notifications"
            onClick={() => { setNotifOpen(o => !o); setProfileOpen(false); }}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="navbar-notification-badge">{unreadCount}</span>
            )}
          </button>

          {notifOpen && (
            <div className="navbar-dropdown notif-dropdown">
              <div className="dropdown-header">
                <span className="dropdown-title">Notifications</span>
                <button className="dropdown-mark-read">
                  <CheckCheck size={14} /> Mark all read
                </button>
              </div>

              <ul className="notif-list">
                {notifications.map(n => {
                  const Icon = n.icon;
                  return (
                    <li key={n.id} className={`notif-item ${n.unread ? 'unread' : ''}`}>
                      <div className={n.iconClass}>
                        <Icon size={15} />
                      </div>
                      <div className="notif-text">
                        <p className="notif-title">{n.title}</p>
                        <p className="notif-desc">{n.desc}</p>
                        <span className="notif-time">{n.time}</span>
                      </div>
                      {n.unread && <span className="notif-dot" />}
                    </li>
                  );
                })}
              </ul>

              <div className="dropdown-footer">
                <a href="#notifications">View all notifications</a>
              </div>
            </div>
          )}
        </div>

        {/* ── Profile button + dropdown ── */}
        <div className="navbar-dropdown-wrapper" ref={profileRef}>
          <button
            className={`navbar-profile ${profileOpen ? 'active' : ''}`}
            onClick={() => { setProfileOpen(o => !o); setNotifOpen(false); }}
            aria-label="Account menu"
          >
            <div className="navbar-avatar">A</div>
            <ChevronDown size={13} className={`profile-chevron ${profileOpen ? 'rotated' : ''}`} />
          </button>

          {profileOpen && (
            <div className="navbar-dropdown profile-dropdown">
              {/* User info */}
              <div className="profile-header">
                <div className="profile-header-avatar">A</div>
                <div>
                  <p className="profile-header-name">Aromal Finance</p>
                  <p className="profile-header-email">aromal@circlepay.in</p>
                </div>
              </div>

              <div className="dropdown-divider" />

              <ul className="profile-menu-list">
                {profileMenu.map(item => {
                  const Icon = item.icon;
                  return (
                    <li key={item.label} className="profile-menu-item">
                      <div className="profile-menu-icon">
                        <Icon size={15} />
                      </div>
                      <div>
                        <p className="profile-menu-label">{item.label}</p>
                        <p className="profile-menu-desc">{item.desc}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="dropdown-divider" />

              <button className="profile-logout-btn">
                <LogOut size={15} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
