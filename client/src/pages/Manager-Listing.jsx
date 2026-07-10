import NavBar from '../components/Manager-Navbar.jsx'
import ListingContainer from '../components/ManagerDashComponents/listing-container.jsx'

import { useNavigate } from 'react-router-dom'

function ManagerListing() {
  const navigate = useNavigate();
  return (
    <div className='listing-container container-fluid'>
      <NavBar />
      <div className="main-content container-fluid d-flex flex-column p-5 gap-5">
        <div className="listingPageTitle d-flex flex-row align-items-left justify-content-between w-100 pb-2 border-bottom w-100">
          <h3 className="">Your Listings</h3>
          <button className="btn btn-primary" onClick={() => navigate('/manager-create')}>Create Listing</button>
        </div>
        <div className="listingsDiv d-flex flex-column gap-2">
          <div className="row justify-content-lg-start g-4">
            <div className="col-12 col-lg-3 justify-content-center">
              <ListingContainer />
            </div>
            <div className="col-12 col-lg-3 justify-content-center">
              <ListingContainer />
            </div>
            <div className="col-12 col-lg-3 justify-content-center">
              <ListingContainer />
            </div>
            <div className="col-12 col-lg-3 justify-content-center">
              <ListingContainer />
            </div>
            <div className="col-12 col-lg-3 justify-content-center">
              <ListingContainer />
            </div>
          </div>
        </div>
      </div>
    </div>

  )

}
export default ManagerListing
