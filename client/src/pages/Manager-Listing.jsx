import NavBar from '../components/Manager-Navbar.jsx'
import ListingContainer from '../components/ManagerDashComponents/listing-container.jsx'

function ManagerListing() {
  return (
    <div className='listing-container container-fluid'>
      <NavBar />
      <div className="main-content container-fluid d-flex flex-column p-5 gap-5">
        <div className="listingPageTitle d-flex flex-row align-items-left justify-content-between w-100 pb-2 border-bottom w-100">
          <h3 className="">Your Listings</h3>
          <button className="btn btn-primary">Create Listing</button>
        </div>
        <div className="listingsDiv d-flex flex-column gap-2">
          <ListingContainer />
          <ListingContainer />
          <ListingContainer />
          <ListingContainer />
          <ListingContainer />
          <ListingContainer />
        </div>
      </div>
    </div>

  )

}
export default ManagerListing
