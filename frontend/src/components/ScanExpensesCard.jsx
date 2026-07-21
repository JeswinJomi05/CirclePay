import React, { useState, useRef } from 'react';
import {
  Scan, ArrowRight, Zap, Tag, Upload, ImagePlus,
  X, CheckCircle, Loader2, ShoppingBag, Calendar,
  DollarSign, Tag as TagIcon, Plus,
} from 'lucide-react';
import receiptImg from '../scan_receipt.png';
import './ScanExpensesCard.css';

const features = [
  { icon: Zap,    label: 'Auto-detect' },
  { icon: Tag,    label: 'Smart Tagging' },
  { icon: Upload, label: 'Instant Upload' },
];

const MOCK_RESULT = {
  merchant: 'Swiggy',
  amount:   '₹428.00',
  date:     'Today, 4 Jul 2026',
  category: 'Food & Dining',
};

/* ── States: null | 'scanning' | 'processing' | 'result' | 'upload-preview' ── */

const ScanExpensesCard = () => {
  const [modal,       setModal]       = useState(null);
  const [uploadSrc,   setUploadSrc]   = useState(null);
  const fileRef = useRef(null);

  const closeModal = () => { setModal(null); setUploadSrc(null); };

  /* Scan Now flow */
  const handleScanNow = () => {
    setModal('scanning');
    setTimeout(() => setModal('processing'), 2200);
    setTimeout(() => setModal('result'),     3800);
  };

  /* Upload flow */
  const handleUploadClick = () => fileRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setUploadSrc(url);
    setModal('upload-preview');
    e.target.value = '';           // reset so same file can be re-selected
  };

  const handleAnalyze = () => {
    setModal('processing');
    setTimeout(() => setModal('result'), 2000);
  };

  return (
    <>
      <div className="scan-expenses-card">

        {/* Header */}
        <div className="scan-card-header">
          <div className="scanner-icon-wrapper">
            <Scan className="scanner-icon" />
          </div>
          <div className="scan-info-text">
            <h3 className="scan-title">Capture Your Expenses</h3>
            <p className="scan-subtitle">Scan receipts &amp; track instantly</p>
          </div>
        </div>

        {/* Receipt preview */}
        <div className="scan-preview-strip">
          <img src={receiptImg} alt="Receipt preview" className="scan-preview-img" />
          <div className="scan-preview-overlay">
            <span className="scan-preview-badge">Receipt detected ✓</span>
          </div>
        </div>

        {/* Feature pills */}
        <div className="scan-features-row">
          {features.map(({ icon: Icon, label }) => (
            <div key={label} className="scan-feature-pill">
              <Icon className="scan-feature-icon" />
              <span>{label}</span>
            </div>
          ))}
        </div>

        {/* Primary CTA */}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button className="scan-button" onClick={handleScanNow}>
            <Scan size={16} />
            <span>Scan Now</span>
            <ArrowRight className="scan-button-icon" />
          </button>

          {/* Secondary action */}
          <button className="scan-secondary-btn" onClick={handleUploadClick}>
            <ImagePlus size={14} />
            <span>Upload from Gallery</span>
          </button>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>

      {/* ══════════ MODAL OVERLAY ══════════ */}
      {modal && (
        <div className="scan-modal-overlay" onClick={closeModal}>
          <div className="scan-modal" onClick={e => e.stopPropagation()}>

            {/* ── SCANNING state ── */}
            {modal === 'scanning' && (
              <div className="scan-modal-scanner">
                <button className="scan-modal-close" onClick={closeModal}><X size={18}/></button>
                <p className="scan-modal-label">Position receipt in frame…</p>
                <div className="scan-viewfinder">
                  <img src={receiptImg} alt="" className="scan-viewfinder-img" />
                  <div className="scan-line" />
                  <div className="scan-corner tl"/><div className="scan-corner tr"/>
                  <div className="scan-corner bl"/><div className="scan-corner br"/>
                </div>
                <p className="scan-modal-hint">Hold steady — scanning automatically</p>
              </div>
            )}

            {/* ── PROCESSING state ── */}
            {modal === 'processing' && (
              <div className="scan-modal-processing">
                <div className="scan-spinner">
                  <Loader2 size={36} className="spin-icon" />
                </div>
                <p className="scan-modal-proc-title">Analysing Receipt…</p>
                <p className="scan-modal-proc-sub">Extracting amount, merchant &amp; date</p>
                <div className="scan-proc-bar">
                  <div className="scan-proc-fill" />
                </div>
              </div>
            )}

            {/* ── UPLOAD PREVIEW state ── */}
            {modal === 'upload-preview' && (
              <div className="scan-modal-upload">
                <button className="scan-modal-close" onClick={closeModal}><X size={18}/></button>
                <p className="scan-modal-label">Receipt Preview</p>
                {uploadSrc && (
                  <img src={uploadSrc} alt="Uploaded receipt" className="scan-upload-preview-img" />
                )}
                <button className="scan-analyze-btn" onClick={handleAnalyze}>
                  <Zap size={15} /> Analyse Receipt
                </button>
              </div>
            )}

            {/* ── RESULT state ── */}
            {modal === 'result' && (
              <div className="scan-modal-result">
                <button className="scan-modal-close" onClick={closeModal}><X size={18}/></button>
                <div className="scan-result-header">
                  <CheckCircle size={32} className="scan-result-check" />
                  <p className="scan-result-title">Receipt Captured!</p>
                  <p className="scan-result-sub">Review details below</p>
                </div>

                <div className="scan-result-fields">
                  <div className="scan-result-row">
                    <div className="scan-result-icon"><ShoppingBag size={14}/></div>
                    <div>
                      <span className="scan-result-key">Merchant</span>
                      <span className="scan-result-val">{MOCK_RESULT.merchant}</span>
                    </div>
                  </div>
                  <div className="scan-result-row">
                    <div className="scan-result-icon"><DollarSign size={14}/></div>
                    <div>
                      <span className="scan-result-key">Amount</span>
                      <span className="scan-result-val highlight">{MOCK_RESULT.amount}</span>
                    </div>
                  </div>
                  <div className="scan-result-row">
                    <div className="scan-result-icon"><Calendar size={14}/></div>
                    <div>
                      <span className="scan-result-key">Date</span>
                      <span className="scan-result-val">{MOCK_RESULT.date}</span>
                    </div>
                  </div>
                  <div className="scan-result-row">
                    <div className="scan-result-icon"><TagIcon size={14}/></div>
                    <div>
                      <span className="scan-result-key">Category</span>
                      <span className="scan-result-val">{MOCK_RESULT.category}</span>
                    </div>
                  </div>
                </div>

                <div className="scan-result-actions">
                  <button className="scan-result-add-btn" onClick={closeModal}>
                    <Plus size={15}/> Add to Expenses
                  </button>
                  <button className="scan-result-cancel-btn" onClick={closeModal}>
                    Discard
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
};

export default ScanExpensesCard;
