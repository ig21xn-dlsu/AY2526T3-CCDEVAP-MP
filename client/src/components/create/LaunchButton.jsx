import { ArrowRightIcon } from './icons.jsx';

const LABELS = {
  idle: 'Launch Group',
  submitting: 'Creating group…',
  success: '✓ Group Created! Redirecting…',
  error: 'Launch Group',
};

export default function LaunchButton({ status, onClick }) {
  const isBusy = status === 'submitting' || status === 'success';

  return (
    <button
      className="btn-launch"
      id="btn-launch"
      type="button"
      onClick={onClick}
      disabled={isBusy}
      style={status === 'success' ? { background: '#059669' } : undefined}
    >
      {LABELS[status] ?? LABELS.idle}
      {status === 'idle' && <ArrowRightIcon />}
    </button>
  );
}
