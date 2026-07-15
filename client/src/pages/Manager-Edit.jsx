import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ManagerCreate from './Manager-Create.jsx'

function ManagerEdit() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/listing/${id}`);

        if (!response.ok) {
          const data = await response.json().catch(() => null);
          throw new Error(data?.message || "Failed to load listing.");
        }

        const data = await response.json();
        setListing(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  if (loading) return <p className="p-5">Loading listing...</p>;
  if (error) return <p className="p-5 form-error">{error}</p>;
  if (!listing) return <p className="p-5">Listing not found.</p>;

  return <ManagerCreate mode="edit" existingListing={listing} />;
}

export default ManagerEdit
