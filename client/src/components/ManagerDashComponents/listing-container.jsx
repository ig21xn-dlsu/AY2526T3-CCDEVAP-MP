import '../../stylesheets/listing-card.css'
import { useNavigate } from 'react-router-dom'

function ListingContainer({ _id, roomTitle, nearestCampus, price, isOccupied, imgUrl }) {
  const navigate = useNavigate();
  console.log(imgUrl);
  return (
    <div
      className="listingParentContainer card shadow d-flex flex-col gap-2"
      onClick={() => navigate(`/full-view/${_id}`)}
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
          <div className={`occupancyBadge ${isOccupied ? 'occupied' : 'vacant'}`}>
            {isOccupied ? 'occupied' : 'vacant'}
          </div>
        </div>
      </div>
    </div>
  )
}
export default ListingContainer
