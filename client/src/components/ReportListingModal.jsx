import { useEffect, useState } from 'react';
import '../stylesheets/report-modal.css';
import { submitReport } from '../api/reportService';

const REASON_OPTIONS = [
  'Spam or scam',
  'Inaccurate information',
  'Inappropriate content',
  'Fake listing',
  'Other',
];

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ReportListingModal({ open, listingId, listingTitle, onClose }) {
  const [reason, setReason] = useState(REASON_OPTIONS[0]);
  const [details, setDetails] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open) {
      setReason(REASON_OPTIONS[0]);
      setDetails('');
      setStatus('idle');
      setError(null);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && open) onClose();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalReason = details.trim() ? `${reason}: ${details.trim()}` : reason;

    setStatus('submitting');
    setError(null);

    try {
      await submitReport(listingId, finalReason);
      setStatus('success');
      setTimeout(onClose, 1200);
    } catch (err) {
      setStatus('error');
      setError(err.message);
    }
  };

  return (
    <div className="report-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="reportModalTitle" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="report-modal" onClick={(e) => e.stopPropagation()}>
        <div className="report-modal__header">
          <div>
            <p className="report-modal__eyebrow">Report Listing</p>
            <h2 id="reportModalTitle" className="report-modal__title">Report {listingTitle}</h2>
          </div>
          <button className="report-modal__close" type="button" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>

        {status !== 'success' ? (
          <form onSubmit={handleSubmit} className="report-modal__form">
            <label className="report-modal__label" htmlFor="reportReason">Reason</label>
            <select
              id="reportReason"
              className="report-modal__select"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            >
              {REASON_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>

            <label className="report-modal__label" htmlFor="reportDetails">Additional details</label>
            <textarea
              id="reportDetails"
              className="report-modal__textarea"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={4}
              maxLength={300}
            />

            <div className="report-modal__footer">
              <span className="report-modal__counter">{details.length}/300</span>
              {error && <p className="report-modal__error">{error}</p>}
              <button className="report-modal__submit" type="submit" disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Submitting…' : 'Submit Report'}
              </button>
            </div>
          </form>
        ) : (
          <div className="report-modal__success">
            <div className="report-modal__success-icon">✓</div>
            <h3>Report submitted</h3>
            <p>Thanks. We’ll review {listingTitle} shortly.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReportListingModal;