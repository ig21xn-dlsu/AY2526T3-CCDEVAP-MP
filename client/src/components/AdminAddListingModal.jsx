import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../context/AuthContext.jsx';
import { createAdminListing, updateAdminListing } from '../api/adminListings';
import { fetchManagers } from '../api/adminUsers';
import CAMPUSES from '../assets/util/CAMPUSES.js';
import FileUpload from './ManagerDashComponents/FileUpload.jsx';
import '../stylesheets/AdminCreateUserModal.css';
import '../stylesheets/AdminAddListingModal.css';

const PROPERTY_TAGS = [
    "Corner Unit", "Newly Renovated", "Move-In Ready", "Bright and Airy",
    "Spacious Room", "Near Transport", "Near Mall", "Quiet Area",
    "Residential Area", "Well-Maintained", "Modern Interior", "Newly Built",
    "Low-Density", "Good Natural Light", "Good Ventilation",
];

const AMENITIES = [
    "Free WiFi", "24/7 Security", "Utilities Included", "Parking",
    "Gym Access", "Pet Friendly", "In-Unit Laundry", "Air Conditioning",
    "Study Lounge", "Swimming Pool", "Tap Card System",
];

const CONTACT_METHODS = ["Email", "SMS / Phone", "Social Platform"];

const initialFormState = {
    roomTitle: '',
    price: '',
    maximumCapacity: 1,
    gender: 'co-ed',
    isOccupied: false,
    description: '',
    tags: [],
    amenities: [],
    contacts: [],
    buildingName: '',
    latitude: null,
    longitude: null,
    nearestCampus: '',
    owner: '',
    occupiedBy: '',
};

function AdminAddListingModal({ show, onClose, onListingCreated, mode = 'create', existingListing = null }) {
    const isEdit = mode === 'edit' && !!existingListing;

    const { user } = useContext(AuthContext);
    const { register, handleSubmit, watch, setValue, reset } = useForm({
        defaultValues: initialFormState,
    });

    const [managers, setManagers] = useState([]);
    const [managersError, setManagersError] = useState('');
    const [uploadFile, setUploadFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const selectedTags = watch('tags');
    const buildingName = watch('buildingName');
    const currentOccupiedBy = watch('occupiedBy');
    const [searchResults, setSearchResults] = useState([]);
    const [locationLocked, setLocationLocked] = useState(false);

    useEffect(() => {
        if (!show) return;
        fetchManagers()
            .then(setManagers)
            .catch(() => setManagersError('Could not load property owners list.'));
    }, [show]);

    useEffect(() => {
        if (!show) return;
        if (isEdit) {
            reset({
                ...existingListing,
                owner: existingListing.owner?._id || existingListing.owner || '',
                occupiedBy: existingListing.occupiedBy?._id || existingListing.occupiedBy || '',
            });
            setLocationLocked(true);
        } else {
            reset(initialFormState);
            setLocationLocked(false);
        }
        setUploadFile(null);
    }, [show, isEdit, existingListing, reset]);

    useEffect(() => {
        if (locationLocked) return;
        if (!buildingName || buildingName.trim().length < 3) {
            setSearchResults([]);
            return;
        }
        const timer = setTimeout(async () => {
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?${new URLSearchParams({
                        q: buildingName,
                        format: 'jsonv2',
                        limit: 5,
                        addressdetails: 1,
                        countrycodes: 'ph',
                    })}`,
                    { headers: { Accept: 'application/json' } }
                );
                const data = await response.json();
                setSearchResults(data);
            } catch (err) {
                console.error('Location search failed:', err);
            }
        }, 250);
        return () => clearTimeout(timer);
    }, [buildingName, locationLocked]);

    if (!show) return null;

    const toggleTag = (tag) => {
        if (selectedTags.includes(tag)) {
            setValue('tags', selectedTags.filter((t) => t !== tag));
        } else {
            setValue('tags', [...selectedTags, tag]);
        }
    };

    const selectLocation = (location) => {
        setValue('buildingName', location.display_name);
        setValue('latitude', parseFloat(location.lat));
        setValue('longitude', parseFloat(location.lon));
        setLocationLocked(true);
        setSearchResults([]);
    };

    const clearOccupancy = () => {
        setValue('occupiedBy', '');
        setValue('isOccupied', false);
    };

    const handleClose = () => {
        reset(initialFormState);
        setUploadFile(null);
        setError(null);
        setSuccessMessage('');
        setLocationLocked(false);
        onClose();
    };

    const onSubmit = async (formData) => {
        setIsLoading(true);
        setError(null);
        setSuccessMessage('');

        try {
            let imageUrl = existingListing?.imageUrl;
            if (uploadFile) {
                const imageFormData = new FormData();
                imageFormData.append('listingImage', uploadFile.file);
                const uploadResponse = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/upload`,
                    {
                        method: 'POST',
                        headers: { Authorization: `Bearer ${user.token}` },
                        body: imageFormData,
                    }
                );
                const uploadResult = await uploadResponse.json();
                imageUrl = uploadResult.imageUrl;
            }

            const payload = {
                ...formData,
                price: Number(formData.price),
                maximumCapacity: Number(formData.maximumCapacity),
                imageUrl: imageUrl
                    ? (Array.isArray(imageUrl) ? imageUrl : [imageUrl])
                    : [],
            };

            if (isEdit) {
                await updateAdminListing(existingListing._id, payload);
                setSuccessMessage('Listing updated successfully!');
            } else {
                await createAdminListing(payload);
                setSuccessMessage('Listing created successfully!');
            }

            onListingCreated();

            setTimeout(() => {
                handleClose();
            }, 1200);
        } catch (err) {
            setError(err?.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} listing.`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="admin-create-overlay">
            <div className="admin-create-modal admin-add-listing-modal">
                <div className="admin-create-header">
                    <h3>{isEdit ? 'Edit Listing' : 'Add Listing'}</h3>
                    <button className="admin-create-close" onClick={handleClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="admin-create-body">
                        {successMessage && <div className="admin-alert admin-alert-success">{successMessage}</div>}
                        {error && <div className="admin-alert admin-alert-danger">{error}</div>}
                        {managersError && <div className="admin-alert admin-alert-danger">{managersError}</div>}

                        <div className="admin-create-group">
                            <label>Owner (Property Manager)</label>
                            <select className="admin-create-select" {...register('owner', { required: true })}>
                                <option value="">Select an owner...</option>
                                {managers.map((m) => (
                                    <option key={m._id} value={m._id}>
                                        {m.firstName} {m.lastName} ({m.email})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="admin-create-group">
                            <label>Room Title</label>
                            <input
                                className="admin-create-input"
                                type="text"
                                placeholder="e.g. 2-Torre Lorenzo | One bedroom 4 beds"
                                {...register('roomTitle', { required: true })}
                            />
                        </div>

                        <div className="admin-form-row">
                            <div className="admin-create-group">
                                <label>Rate per Month</label>
                                <input className="admin-create-input" type="number" {...register('price', { required: true })} />
                            </div>
                            <div className="admin-create-group">
                                <label>Maximum Capacity</label>
                                <input className="admin-create-input" type="number" min="1" {...register('maximumCapacity', { required: true })} />
                            </div>
                            <div className="admin-create-group">
                                <label>Gender Restrictions</label>
                                <select className="admin-create-select" {...register('gender')}>
                                    <option value="co-ed">Co-ed: No restrictions</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                        </div>

                        <div className="admin-create-group admin-checkbox-row">
                            <input type="checkbox" id="isOccupied" {...register('isOccupied')} />
                            <label htmlFor="isOccupied">Mark as occupied</label>

                            <input type="hidden" {...register('occupiedBy')} />

                        {isEdit && (
                            <div className="admin-create-group">
                                <label>Occupancy</label>
                                {currentOccupiedBy ? (
                                    <div className="admin-occupancy-row">
                                        <span>
                                            Occupied by group:{' '}
                                            <strong>
                                                {existingListing?.occupiedBy?.groupName || currentOccupiedBy}
                                            </strong>
                                        </span>
                                        <button type="button" className="admin-btn admin-btn-cancel" onClick={clearOccupancy}>
                                            Clear Occupancy
                                        </button>
                                    </div>
                                ) : (
                                    <span className="admin-occupancy-vacant">
                                        Vacant -- no group currently assigned.
                                    </span>
                                )}
                                <p className="admin-field-hint">
                                    Use this if a manager forgot to remove a group after they moved out.
                                </p>
                            </div>
                        )}
                        </div>

                        <div className="admin-create-group">
                            <label>Description</label>
                            <textarea className="admin-create-input" rows={3} {...register('description')} />
                        </div>

                        <div className="admin-create-group">
                            <label>Lifestyle Tags</label>
                            <div className="admin-pill-container">
                                {PROPERTY_TAGS.map((tag) => (
                                    <button
                                        key={tag}
                                        type="button"
                                        className={`admin-tag-pill ${selectedTags.includes(tag) ? 'admin-tag-pill-active' : ''}`}
                                        onClick={() => toggleTag(tag)}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="admin-create-group">
                            <label>Amenities</label>
                            <div className="admin-checkbox-grid">
                                {AMENITIES.map((amenity) => (
                                    <div className="admin-checkbox-row" key={amenity}>
                                        <input type="checkbox" id={`amenity-${amenity}`} value={amenity} {...register('amenities')} />
                                        <label htmlFor={`amenity-${amenity}`}>{amenity}</label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="admin-create-group">
                            <label>Building Name or Address</label>
                            <input
                                className="admin-create-input"
                                type="text"
                                autoComplete="off"
                                placeholder="Search building..."
                                {...register('buildingName', { required: true })}
                            />
                            {searchResults.length > 0 && (
                                <div className="admin-location-results">
                                    {searchResults.map((location) => (
                                        <button
                                            key={location.place_id}
                                            type="button"
                                            className="admin-location-result-item"
                                            onClick={() => selectLocation(location)}
                                        >
                                            {location.display_name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="admin-create-group">
                            <label>Nearest Campus</label>
                            <select className="admin-create-select" {...register('nearestCampus', { required: true })}>
                                <option value="">Select a campus</option>
                                {Object.keys(CAMPUSES).map((code) => (
                                    <option key={code} value={code}>{CAMPUSES[code].name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="admin-create-group">
                            <label>Contact Preferences</label>
                            <div className="admin-checkbox-grid">
                                {CONTACT_METHODS.map((contact) => (
                                    <div className="admin-checkbox-row" key={contact}>
                                        <input type="checkbox" id={`contact-${contact}`} value={contact} {...register('contacts')} />
                                        <label htmlFor={`contact-${contact}`}>Via {contact}</label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="admin-create-group">
                            <label>Listing Photo</label>
                            <FileUpload file={uploadFile} onFileChange={setUploadFile} />
                            {isEdit && existingListing?.imageUrl?.[0] && !uploadFile && (
                                <div className="admin-current-image">
                                    <p>Current image:</p>
                                    <img
                                        src={`${import.meta.env.VITE_API_URL}${existingListing.imageUrl[0]}`}
                                        alt="Current listing"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="admin-create-footer">
                        <button type="button" className="admin-btn admin-btn-cancel" onClick={handleClose} disabled={isLoading}>
                            Cancel
                        </button>
                        <button type="submit" className="admin-btn admin-btn-submit" disabled={isLoading}>
                            {isLoading
                                ? (isEdit ? 'Saving...' : 'Creating...')
                                : (isEdit ? 'Save Changes' : 'Create Listing')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AdminAddListingModal;