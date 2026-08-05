import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import GroupNav from '../components/group/GroupNav';
import { useAsync } from '../hook/useAsync';
import { fetchGroupById, fetchMyGroup, submitGroupApplication } from '../api/padpalApi';
import '../stylesheets/padpal-group.css';

const EMPTY_FORM = { name: '', age: '', gender: '', email: '', notes: '' };

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'nonbinary', label: 'Non-binary' },
  { value: 'other', label: 'Other' },
];

export default function GroupApply() {
  const { id: groupId } = useParams();
  const navigate = useNavigate();
  const { data: group, loading, error } = useAsync(() => fetchGroupById(groupId), [groupId]);
  const { data: myGroup } = useAsync(fetchMyGroup, []);
  const [form, setForm] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [submitError, setSubmitError] = useState(null);

  const canApply = !myGroup?.id;
  const applyDisabledMessage = myGroup?.id
    ? 'You are already part of a group and cannot apply to another one.'
    : null;

  useEffect(() => {
    document.title = group?.name ? `PadPal – Apply to ${group.name}` : 'PadPal – Apply to Group';
  }, [group]);

  if (loading) {
    return (
      <>
        <GroupNav />
        <p style={{ padding: 48, textAlign: 'center' }}>Loading application form…</p>
      </>
    );
  }

  if (error || !group) {
    return (
      <>
        <GroupNav />
        <p style={{ padding: 48, textAlign: 'center' }}>
          {error ? `Something went wrong: ${error.message}` : 'This group could not be found.'}
        </p>
      </>
    );
  }

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
      setTimeout(() => navigate('/student-discover-communities'), 1400);
    } catch (err) {
      setStatus('error');
      setSubmitError(err);
    }
  }

  return (
    <main className="page-container">
      <GroupNav />
      <section className="group-apply-page" style={{ padding: '24px 16px' }}>
        <div className="page-head">
          <div>
            <h1 style={{ margin: 0, fontSize: '2rem' }}>Apply to Join</h1>
            <p style={{ marginTop: 8, color: '#555' }}>Your application will be sent to {group.name}.</p>
          </div>
          <NavLink to={`/student-group-profile/${groupId}`} className="button button-secondary">
            Back to Group
          </NavLink>
        </div>

        {!canApply ? (
          <div className="card" style={{ marginTop: 24 }}>
            <p style={{ margin: 0, color: '#6b7280' }}>{applyDisabledMessage}</p>
            <div style={{ marginTop: 18 }}>
              <NavLink to="/student-discover-communities" className="button button-primary">
                Discover Communities
              </NavLink>
            </div>
          </div>
        ) : (
          <div className="card" style={{ marginTop: 24 }}>
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

                <div className="modal-footer" style={{ marginTop: 24, justifyContent: 'flex-start' }}>
                  <button className="btn-cancel" type="button" onClick={() => navigate(`/student-group-profile/${groupId}`)}>
                    Cancel
                  </button>
                  <button className="btn-submit" type="submit" disabled={status === 'submitting'}>
                    {status === 'submitting' ? 'Submitting…' : 'Submit Application'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="modal-success show">
                <div className="success-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div className="success-title">Application Sent!</div>
                <div className="success-sub">{group.name} will be in touch soon.</div>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
