import '../../stylesheets/listing-card.css'

function ListingContainer({ id, title, location, occupancy, inquiries, imgUrl }) {


  return (
    <div className="listingParentContainer card shadow d-flex flex-col gap-2 ">
      <div className="thumbnail">
        <div className="priceBadge">P 5,000/m</div>
        <img src="http://localhost:6767/uploads/dorm_2.jpg" alt="" /> <div />
      </div>
      <div className="bottomContainer d-flex flex-column align-items-start justify-content-start gap-2 p-4">
        <h1>One Bedroom Near 2-Torre</h1>
        <h2>Near Dlsu</h2>
        <div className="footer d-flex flex-row">
          <div className="occupancyBadge occupied">
            occupied
          </div>
        </div>

      </div>
    </div>
  )

}

export default ListingContainer

