import React, { useEffect, useState } from 'react';
import { Modal, Form, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { submitGroupApplication } from '../../api/padpalApi'; // api placeholder

const EMPTY_FORM = { name: '', age: '', gender: '', email: '', notes: '' };

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'nonbinary', label: 'Non-binary' },
  { value: 'other', label: 'Other' },
];

export default function ApplyModal({ open, groupId, groupName, onClose }) {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [submitError, setSubmitError] = useState(null);

  // reset form whenever the modal opens
  useEffect(() => {
    if (open) {
      setForm(EMPTY_FORM);
      setFieldErrors({});
      setStatus('idle');
      setSubmitError(null);
    }
  }, [open]);

  const update = (key) => (e) => {
    const { value } = e.target;
    setForm((f) => ({ ...f, [key]: value }));
    setFieldErrors((fe) => (fe[key] ? { ...fe, [key]: false } : fe));
  };

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

  const modalContent = (
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
                  isInvalid={!!fieldErrors.name}
                  required
                />
              </Form.Group>

              <Form.Group as={Col} controlId="fieldAge">
                <Form.Label>Age</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="21"
                  min="18"
                  max="99"
                  value={form.age}
                  onChange={update('age')}
                />
              </Form.Group>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="d-block">Gender</Form.Label>
              {GENDER_OPTIONS.map((g) => (
                <Form.Check
                  key={g.value}
                  inline
                  type="radio"
                  name="gender"
                  id={`gender-${g.value}`}
                  label={g.label}
                  value={g.value}
                  checked={form.gender === g.value}
                  onChange={update('gender')}
                />
              ))}
            </Form.Group>

            <Form.Group className="mb-3" controlId="fieldEmail">
              <Form.Label>University Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="alex.j@university.edu"
                value={form.email}
                onChange={update('email')}
                isInvalid={!!fieldErrors.email}
                required
              />
            </Form.Group>

            <Form.Group controlId="fieldNotes">
              <Form.Label>Other Notes / Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Tell us about yourself and why you'd be a great roommate…"
                value={form.notes}
                onChange={update('notes')}
              />
            </Form.Group>

            {status === 'error' && (
              <Alert variant="danger" className="mt-3 mb-0 py-2">
                Couldn't send your application{submitError ? `: ${submitError.message}` : ''}. Please try again.
              </Alert>
            )}
          </Modal.Body>

          <Modal.Footer>
            <Button variant="outline-secondary" onClick={onClose} disabled={status === 'submitting'}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={status === 'submitting'}>
              {status === 'submitting' ? (
                <>
                  <Spinner as="span" animation="border" size="sm" className="me-2" />
                  Submitting…
                </>
              ) : (
                'Submit Application'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      )}
    </Modal>
  );

  return modalContent;
}
