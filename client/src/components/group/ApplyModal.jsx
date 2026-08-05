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

  return (
    <Modal show={open} onHide={onClose} centered backdrop="static" keyboard>
      <Modal.Header closeButton>
        <Modal.Title as="h5">Apply to Join {groupName}</Modal.Title>
      </Modal.Header>

      {status === 'success' ? (
        <Modal.Body className="text-center py-4">
          <div
            className="rounded-circle bg-success-subtle text-success d-inline-flex align-items-center justify-content-center mb-3"
            style={{ width: 56, height: 56 }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h5 className="fw-bold mb-1">Application Sent!</h5>
          <p className="text-muted mb-0">{groupName} will be in touch soon.</p>
        </Modal.Body>
      ) : (
        <Form noValidate onSubmit={handleSubmit}>
          <Modal.Body>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="fieldName">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
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
}
