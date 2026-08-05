import { ArrowRightIcon } from './icons.jsx';

const LABELS = {
  create: {
    idle: 'Launch Group',
    submitting: 'Creating group…',
    success: '✓ Group Created! Redirecting…',
    error: 'Launch Group',
  },
  edit: {
    idle: 'Save Changes',
    submitting: 'Saving changes…',
    success: '✓ Group Updated! Redirecting…',
    error: 'Save Changes',
  },
};

export default function LaunchButton({ status, onClick, mode = 'create' }) {
  const isBusy = status === 'submitting' || status === 'success';
  const labels = LABELS[mode] ?? LABELS.create;

  return (
    <button
      className="btn-launch"
      id="btn-launch"
      type="button"
      onClick={onClick}
      disabled={isBusy}
      style={status === 'success' ? { background: '#059669' } : undefined}
    >
      {labels[status] ?? labels.idle}
      {status === 'idle' && <ArrowRightIcon />}
    </button>
  );
}
