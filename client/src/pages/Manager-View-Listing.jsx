import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'

import Navbar from '../components/Manager-Navbar.jsx'
import ViewListing from '../components/ViewListing.jsx'



function ManagerListingDetail() {
  const { id } = useParams();
  const [listing, setListing] = useState(null); const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">{error}</p>;
  if (!listing) return <p>Listing not found.</p>;


  return (
    <div className="container-fluid w-100">
      <Navbar />
      <div className="main-content p-5">
        <ViewListing listing={listing} />
      </div>
      <h1>New location</h1>
    </div>
  );
}
export default ManagerListingDetail
