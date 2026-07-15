function ConfirmModal({ open, title, message, confirmLabel = 'Confirm', danger, loading, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="modal-overlay active" onClick={onCancel}>
      <div className="modal-card confirm-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-title">{title}</div>
          <button className="close-modal-btn" onClick={onCancel}>&times;</button>
        </div>
        <div className="modal-body"><p>{message}</p></div>
        <div className="modal-footer">
          <button className="btn btn-dismiss" onClick={onCancel} disabled={loading}>Cancel</button>
          <button className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`} onClick={onConfirm} disabled={loading}>
            {loading ? 'Working...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;