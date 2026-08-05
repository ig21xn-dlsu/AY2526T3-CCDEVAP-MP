import React, { useEffect, useState } from 'react';
import { submitGroupApplication } from '../../api/padpalApi'; // api placeholder
import { NavLink, useNavigate } from 'react-router-dom';

const EMPTY_FORM = { name: '', age: '', gender: '', email: '', notes: '' };

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'nonbinary', label: 'Non-binary' },
  { value: 'other', label: 'Other' },
];

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function SubmitArrowIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export default function ApplyModal({ open, groupId, groupName, onClose }) {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [submitError, setSubmitError] = useState(null);

  // reset form and lock scroll whenever the modal opens.
  useEffect(() => {
    if (open) {
      setForm(EMPTY_FORM);
      setFieldErrors({});
      setStatus('idle');
      setSubmitError(null);
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

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const clearError = (key) => () => setFieldErrors((fe) => (fe[key] ? { ...fe, [key]: false } : fe));

  async function handleSubmit(e) {
    e.preventDefault();

    const errors = {};
    if (!form.name.trim()) errors.name = true;
    if (!form.email.trim()) errors.email = true;
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }

    setStatus('submitting');
    setSubmitError(null);
    try {
      await submitGroupApplication(groupId, form);
      setStatus('success');
      setTimeout(() => {
        onClose();
        navigate('/student-discover-communities');
      }, 1400);
    } catch (err) {
      setStatus('error');
      setSubmitError(err);
    }
  }

  return (
    <div
      id="modalBackdrop"
      className="modal-backdrop open"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >

<div className="modal">
  <div className="modal-header">
    <h2 id="modalTitle" className="modal-title">
      Apply to Join {groupName}
    </h2>

    <NavLink
      to="/student-discover-communities"
      className="modal-close"
      aria-label="Close"
      
    >
      <CloseIcon />
    </NavLink>
  </div>

        {status !== 'success' ? (
          <form id="applyForm" noValidate onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="fieldName">Full Name</label>
                <input
                  id="fieldName"
                  className="form-input"
                  type="text"
                  placeholder="Alex Johnson"
                  value={form.name}
                  onChange={update('name')}
                  onInput={clearError('name')}
                  style={fieldErrors.name ? { borderColor: '#EF4444' } : undefined}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="fieldAge">Age</label>
                <input
                  id="fieldAge"
                  className="form-input"
                  type="number"
                  placeholder="21"
                  min="18"
                  max="99"
                  value={form.age}
                  onChange={update('age')}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Gender</label>
              <div className="gender-group">
                {GENDER_OPTIONS.map((g) => (
                  <React.Fragment key={g.value}>
                    <input
                      className="gender-opt"
                      type="radio"
                      name="gender"
                      id={`gender-${g.value}`}
                      value={g.value}
                      checked={form.gender === g.value}
                      onChange={update('gender')}
                    />
                    <label className="gender-label" htmlFor={`gender-${g.value}`}>{g.label}</label>
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label" htmlFor="fieldEmail">University Email</label>
              <input
                id="fieldEmail"
                className="form-input"
                type="email"
                placeholder="alex.j@university.edu"
                value={form.email}
                onChange={update('email')}
                onInput={clearError('email')}
                style={fieldErrors.email ? { borderColor: '#EF4444' } : undefined}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="fieldNotes">Other Notes / Message</label>
              <textarea
                id="fieldNotes"
                className="form-textarea"
                placeholder="Tell us about yourself and why you'd be a great roommate…"
                value={form.notes}
                onChange={update('notes')}
              />
            </div>

            {status === 'error' && (
              <p style={{ color: '#EF4444', fontSize: '0.82rem', marginTop: 12 }}>
                Couldn't send your application{submitError ? `: ${submitError.message}` : ''}. Please try again.
              </p>
            )}
          </form>
        ) : (
          <div className="modal-success show">
            <div className="success-icon">
              <CheckIcon />
            </div>
            <div className="success-title">Application Sent!</div>
            <div className="success-sub">{groupName} will be in touch soon.</div>
          </div>
        )}

        {status !== 'success' && (
          <div className="modal-footer">
            <button className="btn-cancel" type="button" onClick={onClose}>Cancel</button>
            <button className="btn-submit" type="submit" form="applyForm" disabled={status === 'submitting'}>
              {status === 'submitting' ? 'Submitting…' : 'Submit Application'}
              <SubmitArrowIcon />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
