import { useEffect, useState } from "react";
import NavBar from "../components/Manager-Navbar.jsx";
import "../stylesheets/manager-listing.css";
import useInquiry from "../hook/useInquiry";
import InquiryDetailModal from "../components/InquiryDetailModal.jsx";

export function ManagerNotification() {
  const { inquiries, fetching, error, fetchInquiries, markAsRead } = useInquiry();
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  return (
    <div className="manager-notification container-fluid d-flex flex-column">
      <NavBar />
      <div className="main-content-notif container padding-5">
        <div className="h1 border-bottom pb-2">Inquiries</div>

        {fetching && <p>Loading inquiries...</p>}
        {error && <p className="form-error">{error}</p>}

        {!fetching && inquiries.length === 0 && (
          <p className="text-muted">No inquiries yet.</p>
        )}

        <div className="inquiry-list d-flex flex-column gap-2 mt-3">
          {inquiries.map((inquiry) => (
            <div
              key={inquiry._id}
              className={`card p-3 inquiry-list-item ${inquiry.isRead ? "" : "unread"}`}
              style={{ cursor: "pointer" }}
              onClick={() => setSelectedInquiry(inquiry)}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>{inquiry.sender?.email || "Unknown sender"}</strong>
                  <p className="mb-0 text-muted">
                    {inquiry.listing?.roomTitle || "Unknown listing"}
                  </p>
                </div>
                {!inquiry.isRead && <span className="badge bg-primary">New</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedInquiry && (
        <InquiryDetailModal
          inquiry={selectedInquiry}
          onClose={() => setSelectedInquiry(null)}
          onMarkAsRead={markAsRead}
        />
      )}
    </div>
  );
}

export default ManagerNotification;
