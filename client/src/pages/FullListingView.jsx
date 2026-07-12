import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'

function ManagerListingDetail() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
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

  const {
    roomTitle,
    price,
    gender,
    isOccupied,
    description,
    tags,
    amenities,
    buildingName,
    nearestCampus,
    contacts,
    imageUrl,
    latitude,
    longitude,
  } = listing;

  return (
    <div className="container p-5">
      <div className="row g-4">
        {imageUrl?.map((img, i) => (
          <div className="col-6 col-md-4" key={i}>
            <img
              src={`${import.meta.env.VITE_API_URL}${img}`}
              alt={`${roomTitle} photo ${i + 1}`}
              className="img-fluid rounded"
            />
          </div>
        ))}
      </div>

      <h1 className="mt-4">{roomTitle}</h1>
      <h2>{buildingName}</h2>
      <p className="text-muted">Nearest campus: {nearestCampus}</p>

      <p>₱{Number(price).toLocaleString("en-PH")}/month</p>
      <span className={`badge ${isOccupied ? 'bg-danger' : 'bg-success'}`}>
        {isOccupied ? 'Occupied' : 'Vacant'}
      </span>
      <p className="mt-2">Gender: {gender}</p>

      <p>{description}</p>

      <h4>Amenities</h4>
      <ul>
        {amenities?.map((a, i) => <li key={i}>{a}</li>)}
      </ul>

      <h4>Tags</h4>
      <div className="d-flex gap-2 flex-wrap">
        {tags?.map((t, i) => <span className="badge bg-secondary" key={i}>{t}</span>)}
      </div>

      <h4>Contact methods</h4>
      <ul>
        {contacts?.map((c, i) => <li key={i}>{c}</li>)}
      </ul>
    </div>
  );
}
export default ManagerListingDetail
