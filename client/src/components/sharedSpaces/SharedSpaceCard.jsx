import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL ?? '';

function SharedSpaceCard({ listing }) {
  const id = listing.id || listing._id;
  const title = listing.roomTitle || listing.name;
  const campus = listing.nearestCampus || listing.school;
  const imageUrl = Array.isArray(listing.imageUrl)
    ? listing.imageUrl[0]
    : (listing.imageUrl || listing.image);
  const imageSrc = imageUrl
    ? `${API_URL}${imageUrl}`
    : 'http://localhost:6767/uploads/dorm_2.jpg';

  return (
    <article className="shared-space-card card shadow d-flex flex-col gap-2">
      <div className="thumbnail shared-space-card__thumbnail">
        <div className="priceBadge">
          ₱{Number(listing.price).toLocaleString('en-PH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}/m
        </div>
        <img src={imageSrc} alt={title} />
      </div>

      <div className="bottomContainer shared-space-card__body d-flex flex-column align-items-start justify-content-start gap-2 p-4">
        <h1 className="shared-space-card__title">{title}</h1>
        <h2 className="shared-space-card__subtitle">{campus}</h2>
        {listing.maximumCapacity && <p className="text-muted mb-0">Max {listing.maximumCapacity} pax</p>}
        <div className="footer d-flex flex-row">
          <div className={`occupancyBadge ${listing.isOccupied ? 'occupied' : 'avail'}`}>
            {listing.isOccupied ? 'occupied' : 'vacant'}
          </div>
        </div>

        <Link className="btn btn-primary mt-2" to={`/student-shared-spaces/${id}`}>
          View Listing
        </Link>
      </div>
    </article>
  );
}

export default SharedSpaceCard;