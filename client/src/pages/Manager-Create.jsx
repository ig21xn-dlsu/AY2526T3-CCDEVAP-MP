//ICON IMPORTS
import roomDetIcon from '../assets/room-details.svg';
import aboutSpaceIcon from '../assets/about-space.svg';
import whereSpaceIcon from '../assets/whereSpace.svg'
import contactPrefIcon from '../assets/contactsIcon.svg';

import ListingMap from '../components/TwoPointMap.jsx';
import FileUpload from '../components/ManagerDashComponents/FileUpload.jsx';

import '../stylesheets/create-list-form.css'

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom'

import { AuthContext } from '../context/AuthContext.jsx'


function ManagerCreate({ mode = "create", existingListing }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

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

  const CONTACT_METHODS = [
    "Email",
    "SMS / Phone",
    "Social Platform",
  ]


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
      lng: 121.0663102,
    }
  };

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm({
    defaultValues: {
      tags: [],
      contacts: [],
      amenities: [],
      buildingName: "",
      latitude: null,
      longitude: null,
      isOccupied: false,
      maxiumumCapacity: 0,
    }
  });

  const [uploadFile, setUploadFile] = useState();

  const [searchResults, setSearchResults] = useState([])
  const buildingName = watch("buildingName");
  useEffect(() => { setSelectedLocation(false), [buildingName] })
  const [selectedLocation, setSelectedLocation] = useState(false);

  // Submission state: server-side errors surfaced after a failed submit
  const [serverError, setServerError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (mode === "edit" && existingListing) {
      reset(existingListing);
      setSelectedLocation(true);
    }
  }, [mode, existingListing, reset]);

  useEffect(() => {
    if (selectedLocation) return;
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

  const selectedCampus = watch("nearestCampus");
  const latitude = watch("latitude");
  const longitude = watch("longitude");
  const campus = CAMPUSES[selectedCampus];

  const API_URL = import.meta.env.VITE_API_URL;

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

  const onSubmit = async (data) => {
    setServerError(null);
    setFieldErrors({});
    setSubmitting(true);
    try {
      let imageUrl = existingListing?.imageUrl;

      if (uploadFile) {
        const imageFormData = new FormData();
        imageFormData.append("listingImage", uploadFile.file);

        const uploadResponse =
          await fetch(
            `${API_URL}/api/upload`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
              body: imageFormData
            }
          );

        if (!uploadResponse.ok) {
          const uploadErr = await uploadResponse.json().catch(() => null);
          throw new Error(uploadErr?.message || "Failed to upload image.");
        }

        const uploadResult = await uploadResponse.json();
        console.log("CONSOLE LOG:", uploadResult);

        imageUrl = uploadResult.imageUrl;
      }

      const listingPayload = {
        ...data,
        imageUrl
      };

      console.log("listing payload: ", listingPayload);

      const endpoint = mode === "edit"
        ? `${API_URL}/api/listing/${existingListing._id}`
        : `${API_URL}/api/listing`;

      const listingResponse =
        await fetch(
          endpoint,
          {
            method: mode === "edit" ? "PATCH" : "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify(listingPayload)
          }
        );

      const result = await listingResponse.json();

      if (!listingResponse.ok) {
        if (listingResponse.status === 422 && result.errors) {
          setFieldErrors(result.errors);
        }
        setServerError(result.message || "Failed to save listing.");
        return;
      }

      console.log(result);
      // Success — return to the same place the back button goes to
      navigate('/manager-listings');
    } catch (err) {
      console.error(err);
      setServerError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
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

    setSelectedLocation(true);

    setSearchResults([]);
  };
  return (
    <div className="man-create-main container-fluid d-flex flex-column gap-4 justify-content-center align-items-center">
      <div className="container-fluid w-100 d-flex flex-row border-bottom justify-content-start align-items-center">
        <NavLink to="/manager-listings" className="p-4 fs-6">back</NavLink>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className='container-fluid d-flex flex-column gap-4'>
        <div className="d-flex flex-column calloutTitle justify-content-center align-items-center">
          <h1>{mode === "edit" ? "Edit Room" : "List a Room"}</h1>
          <p>Fill in the details below to publish your room to roomies</p>
        </div>

        {serverError && (
          <div className="alert alert-danger" role="alert">
            {serverError}
          </div>
        )}

        <div className="card shadow container p-5">
          <div className="blockHeader d-flex flex-row border-bottom pb-2 gap-2 align-items-center">
            <img src={roomDetIcon} alt="" />
            <h1>Room Details</h1>
          </div>
          <div className="roomTitleInputcontainer">
            <p>Room Title</p>
            <input
              {...register("roomTitle", {
                required: "Room title is required.",
                maxLength: { value: 120, message: "Room title must be under 120 characters." },
              })}
              type="text"
              className="border p-2"
              placeholder=' e.g 2-Torre Lorenzo | One bedroom 4 beds'
            />
            {errors.roomTitle && <p className="text-danger small mt-1">{errors.roomTitle.message}</p>}
            {fieldErrors.roomTitle && <p className="text-danger small mt-1">{fieldErrors.roomTitle}</p>}
          </div>

          <div className="priceAndMoveContainer gap-3 d-flex flex-row justify-content-between">
            <div className="priceInputContainer d-flex flex-column container">
              <p>Rate per Month</p>
              <input
                {...register("price", {
                  required: "Price is required.",
                  min: { value: 0, message: "Price cannot be negative." },
                })}
                type="number"
                className='border p-2'
              />
              {errors.price && <p className="text-danger small mt-1">{errors.price.message}</p>}
              {fieldErrors.price && <p className="text-danger small mt-1">{fieldErrors.price}</p>}
            </div>
            <div className="capacityInputContainer d-flex flex-column container">
              <p>Maximum Capacity</p>
              <input
                {...register("maximumCapacity", {
                  required: "Maximum capacity is required.",
                  min: { value: 1, message: "Maximum capacity must be at least 1." },
                })}
                type="number"
                min="1"
                className='border p-2'
              />
              {errors.maximumCapacity && <p className="text-danger small mt-1">{errors.maximumCapacity.message}</p>}
              {fieldErrors.maximumCapacity && <p className="text-danger small mt-1">{fieldErrors.maximumCapacity}</p>}
            </div>
            <div className="genderPreference d-flex flex-column container" >
              <p>Gender Restrictions</p>
              <select {...register("gender")} className="form-select">
                <option value="co-ed">Co-ed: No restrictions</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>
          <div className="isOccupiedInputContainer d-flex align-items-center gap-2">
            <label htmlFor="" className="toggleSwitch">
              <input type="checkbox" {...register("isOccupied")} />
              <span className="toggleSlider"></span>
            </label>
            mark as occupied


          </div>
        </div>

        <div className="card shadow container p-5">
          <div className="blockHeader d-flex flex-row border-bottom pb-2 gap-2">
            <img src={aboutSpaceIcon} alt="" />
            <h1>About the Space</h1>
          </div>
          <div className="roomTitleInputcontainer">
            <p>Description</p>
            <textarea
              {...register("description", {
                maxLength: { value: 3000, message: "Description must be 3000 characters or fewer." },
              })}
              className='border p-4'
              rows={4}
              placeholder='Tell roomies what makes this room and the house special'
            ></textarea>
            {errors.description && <p className="text-danger small mt-1">{errors.description.message}</p>}
            {fieldErrors.description && <p className="text-danger small mt-1">{fieldErrors.description}</p>}
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


        <div className="card shadow container p-5">
          <div className="blockHeader d-flex flex-row border-bottom pb-2 gap-2">
            <img src={whereSpaceIcon} alt="" />
            <h1>Where is the Space?</h1>
          </div>

          <div className="locationInputContainer">
            <p>Building Name or Address </p>
            <input
              autoComplete="off"
              type="text"
              className="form-control border p-3"
              placeholder="Search building..."
              {...register("buildingName", { required: "Building name or address is required." })}
            />
            {errors.buildingName && <p className="text-danger small mt-1">{errors.buildingName.message}</p>}
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
            <select {...register("nearestCampus", { required: "Please select a campus." })} className='form-select border p-3'>
              <option value="">Select a campus</option>
              <option value="DLSU">DLSU-Manila</option>
              <option value="ADMU">ADMU</option>
              <option value="UST">UST</option>
              <option value="UPM">UP-Manila</option>
              <option value="UPD">UP-Diliman</option>

            </select>
            {errors.nearestCampus && <p className="text-danger small mt-1">{errors.nearestCampus.message}</p>}
            <p className='p-2 '>This info will affect searches and create a map with the campus pinned </p>
          </div>
          {selectedCampus && (
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

        <div className="card shadow container p-5">
          <div className="blockHeader border-bottom d-flex flex-row pb-2">
            <img src={contactPrefIcon} alt="" />
            <h1>contact preferences</h1>
          </div>
          <p className='pb-2 mb-0'><em className='mb-0 pb-2'>note: you are responsible for making sure you addd your appropriate information in your account details!</em></p>
          <div className="row g-3 mt-1">
            {CONTACT_METHODS.map((contact) => (
              <div className="col-md-4" key={contact}> <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={contact}
                  id={contact}
                  {...register("contacts")}
                />

                <label
                  className="form-check-label"
                  htmlFor={contact}
                >
                  Via {contact}
                </label>
              </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card shadow container p-5">
          <FileUpload file={uploadFile} onFileChange={setUploadFile} />
          {mode === "edit" && existingListing?.imageUrl && !uploadFile && (
            <div className="currentImagePreview mt-3">
              <p>Current image:</p>
              <img
                src={`${API_URL}${existingListing.imageUrl}`}
                alt="Current listing"
                style={{ maxWidth: "200px", borderRadius: "8px" }}
              />
            </div>
          )}
        </div>



        <button type="submit" className='btn btn-primary' disabled={submitting}>
          {submitting ? "Saving..." : mode === "edit" ? "Save Changes" : "submit"}
        </button>
      </form >
    </div >
  )

}

export default ManagerCreate
