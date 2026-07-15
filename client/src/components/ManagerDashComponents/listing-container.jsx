import '../../stylesheets/listing-card.css'
import { useNavigate } from 'react-router-dom'
import { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext.jsx'

function ListingContainer({ _id, roomTitle, nearestCampus, price, isOccupied, imgUrl, owner, onDeleted }) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [deleting, setDeleting] = useState(false);

  const isOwner = user?.role === 'manager' && owner === user?._id;

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/manager-edit/${_id}`);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();

    const confirmed = window.confirm("Are you sure you want to delete this listing?");
    if (!confirmed) return;

    setDeleting(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/listing/${_id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || "Failed to delete listing.");
      }

      if (onDeleted) onDeleted(_id);
    } catch (err) {
      console.error("Delete failed:", err);
      alert(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className="listingParentContainer card shadow d-flex flex-col gap-2"
      onClick={() => navigate(`/manager-view-listing/${_id}`)}
      role="button"
      tabIndex={0}
    >
      <div className="thumbnail">
        <div className="priceBadge">
          ₱{Number(price).toLocaleString("en-PH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
          /m
        </div>
        <img src={imgUrl ? `${import.meta.env.VITE_API_URL}${imgUrl}` : 'http://localhost:6767/uploads/dorm_2.jpg'} alt={roomTitle || 'Listing'} />
      </div>
      <div className="bottomContainer d-flex flex-column align-items-start justify-content-start gap-2 p-4">
        <h1>{roomTitle}</h1>
        <h2>{nearestCampus}</h2>
        <div className="footer d-flex flex-row">
          <div className={`occupancyBadge ${isOccupied ? 'occupied' : 'avail'}`}>
            {isOccupied ? 'occupied' : 'vacant'}
          </div>
        </div>

        {isOwner && (
          <div className="managerActions d-flex flex-row gap-2 mt-2">
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={handleEdit}
            >
              Edit
            </button>
            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
export default ListingContainer
