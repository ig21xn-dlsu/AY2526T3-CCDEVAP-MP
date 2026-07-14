import "../stylesheets/inquiry-modal.css";

function InquiryDetailModal({ inquiry, onClose, onMarkAsRead }) {
  if (!inquiry) return null;

  const handleMarkAsRead = async () => {
    await onMarkAsRead(inquiry._id);
    onClose();
  };

  return (
    <div className="inquiry-modal-overlay" onClick={onClose}>
      <div className="inquiry-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Inquiry</h2>
          <button className="modal-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <p className="text-muted mb-1">From: {inquiry.sender?.email || "Unknown"}</p>
        <p className="text-muted mb-3">
          Listing: {inquiry.listing?.roomTitle || "Unknown listing"}
        </p>

        <div className="modal-textarea" style={{ whiteSpace: "pre-wrap" }}>
          {inquiry.messageBody}
        </div>

        <div className="modal-footer">
          {!inquiry.isRead && (
            <button className="modal-submit-btn" onClick={handleMarkAsRead}>
              Mark as read
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default InquiryDetailModal;
