import { useState } from "react";
import "../stylesheets/inquiry-modal.css";
import useInquiry from "../hook/useInquiry";

const MAX_LENGTH = 500;

function InquiryModal({ listingId, onClose }) {
  const [messageBody, setMessageBody] = useState("");
  const { sendInquiry, sending, error } = useInquiry();
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    if (value.length <= MAX_LENGTH) {
      setMessageBody(value);
    }
  };

  const handleSubmit = async () => {
    if (!messageBody.trim()) return;

    const result = await sendInquiry(listingId, messageBody);
    if (result) {
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1200);
    }
  };

  return (
    <div className="inquiry-modal-overlay" onClick={onClose}>
      <div className="inquiry-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Send an Inquiry</h2>
          <button className="modal-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <textarea
          className="modal-textarea"
          placeholder="Let them know you're interested..."
          value={messageBody}
          onChange={handleChange}
          rows={5}
          autoFocus
        />

        <div className="modal-footer">
          <span className="char-counter">
            {messageBody.length}/{MAX_LENGTH}
          </span>

          {error && <p className="form-error">{error}</p>}
          {success && <p className="form-success">Inquiry sent!</p>}

          <button
            className="modal-submit-btn"
            onClick={handleSubmit}
            disabled={sending || !messageBody.trim()}
          >
            {sending ? "Sending..." : "Send Inquiry"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default InquiryModal;
