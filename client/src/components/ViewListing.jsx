import '../stylesheets/listing-card.css'
import MapContainer from '../components/TwoPointMap.jsx'
import CAMPUSES from '../assets/util/CAMPUSES.js'
import ManagerCard from '../components/ViewListing-ManagerSideCard.jsx'
import { useState, useEffect } from 'react'
import axios from 'axios'
import InquiryModal from './InquiryModal.jsx'


function ListingFullView({ listing }) {
  if (!listing) return <p>Listing not found.</p>;
  console.log("From ViewListing.jsx: ", { listing });
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  console.log("From ViewListing.jsx: ", { showInquiryModal });

  const occupiedBy = listing.occupiedBy ?? null;
  const isOccupied = Boolean(occupiedBy);
  const occupancyLabel = isOccupied
    ? (occupiedBy?.groupName || occupiedBy?.name || 'Occupied')
    : 'Vacant';


  const {
    roomTitle,
    price,
    maximumCapacity,
    gender,
    description,
    tags,
    amenities,
    buildingName,
    nearestCampus,
    contacts,
    imageUrl,
    latitude,
    longitude,
    owner,
  } = listing;

  const [managerCard, setManagerCard] = useState(null);
  useEffect(() => {
    if (!owner) return;
    const API_URL = import.meta.env.VITE_API_URL;
    let mounted = true;
    axios.get(`${API_URL}/api/calling-card/${owner}`)
      .then((res) => { if (mounted) setManagerCard(res.data); })
      .catch(() => {})
    return () => { mounted = false };
  }, [owner]);

  const filteredContacts = (contacts || []).filter((c) => {
    if (!c) return false;
    const n = String(c).trim().toLowerCase();
    return n !== 'email' && n !== 'sms / phone' && n !== 'social platform';
  });

  return (
    <div className="listing-full-view-wrapper d-flex flex-row p-5 gap-4">

      {/* MAIN CONTENT COLUMN */}
      <div className="listing-full-view d-flex flex-column gap-4 flex-grow-1" style={{ flexBasis: '75%' }}>

        <div className="card shadow headInformation d-flex flex-row">
          <span className={`occuFull occupancyBadge ${isOccupied ? 'occupied' : 'avail'} fs-6`}>
            {occupancyLabel}
          </span>
          <div className="thumbnail thumbnailFull shadow ">
            <div className="badge campusBadge">Best for {nearestCampus} students</div>
            <div className="badge genderBadge">{gender}</div>
            <div className="badge priceBadgeFull">₱{Number(price).toLocaleString("en-PH", { minimumFractionDigits: 2 })}/m</div>
            <img src={`${import.meta.env.VITE_API_URL}${imageUrl}`} alt="" />
          </div>
          <div className="headInfromationRight container-fluid">
            <div className="headInfo d-flex flex-column p-2 gap-2 ">
              <h1>{roomTitle}</h1>
              <h2 className=''>{buildingName}</h2>
            </div>
            <div className="card amenitiesContainer d-flex flex-column flex-wrap gap-2 container-fluid ">
              <h1 className="border-bottom pb-2 text-end">Amenities</h1>
              <div className="d-flex gap-2 flex-wrap">
                {amenities?.map((a, i) => (
                  <span className="badge amenitiesBadge" key={i}>{a}</span>
                ))}
              </div>
            </div>
            <div className="badge capacityBadge">Max {maximumCapacity} pax</div>
          </div>
        </div>

        <div className="card shadow neighborHoodCard d-flex flex-column">
          <h1 className="border-bottom pb-4 fs-2">Map</h1>
          <MapContainer latitude={latitude} longitude={longitude} campus={CAMPUSES[nearestCampus]} />
        </div>

        <div className="card shadow moreInfoCard d-flex flex-column">
          <h1 className="border-bottom pb-4 fs-2">More info</h1>
          <div className="card p-3">
            <h1 className="border-bottom pb-2 fs-5">Description</h1>
            <div className="descriptionBox">
              <p className="mb-0">{description}</p>
            </div>
          </div>
          <div className='card shadow pb-4'>
            <h4>Tags</h4>
            <div className="d-flex gap-2 flex-wrap">
              {tags?.map((t, i) => (
                <span className="badge bg-secondary" key={i}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SIDEBAR COLUMN */}
      <div className="listing-sidebar" style={{ flexBasis: '25%', minWidth: '280px' }}>
        <div className="sticky-top d-flex flex-column gap-4" style={{ top: '2rem' }}>
          <ManagerCard ownerId={owner} />
          <div className="card shadow d-flex flex-column p-3">
            <h4>Contact Through: </h4>
            <ul>
              {filteredContacts.map((c, i) => <li key={i}>{c}</li>)}
              {managerCard?.phone && <li>Phone: {managerCard.phone}</li>}
              {managerCard?.email && <li>Email: {managerCard.email}</li>}
              {managerCard?.links?.length > 0 && managerCard.links.map((l, i) => (
                <li key={`link-${i}`}><a href={l.url} target="_blank" rel="noreferrer">{l.label || l.url}</a></li>
              ))}
            </ul>
          </div>


          <button className="inquire-btn btn btn-primary" onClick={() => setShowInquiryModal(true)}>
            Send a brief message
          </button>

          {showInquiryModal && (
            <InquiryModal listingId={listing._id}
              onClose={() => setShowInquiryModal(false)} />
          )}
        </div>

      </div>

    </div>
  );
}
export default ListingFullView
