
//ICON IMPORTS
import roomDetIcon from '../assets/room-details.svg';
import aboutSpaceIcon from '../assets/about-space.svg';
import whereSpaceIcon from '../assets/whereSpace.svg'
import ListingMap from '../components/TwoPointMap.jsx';

import '../stylesheets/create-list-form.css'

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useEffect } from 'react';


function ManagerCreate() {
  const PROPERTY_TAGS = [
    "Corner Unit",
    "Newly Renovated",
    "Move-In Ready",
    "Bright and Airy",
    "Spacious Room",
    "Near Transport",
    "Near Mall",
    "Quiet Area",
    "Residential Area",
    "Well-Maintained",
    "Modern Interior",
    "Newly Built",
    "Low-Density",
    "Good Natural Light",
    "Good Ventilation"
  ];


  const AMENITIES = [
    "Free WiFi",
    "24/7 Security",
    "Utilities Included",
    "Parking",
    "Gym Access",
    "Pet Friendly",
    "In-Unit Laundry",
    "Air Conditioning",
    "Study Lounge",
    "Swimming Pool",
    "Tap Card System"
  ];

  const CAMPUSES = {
    UPM: {
      name: "University of the Philippines Manila",
      lat: 14.5759437,
      lng: 120.9864733
    },
    DLSU: {
      name: "De La Salle University",
      lat: 14.5644408,
      lng: 120.993459
    },
    ADMU: {
      name: "Ateneo de Manila",
      lat: 14.6398984,
      lng: 121.0781952
    },
    UST: {
      name: "University of Santo Thomas",
      lat: 14.6098426,
      lng: 120.9894646
    },
    UPD: {
      name: "University of the Philippines Diliman",
      lat: 14.6547213,
      long: 121.0663102,
    }
  };

  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      tags: [],
      amenities: [],
      buildingName: "",
      latitude: null,
      longitude: null
    }
  });

  const [searchResults, setSearchResults] = useState([]) //for location search results, we store its longitude and latitude results so this isnt a form
  const buildingName = watch("buildingName");

  useEffect(() => {
    if (!buildingName || buildingName.trim().length < 3) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?${new URLSearchParams({
            q: buildingName,
            format: "jsonv2",
            limit: 5,
            addressdetails: 1,
            countrycodes: "ph"
          })}`,
          {
            headers: {
              Accept: "application/json"
            }
          }
        );

        const data = await response.json();

        setSearchResults(data);
      } catch (error) {
        console.error("Location search failed:", error);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [buildingName]);


  const selectedTags = watch("tags");

  //conditional rendering for the map -> only shows up when these three are present 
  const selectedCampus = watch("nearestCampus");
  const latitude = watch("latitude");
  const longitude = watch("longitude");
  const campus = CAMPUSES[selectedCampus];

  const shouldShowMap = selectedCampus && latitude != null && longitude != null;

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setValue(
        "tags",
        selectedTags.filter((t) => t !== tag)
      );
    } else {
      setValue(
        "tags",
        [...selectedTags, tag]
      );
    }
  };

  const onSubmit = (data) => {
    console.log(data);

  };

  const selectLocation = (location) => {
    setValue(
      "buildingName",
      location.display_name
    );

    setValue(
      "latitude",
      parseFloat(location.lat)
    );

    setValue(
      "longitude",
      parseFloat(location.lon)
    );

    setSearchResults([]);
  };
  return (
    <div className="man-create-main container-fluid d-flex flex-column gap-4 p-3 justify-content-center align-items-center">
      <form onSubmit={handleSubmit(onSubmit)} className='container-fluid d-flex flex-column gap-4'>
        <div className="d-flex flex-column calloutTitle justify-content-center align-items-center">
          <h1>List a Room</h1>
          <p>Fill in the details below to publish your room to roomies</p>
        </div>
        {/* CARD1 : ROOM TITLE CONTAINER*/}

        <div className="card shadow container p-5">
          <div className="blockHeader d-flex flex-row border-bottom pb-0 gap-2">
            <img src={roomDetIcon} alt="" />
            <h1>Room Details</h1>
          </div>
          <div className="roomTitleInputcontainer">
            <p>Room Title</p>
            <input {...register("roomTitle")} type="text" className="border p-2" placeholder=' e.g 2-Torre Lorenzo | One bedroom 4 beds' />
          </div>

          <div className="priceAndMoveContainer gap-3 d-flex flex-row justify-content-between">
            <div className="priceInputContainer d-flex flex-column container-fluid ">
              <p>Rate per Month</p>
              <input {...register("price")} type="number" className='border p-2' />
            </div>
            <div className="genderPreference d-flex flex-column container-fluid" >
              <p>Gender Restrictions</p>
              <select {...register("gender")} className="form-select">
                <option value="co-ed">Co-ed: No restrictions</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>
        </div>

        {/* CARD2 : About the space */}

        <div className="card shadow container p-5">
          <div className="blockHeader d-flex flex-row border-bottom pb-0 gap-2">
            <img src={aboutSpaceIcon} alt="" />
            <h1>About the Space</h1>
          </div>
          <div className="roomTitleInputcontainer">
            <p>Description</p>
            <textarea {...register("description")} className='border p-4' rows={4} placeholder='Tell roomies what makes this room and the house special'></textarea>
          </div>

          <div className="tagInputContainer d-flex flex-column">
            <p>Lifestyle</p>
            <div className="tagContainer d-flex flex-wrap gap-2">
              {PROPERTY_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={`tag-pill ${selectedTags.includes(tag)
                    ? "tag-pill-active"
                    : ""
                    }`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>



          <div className="amentitiesInputContainer ">
            <p>Property Amenities</p>
            <div className="row g-3 mt-1">
              {AMENITIES.map((amenity) => (
                <div className="col-md-4" key={amenity}>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={amenity}
                      id={amenity}
                      {...register("amenities")}
                    />

                    <label
                      className="form-check-label"
                      htmlFor={amenity}
                    >
                      {amenity}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>




        </div>


        {/*CARD 3: LOCATIONAL DATA */}
        <div className="card shadow container p-5">
          <div className="blockHeader d-flex flex-row border-bottom pb-0 gap-2">
            <img src={whereSpaceIcon} alt="" />
            <h1>Where is the Space?</h1>
          </div>

          <div className="locationInputContainer">
            <h4>Building Name or Address </h4>
            <input
              type="text"
              className="form-control border p-3"
              placeholder="Search building..."
              {...register("buildingName")}
            />
            {searchResults.length > 0 && (
              <div className="list-group">
                {searchResults.map((location) => (
                  <button
                    key={location.place_id}
                    type="button"
                    className="list-group-item list-group-item-action"
                    onClick={() => selectLocation(location)}
                  >
                    {location.display_name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="nearestCampus">
            <p>What campus do you want to advertise to?</p>
            <select {...register("nearestCampus")} className='form-select border p-3'>
              <option value="">Select a campus</option>
              <option value="DLSU">DLSU-Manila</option>
              <option value="ADMU">ADMU</option>
              <option value="UST">UST</option>
              <option value="UPM">UP-Manila</option>
              <option value="UPD">UP-Diliman</option>

            </select>
            <p>Selected {watch("nearestCampus")}</p>
            <p className='p-2 '>This info will affect searches and create a map with the campus pinned </p>
          </div>
          {shouldShowMap && (
            <div className="card shadow container p-5">
              <h2>Location Preview</h2>

              <ListingMap
                latitude={latitude}
                longitude={longitude}
                campus={campus}
              />
            </div>
          )}
        </div>

        <button type="submit" className='btn btn-primary'>submit</button>
      </form >
    </div >
  )

}

export default ManagerCreate
