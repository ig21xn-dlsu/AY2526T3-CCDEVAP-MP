import '../../stylesheets/listing-card.css'

function ListingContainer({ id, title, location, occupancy, inquiries, imgUrl }) {

  return (
    <div className="parentContainer card shadow d-flex flex-row gap-2 ">
      <div className="thumbnail">
        <img src="http://localhost:5001/uploads/dorm_2.jpg" alt="" />
        <div />
      </div>
      <div className="rightContainer d-flex flex-column align-items-start justify-content-start p-4">
        <h1>2-Torre</h1>
      </div>
    </div>
  )

}


export default ListingContainer

