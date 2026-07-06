import '../../stylesheets/listing-card.css'

function ListingContainer({ id, title, location, occupancy, inquiries, imgUrl }) {

  return (
    <div className="parentContainer card shadow d-flex flex-row gap-2 ">
      <div className="thumbnail">
        <span className="placeholder"></span>
      </div>
      <div className="rightContainer d-flex flex-column justify-content-start p-4">
        <h1>Header</h1>
      </div>
    </div>
  )

}


export default ListingContainer

