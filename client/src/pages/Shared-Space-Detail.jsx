import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

import ViewListing from '../components/ViewListing.jsx';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:6767';

export default function SharedSpaceDetail() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);

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
      <div className="px-4 pt-4">
        <Link to="/student-shared-spaces" className="btn btn-outline-secondary btn-sm">
          Back to shared spaces
        </Link>
      </div>
      <ViewListing listing={normalizedListing} />
    </div>
  );
}