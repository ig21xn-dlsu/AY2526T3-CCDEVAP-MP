function ConfirmModal({ open, title, message, confirmLabel = 'Confirm', danger, loading, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div
      onClick={onCancel}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        zIndex: 2000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(100%, 520px)',
          background: '#fff',
          borderRadius: '16px',
          boxShadow: '0 24px 60px rgba(15, 23, 42, 0.22)',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px 18px', borderBottom: '1px solid #E5E7EB' }}>
          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827' }}>{title}</div>
          <button
            type="button"
            onClick={onCancel}
            style={{
              border: 'none',
              background: 'transparent',
              color: '#6B7280',
              fontSize: '1.6rem',
              lineHeight: 1,
              cursor: 'pointer',
              padding: 0,
            }}
            aria-label="Close dialog"
          >
            &times;
          </button>
        </div>
        <div style={{ padding: '24px', color: '#374151', lineHeight: 1.6 }}>
          <p style={{ margin: 0 }}>{message}</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', padding: '0 24px 24px' }}>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            style={{
              border: '1px solid #D1D5DB',
              background: '#fff',
              color: '#374151',
              borderRadius: '10px',
              padding: '10px 16px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            style={{
              border: 'none',
              background: danger ? '#DC2626' : '#2563EB',
              color: '#fff',
              borderRadius: '10px',
              padding: '10px 18px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {loading ? 'Working...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;