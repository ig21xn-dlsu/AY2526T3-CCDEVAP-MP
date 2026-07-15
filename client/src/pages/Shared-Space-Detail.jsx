import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import ViewListing from '../components/ViewListing.jsx';
import ReportListingModal from '../components/ReportListingModal.jsx';
import useTheme from '../hook/useTheme.js';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:6767';

export default function SharedSpaceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [listing, setListing] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    let active = true;

    const loadListing = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/shared-spaces/${id}`);
        if (!active) return;
        setListing(response.data);
      } catch {
        if (!active) return;
        setListing(null);
      }
    };

    loadListing();

    return () => {
      active = false;
    };
  }, [id]);

  const normalizedListing = useMemo(() => {
    if (!listing) return null;

    return {
      ...listing,
      imageUrl: Array.isArray(listing.imageUrl) ? listing.imageUrl[0] : (listing.imageUrl || listing.image),
    };
  }, [listing]);

  if (!normalizedListing) return <p className="p-4">Listing not found.</p>;

  return (
    <div className="container-fluid w-100 p-0">
      <div className="px-4 pt-4 d-flex align-items-center justify-content-between gap-3 flex-wrap">
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <Link to="#" onClick={(e) => { e.preventDefault(); navigate(-1); }} className="btn btn-outline-secondary btn-sm">
            Back to shared spaces
          </Link>
          <button type="button" className="btn btn-outline-secondary btn-sm" onClick={toggleTheme}>
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>
        </div>
        <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => setShowReportModal(true)}>
          Report Listing
        </button>
      </div>
      <ViewListing listing={normalizedListing} />
      <ReportListingModal
        open={showReportModal}
        listingId={normalizedListing._id || normalizedListing.id}
        listingTitle={normalizedListing.roomTitle || normalizedListing.name || 'this listing'}
        onClose={() => setShowReportModal(false)}
      />
    </div>
  );
}