import React, { useState } from 'react';
import { Eye, EyeOff, ArrowUp, ArrowDown, TrendingUp, Plus, Share2, Copy, Check, QrCode, Building, X, Wallet, CreditCard, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import './BalanceCard.css';
import walletArt from '../coin_euro.png';

// ─── Add Money Modal Component ───
const AddMoneyModal = ({ isOpen, onClose, onAddSuccess, currentBalance }) => {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [status, setStatus] = useState('idle'); // idle | processing | success
  const [error, setError] = useState('');

  const quickAmounts = [500, 1000, 2000, 5000];

  const handleSubmit = (e) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (val > 100000) {
      setError('Maximum deposit limit is ₹1,00,000');
      return;
    }
    setError('');
    setStatus('processing');
    
    // Simulate payment gateway delay
    setTimeout(() => {
      setStatus('success');
      onAddSuccess(val);
    }, 1500);
  };

  const handleQuickAdd = (val) => {
    setAmount(String(val));
    setError('');
  };

  const handleClose = () => {
    setAmount('');
    setPaymentMethod('upi');
    setStatus('idle');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="bc-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleClose}
    >
      <motion.div
        className="bc-modal-panel bc-modal-panel--sm"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bc-modal-header">
          <div className="bc-modal-title-group">
            <div className="bc-modal-icon-ring">
              <Wallet size={18} />
            </div>
            <div>
              <h2 className="bc-modal-title">Add Money</h2>
              <p className="bc-modal-subtitle">CirclePay Instant Top-up</p>
            </div>
          </div>
          <button className="bc-modal-close-btn" onClick={handleClose}>
            <X size={18} />
          </button>
        </div>

        {status === 'idle' && (
          <form className="bc-modal-form" onSubmit={handleSubmit}>
            <div className="bc-current-balance-row">
              <span className="bc-balance-label-sm">Wallet Balance:</span>
              <span className="bc-balance-val-sm">₹{currentBalance.toLocaleString('en-IN')}</span>
            </div>

            <div className="bc-form-group">
              <label className="bc-input-label">Enter Amount (₹)</label>
              <div className="bc-amount-input-wrapper">
                <span className="bc-amount-currency-symbol">₹</span>
                <input
                  type="number"
                  placeholder="0"
                  className="bc-amount-input"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    if (error) setError('');
                  }}
                  autoFocus
                />
              </div>
            </div>

            <div className="bc-quick-chips-row">
              {quickAmounts.map((val) => (
                <button
                  key={val}
                  type="button"
                  className="bc-quick-chip"
                  onClick={() => handleQuickAdd(val)}
                >
                  +₹{val.toLocaleString('en-IN')}
                </button>
              ))}
            </div>

            <div className="bc-form-group">
              <label className="bc-input-label">Select Payment Option</label>
              <div className="bc-payment-methods-list">
                <div
                  className={`bc-payment-method-item ${paymentMethod === 'upi' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('upi')}
                >
                  <div className="bc-payment-icon-wrapper upi-brand">
                    <Send size={14} style={{ transform: 'rotate(-45deg)' }} />
                  </div>
                  <div className="bc-payment-details">
                    <span className="bc-payment-name">UPI (Google Pay, PhonePe, Paytm)</span>
                    <span className="bc-payment-desc">Instant, no fee</span>
                  </div>
                  <div className="bc-payment-radio" />
                </div>

                <div
                  className={`bc-payment-method-item ${paymentMethod === 'card' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <div className="bc-payment-icon-wrapper card-brand">
                    <CreditCard size={14} />
                  </div>
                  <div className="bc-payment-details">
                    <span className="bc-payment-name">Saved Debit Card (•••• 4242)</span>
                    <span className="bc-payment-desc">HDFC Bank • Visa</span>
                  </div>
                  <div className="bc-payment-radio" />
                </div>

                <div
                  className={`bc-payment-method-item ${paymentMethod === 'netbanking' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('netbanking')}
                >
                  <div className="bc-payment-icon-wrapper bank-brand">
                    <Building size={14} />
                  </div>
                  <div className="bc-payment-details">
                    <span className="bc-payment-name">Net Banking</span>
                    <span className="bc-payment-desc">All major Indian banks supported</span>
                  </div>
                  <div className="bc-payment-radio" />
                </div>
              </div>
            </div>

            {error && <div className="bc-form-error">{error}</div>}

            <div className="bc-modal-actions">
              <button type="button" className="bc-btn-cancel" onClick={handleClose}>
                Cancel
              </button>
              <button type="submit" className="bc-btn-submit">
                Add ₹{amount ? parseFloat(amount).toLocaleString('en-IN') : '0'}
              </button>
            </div>
          </form>
        )}

        {status === 'processing' && (
          <div className="bc-status-container">
            <div className="bc-loader-spinner" />
            <h3 className="bc-status-title">Processing Payment</h3>
            <p className="bc-status-desc">Please do not refresh or close this window.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="bc-status-container scale-up-in">
            <div className="bc-success-checkmark-ring">
              <svg className="bc-checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                <circle className="bc-checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                <path className="bc-checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
              </svg>
            </div>
            <h3 className="bc-status-title success-color">Money Added Successfully!</h3>
            <p className="bc-status-desc">
              ₹{parseFloat(amount).toLocaleString('en-IN')} has been added to your CirclePay wallet.
            </p>
            <button type="button" className="bc-btn-success-done" onClick={handleClose}>
              Done
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

// ─── Share Details Modal Component ───
const ShareModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('qr'); // qr | bank
  const [copiedStates, setCopiedStates] = useState({});

  const upiId = 'circlepay.aromal@okaxis';
  const bankDetails = {
    holder: 'Aromal Finance',
    account: '918273640591',
    ifsc: 'CRCP0000101',
    bankName: 'CirclePay Payments Bank',
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedStates((prev) => ({ ...prev, [key]: true }));
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [key]: false }));
      }, 2000);
    });
  };

  const handleShareAPI = () => {
    if (navigator.share) {
      navigator.share({
        title: 'CirclePay Account Details',
        text: `Send money to my CirclePay wallet:\nUPI ID: ${upiId}\nAccount: ${bankDetails.account}\nIFSC: ${bankDetails.ifsc}`,
      }).catch((err) => console.log('Web Share failed', err));
    } else {
      copyToClipboard(`UPI ID: ${upiId}\nAccount: ${bankDetails.account}\nIFSC: ${bankDetails.ifsc}\nBank: ${bankDetails.bankName}`, 'general');
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="bc-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bc-modal-panel bc-modal-panel--sm"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bc-modal-header">
          <div className="bc-modal-title-group">
            <div className="bc-modal-icon-ring">
              <Share2 size={18} />
            </div>
            <div>
              <h2 className="bc-modal-title">Share Details</h2>
              <p className="bc-modal-subtitle">Receive money into your wallet</p>
            </div>
          </div>
          <button className="bc-modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="bc-share-tabs">
          <button
            className={`bc-share-tab-btn ${activeTab === 'qr' ? 'active' : ''}`}
            onClick={() => setActiveTab('qr')}
          >
            <QrCode size={14} />
            UPI QR Code
          </button>
          <button
            className={`bc-share-tab-btn ${activeTab === 'bank' ? 'active' : ''}`}
            onClick={() => setActiveTab('bank')}
          >
            <Building size={14} />
            Bank Transfer
          </button>
        </div>

        <div className="bc-share-content">
          {activeTab === 'qr' && (
            <div className="bc-qr-tab-content animate-fade-in">
              <div className="bc-qr-card">
                <div className="bc-qr-border-glow" />
                <svg className="bc-qr-svg" viewBox="0 0 100 100" width="150" height="150">
                  {/* Position markers */}
                  <rect x="5" y="5" width="22" height="22" rx="3" fill="none" stroke="var(--primary)" strokeWidth="4.5" />
                  <rect x="9.5" y="9.5" width="13" height="13" rx="1.5" fill="var(--primary)" />
                  
                  <rect x="73" y="5" width="22" height="22" rx="3" fill="none" stroke="var(--primary)" strokeWidth="4.5" />
                  <rect x="77.5" y="9.5" width="13" height="13" rx="1.5" fill="var(--primary)" />
                  
                  <rect x="5" y="73" width="22" height="22" rx="3" fill="none" stroke="var(--primary)" strokeWidth="4.5" />
                  <rect x="9.5" y="77.5" width="13" height="13" rx="1.5" fill="var(--primary)" />
                  
                  {/* Small alignment tracking marker */}
                  <rect x="76" y="76" width="9" height="9" rx="1" fill="none" stroke="var(--primary)" strokeWidth="2.5" />
                  <rect x="79" y="79" width="3" height="3" fill="var(--primary)" />

                  {/* QR details mock path */}
                  <path d="M 33 5 H 39 V 11 H 33 Z M 43 5 H 55 V 9 H 43 Z M 60 5 H 67 V 11 H 60 Z M 33 15 H 48 V 21 H 33 Z M 53 15 H 67 V 21 H 53 Z M 33 25 H 41 V 37 H 33 Z M 47 25 H 55 V 31 H 47 Z M 61 25 H 67 V 37 H 61 Z M 33 41 H 47 V 47 H 33 Z M 51 41 H 67 V 47 H 51 Z M 5 33 H 13 V 39 H 5 Z M 19 33 H 29 V 39 H 19 Z M 5 43 H 25 V 49 H 5 Z M 5 53 H 19 V 59 H 5 Z M 23 53 H 29 V 67 H 23 Z M 73 33 H 83 V 39 H 73 Z M 89 33 H 95 V 45 H 89 Z M 73 43 H 87 V 49 H 73 Z M 73 53 H 91 V 59 H 73 Z M 83 61 H 95 V 67 H 83 Z M 33 53 H 47 V 59 H 33 Z M 53 53 H 67 V 59 H 53 Z M 33 63 H 41 V 69 H 33 Z M 47 63 H 57 V 69 H 47 Z M 63 63 H 67 V 69 H 63 Z M 33 73 H 47 V 79 H 33 Z M 53 73 H 67 V 79 H 53 Z M 33 83 H 41 V 91 H 33 Z M 47 83 H 59 V 91 H 47 Z M 63 83 H 67 V 91 H 63 Z M 73 73 H 77 V 91 H 73 Z M 81 73 H 89 V 81 H 81 Z M 81 85 H 93 V 91 H 81 Z M 5 65 H 17 V 69 H 5 Z" fill="var(--primary)" opacity="0.85" />
                  
                  {/* Center circular custom logo overlay */}
                  <circle cx="50" cy="50" r="10" fill="white" stroke="var(--primary)" strokeWidth="1.5" />
                  <circle cx="50" cy="50" r="7.5" fill="var(--primary)" />
                  <path d="M 47.5 48 L 52.5 45.5 L 52.5 52 Z" fill="white" />
                </svg>
                <div className="bc-qr-logo-tag">CirclePay UPI Safe</div>
              </div>

              <div className="bc-copy-field">
                <div className="bc-copy-field-label">UPI ID</div>
                <div className="bc-copy-field-value-row">
                  <span className="bc-copy-val-text">{upiId}</span>
                  <button
                    className={`bc-copy-btn ${copiedStates.upi ? 'copied' : ''}`}
                    onClick={() => copyToClipboard(upiId, 'upi')}
                  >
                    {copiedStates.upi ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bank' && (
            <div className="bc-bank-tab-content animate-fade-in">
              <div className="bc-bank-details-card">
                <div className="bc-detail-item">
                  <span className="bc-detail-label">Account Holder</span>
                  <span className="bc-detail-val">{bankDetails.holder}</span>
                </div>
                <div className="bc-detail-divider" />
                <div className="bc-detail-item">
                  <span className="bc-detail-label">Account Number</span>
                  <div className="bc-detail-val-row">
                    <span className="bc-detail-val font-mono">{bankDetails.account}</span>
                    <button
                      className={`bc-inline-copy-btn ${copiedStates.account ? 'copied' : ''}`}
                      onClick={() => copyToClipboard(bankDetails.account, 'account')}
                    >
                      {copiedStates.account ? <Check size={13} /> : <Copy size={13} />}
                    </button>
                  </div>
                </div>
                <div className="bc-detail-divider" />
                <div className="bc-detail-item">
                  <span className="bc-detail-label">IFSC Code</span>
                  <div className="bc-detail-val-row">
                    <span className="bc-detail-val font-mono">{bankDetails.ifsc}</span>
                    <button
                      className={`bc-inline-copy-btn ${copiedStates.ifsc ? 'copied' : ''}`}
                      onClick={() => copyToClipboard(bankDetails.ifsc, 'ifsc')}
                    >
                      {copiedStates.ifsc ? <Check size={13} /> : <Copy size={13} />}
                    </button>
                  </div>
                </div>
                <div className="bc-detail-divider" />
                <div className="bc-detail-item">
                  <span className="bc-detail-label">Bank Name</span>
                  <span className="bc-detail-val">{bankDetails.bankName}</span>
                </div>
              </div>

              <button
                type="button"
                className={`bc-copy-all-btn ${copiedStates.bankAll ? 'copied' : ''}`}
                onClick={() => {
                  const detailsText = `Account Holder: ${bankDetails.holder}\nAccount Number: ${bankDetails.account}\nIFSC Code: ${bankDetails.ifsc}\nBank: ${bankDetails.bankName}`;
                  copyToClipboard(detailsText, 'bankAll');
                }}
              >
                {copiedStates.bankAll ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                    <Check size={15} /> All Details Copied!
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                    <Copy size={15} /> Copy All Bank Details
                  </span>
                )}
              </button>
            </div>
          )}
        </div>

        <div className="bc-social-share-section">
          <div className="bc-social-share-title">Or share via</div>
          <div className="bc-social-share-row">
            <button className="bc-social-btn whatsapp-btn" onClick={handleShareAPI}>
              WhatsApp
            </button>
            <button className="bc-social-btn telegram-btn" onClick={handleShareAPI}>
              Telegram
            </button>
            <button className="bc-social-btn email-btn" onClick={handleShareAPI}>
              Email
            </button>
          </div>
          {copiedStates.general && (
            <div className="bc-general-copied-toast">All details copied to clipboard!</div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Main Balance Card Component ───
const BalanceCard = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [balance, setBalance] = useState(24560);
  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const spentPercent = 62;

  const toggleVisibility = () => setIsVisible(v => !v);

  const handleAddSuccess = (amountAdded) => {
    setBalance(prev => prev + amountAdded);
  };

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="balance-card">

      {/* ── Far Left: Illustration ── */}
      <div className="balance-right">
        <img
          src={walletArt}
          alt="Euro Coin Illustration"
          className="balance-wallet-art"
        />
      </div>

      {/* ── Balance Info ── */}
      <div className="balance-left">
        <div className="balance-header">
          <p className="balance-label">Total Balance</p>
          <button
            className="visibility-btn"
            onClick={toggleVisibility}
            aria-label={isVisible ? 'Hide balance' : 'Show balance'}
          >
            {isVisible ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>

        <h2 className="balance-amount">
          {isVisible ? formatINR(balance) : '••••••'}
        </h2>

        <div className="balance-change-chip">
          <TrendingUp size={13} />
          <span>+12.4% from last month</span>
        </div>

        <div className="balance-quick-actions">
          <button 
            className="balance-action-btn primary-action"
            onClick={() => setIsAddMoneyOpen(true)}
          >
            <Plus size={15} />
            Add Money
          </button>
          <button 
            className="balance-action-btn secondary-action"
            onClick={() => setIsShareOpen(true)}
          >
            <Share2 size={15} />
            Share
          </button>
        </div>
      </div>

      {/* ── Center: Stats + Progress ── */}
      <div className="balance-center">
        <div className="balance-stats-row">
          <div className="balance-stat income">
            <div className="balance-stat-icon">
              <ArrowUp size={18} />
            </div>
            <div className="balance-stat-info">
              <span className="balance-stat-label">Income</span>
              <span className="balance-stat-value">{isVisible ? '₹38,200' : '••••'}</span>
            </div>
          </div>

          <div className="balance-stat-divider" />

          <div className="balance-stat expense">
            <div className="balance-stat-icon">
              <ArrowDown size={18} />
            </div>
            <div className="balance-stat-info">
              <span className="balance-stat-label">Expense</span>
              <span className="balance-stat-value">{isVisible ? '₹13,640' : '••••'}</span>
            </div>
          </div>

          <div className="balance-stat-divider" />

          <div className="balance-stat savings">
            <div className="balance-stat-icon">
              <TrendingUp size={18} />
            </div>
            <div className="balance-stat-info">
              <span className="balance-stat-label">Savings</span>
              <span className="balance-stat-value">{isVisible ? '₹10,920' : '••••'}</span>
            </div>
          </div>
        </div>

        {/* Spending Progress */}
        <div className="balance-progress-section">
          <div className="balance-progress-header">
            <span className="balance-progress-label">Monthly Budget Used</span>
            <span className="balance-progress-pct">{spentPercent}%</span>
          </div>
          <div className="balance-progress-track">
            <div
              className="balance-progress-fill"
              style={{ width: `${spentPercent}%` }}
            />
          </div>
          <div className="balance-progress-legend">
            <span>₹13,640 spent</span>
            <span>₹22,000 budget</span>
          </div>
        </div>
      </div>

      {/* ── Modals Overlay Rendered via Framer Motion's AnimatePresence ── */}
      <AnimatePresence>
        {isAddMoneyOpen && (
          <AddMoneyModal
            isOpen={isAddMoneyOpen}
            onClose={() => setIsAddMoneyOpen(false)}
            onAddSuccess={handleAddSuccess}
            currentBalance={balance}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isShareOpen && (
          <ShareModal
            isOpen={isShareOpen}
            onClose={() => setIsShareOpen(false)}
          />
        )}
      </AnimatePresence>

    </div>
  );
};

export default BalanceCard;
