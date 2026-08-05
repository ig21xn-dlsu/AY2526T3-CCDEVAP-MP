import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL ?? '';

function SharedSpaceCard({ listing }) {
  const id = listing.id || listing._id;
  const title = listing.roomTitle || listing.name;
  const campus = listing.nearestCampus || listing.school;
  const occupiedBy = listing.occupiedBy ?? null;
  const isOccupied = Boolean(occupiedBy);
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
        <div className="shared-space-card__info d-flex flex-column gap-2 w-100">
          <h1 className="shared-space-card__title">{title}</h1>
          <h2 className="shared-space-card__subtitle">{campus}</h2>
          <div className="shared-space-card__meta-row">
            {listing.maximumCapacity && <span className="shared-space-card__meta-pill">Max {listing.maximumCapacity} pax</span>}
            <span className={`shared-space-card__meta-pill shared-space-card__status ${isOccupied ? 'occupied' : 'avail'}`}>
              {isOccupied ? 'occupied' : 'vacant'}
            </span>
          </div>
          <div className="shared-space-card__tags">
            {(listing.tags || []).slice(0, 3).map((tag) => (
              <span className="shared-space-card__tag" key={tag}>{tag}</span>
            ))}
          </div>
        </div>

        <Link className="btn shared-space-card__button mt-auto" to={`/student-shared-spaces/${id}`}>
          View Listing
        </Link>
      </div>
    </article>
  );
}

export default SharedSpaceCard;