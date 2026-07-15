import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

import ViewListing from '../components/ViewListing.jsx';
import ReportListingModal from '../components/ReportListingModal.jsx';

function ListingDetail() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/listing/${id}`);
        setListing(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-danger">{error}</p>;
  if (!listing) return <p className="p-4">Listing not found.</p>;

  return (
    <div className="container-fluid w-100 p-0">
      <div className="px-4 pt-4 d-flex align-items-center justify-content-between gap-3 flex-wrap">
        <Link to="/student-discover-communities" className="btn btn-outline-secondary btn-sm">
          Back to listings
        </Link>
        <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => setShowReportModal(true)}>
          Report Listing
        </button>
      </div>
      <ViewListing listing={listing} />
      <ReportListingModal
        open={showReportModal}
        listingId={listing._id || listing.id}
        listingTitle={listing.roomTitle || listing.name || 'this listing'}
        onClose={() => setShowReportModal(false)}
      />
    </div>
  );
}

export default ListingDetail;