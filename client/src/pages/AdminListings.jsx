/*import '../stylesheets/AdminListings.css';
import AdminNavbar from '../components/AdminNavbar';
import ProfileSettingsModal from '../components/ProfileSettingsModal';
import { useState } from 'react';

function AdminListings() {

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        <div id="listings-wrapper">

         <AdminNavbar onOpenSettings={() => setIsSettingsOpen(true)} />
            {isSettingsOpen && <ProfileSettingsModal onClose={() => setIsSettingsOpen(false)} />}
        
        
        <div className="main-content">
            <div className="header">
                <div className="property-header">
                    <h2>Property Listings</h2>
                </div>
                <div className="under-header">
                    Manage and monitor all shared space listings.
                </div>
            </div>


            <div className="main-body">
                
                <div className="admin-filter">
                    <label for="status">Location</label>
                    <select name="city" id="city">
                        <option value="selectcity">Select City</option>
                        <option value="manila">Manila</option>
                    </select>
                    <label for="status">Status</label>
                    <select name="status" id="status">
                        <option value="allstatus">All Status</option>
                    </select>
                    <label for="status">Price Range</label>
                    <select name="pricerange" id="pricerange">
                        <option value="anyprice">Any Price</option>
                    </select>
                </div>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>PROPERTY</th>
                                <th>LOCATION</th>
                                <th>STATUS</th>
                                <th>PRICE</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td>
                                    <div className="property-cell">
                                        <img src="images/dorm_1.jpg" alt="property1"/>
                                        <div>
                                            <div className="property-title">Urban Shared Suite A1</div>
                                            <div className="property-ref">Ref: PROP-001</div>
                                        </div>
                                    </div>
                                </td>
                                <td>Makati City, Metro Manila</td>
                                <td><span className="active">Active</span></td>
                                <td>PHP 12,500/mo</td>
                                <td><a href="#" className="edit">EDIT</a></td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="property-cell">
                                        <img src="images/dorm_2.jpg" alt="property1"/>
                                        <div>
                                            <div className="property-title">Urban Shared Suite B2</div>
                                            <div className="property-ref">Ref: PROP-002</div>
                                        </div>
                                    </div>
                                </td>
                                <td>BGC, Taguig</td>
                                <div className="pill">
                                    <td><span className="active">Active</span></td>
                                </div>
                                <td>PHP 12,500/mo</td>
                                <td><a href="#" className="edit">EDIT</a></td>
                            </tr>

                            <tr>
                                <td>
                                    <div className="property-cell">
                                        <img src="images/dorm_3.jpg" alt="property1"/>
                                        <div>
                                            <div className="property-title">Urban Shared Suite B2</div>
                                            <div className="property-ref">Ref: PROP-003</div>
                                        </div>
                                    </div>
                                </td>
                                <td>Quezon City</td>
                                <td><span className="inactive">Inactive</span></td>
                                <td>PHP 12,500/mo</td>
                                <td><a href="#" className="edit">EDIT</a></td>
                            </tr>

                            <tr>
                                <td>
                                    <div className="property-cell">
                                        <img src="images/sign-up-1.jpg" alt="property1"/>
                                        <div>
                                            <div className="property-title">Co-Living Space C</div>
                                            <div className="property-ref">Ref: PROP-004</div>
                                        </div>
                                    </div>
                                </td>
                                <td>Manila</td>
                                <td><span className="active">Active</span></td>
                                <td>PHP 12,500/mo</td>
                                <td><a href="#" className="edit">EDIT</a></td>
                            </tr>
                        </tbody>

                        <tfoot>
                            <tr>
                                <td colspan="5">
                                    <div className="table-footer">
                                        <div className="footer-status">4 of 124 properties</div>
                                        <ul className="pagination">
                                            <li><a href="#">&#8592;</a></li>
                                            <li><a href="#">1</a></li>
                                            <li><a href="#">2</a></li>
                                            <li><a href="#">3</a></li>
                                            <li>...</li>
                                            <li><a href="#">&#8594;</a></li>
                                        </ul>
                                    </div>
                                </td>
                            </tr>
                        </tfoot>
                    </table>

                </div>
                <div className="total-listings">
                    <h2 className="title">TOTAL LISTINGS SPACE</h2>
                    <div className="stats">
                        <span className="stats-num">124</span>
                        Active Units
                    </div>
                    <div className="progress-bar">
                        <div className="progress-fill"></div>
                    </div>
                    <div className="capacity">75%</div>
                </div>
                </div>
            </div>
            </div>
    );
}

export default AdminListings;*/

import '../stylesheets/AdminListings.css';
import AdminNavbar from '../components/AdminNavbar';
import ProfileSettingsModal from '../components/ProfileSettingsModal';
import ConfirmModal from '../components/ConfirmModal';
import DataTable from '../components/DataTable';
import CAMPUSES from '../assets/util/CAMPUSES.js';
import { useEffect, useMemo, useState } from 'react';
import { useDebouncedValue } from '../hook/useDebouncedValue';
import {
    fetchAdminListings,
    createAdminListing,
    setListingSoftDeleted,
} from '../api/adminListings';

const CAMPUS_OPTIONS = Object.keys(CAMPUSES); // "Big Four" (+UPD) scope -- same list the backend validates against

const EMPTY_FORM = {
    roomTitle: '',
    price: '',
    gender: '',
    nearestCampus: '',
    buildingName: '',
    description: '',
    isOccupied: false,
    tags: '',
    amenities: '',
    contacts: '',
};

function statusOf(listing) {
    if (listing.isDeleted) return { label: 'Deleted', className: 'inactive' };
    if (listing.isOccupied) return { label: 'Inactive', className: 'inactive' };
    return { label: 'Active', className: 'active' };
}

// A big batch, not "everything ever" -- DataTable owns search/sort/paging
// client-side once it has this set. campus/status/price stay server-side
// since they're the expensive/relational filters.
const BATCH_LIMIT = 500;

function AdminListings() {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const [listings, setListings] = useState([]);
    const [totalOnServer, setTotalOnServer] = useState(0);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);

    // server-side filters (relational / expensive -- not left to client table)
    const [campus, setCampus] = useState('');
    const [status, setStatus] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const debouncedMinPrice = useDebouncedValue(minPrice, 400);
    const debouncedMaxPrice = useDebouncedValue(maxPrice, 400);

    const [selectedListing, setSelectedListing] = useState(null);

    const [confirmTarget, setConfirmTarget] = useState(null); // { listing, nextIsDeleted }
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [showAddModal, setShowAddModal] = useState(false);
    const [addForm, setAddForm] = useState(EMPTY_FORM);
    const [addErrors, setAddErrors] = useState({});
    const [addSubmitting, setAddSubmitting] = useState(false);

    const queryParams = useMemo(() => ({
        page: 1,
        limit: BATCH_LIMIT,
        campus: campus || undefined,
        status: status || undefined,
        minPrice: debouncedMinPrice || undefined,
        maxPrice: debouncedMaxPrice || undefined,
    }), [campus, status, debouncedMinPrice, debouncedMaxPrice]);

    const load = () => {
        setLoading(true);
        setLoadError(null);
        return fetchAdminListings(queryParams)
            .then((res) => {
                setListings(Array.isArray(res?.data) ? res.data : []);
                setTotalOnServer(res?.pagination?.total ?? 0);
        })
        .catch((err) => {
            setListings([]);
            setLoadError(err?.response?.data?.message || 'Failed to load listings.');
        })
        .finally(() => setLoading(false));
    };

    useEffect(() => {
        let active = true;
        setLoading(true);
        setLoadError(null);

        fetchAdminListings(queryParams)
            .then((res) => {
            if (!active) return;
                setListings(Array.isArray(res?.data) ? res.data : []);
                setTotalOnServer(res?.pagination?.total ?? 0);
            })
        .catch((err) => {
            if (!active) return;
            setListings([]);
            setLoadError(err?.response?.data?.message || 'Failed to load listings.');
        })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => { active = false; };
    }, [queryParams]);

    const handleConfirmDelete = async () => {
        if (!confirmTarget) return;
        setConfirmLoading(true);
        try {
            await setListingSoftDeleted(confirmTarget.listing._id, confirmTarget.nextIsDeleted);
            setConfirmTarget(null);
            setSelectedListing(null);
            load();
        } catch (err) {
            setLoadError(err?.response?.data?.message || 'Failed to update listing.');
        } finally {
            setConfirmLoading(false);
        }
    };

    const openAddModal = () => {
        setAddForm(EMPTY_FORM);
        setAddErrors({});
        setShowAddModal(true);
    };

    const handleAddSubmit = async () => {
        setAddSubmitting(true);
        setAddErrors({});
        try {
            const payload = {
                roomTitle: addForm.roomTitle,
                price: Number(addForm.price),
                gender: addForm.gender,
                nearestCampus: addForm.nearestCampus,
                buildingName: addForm.buildingName,
                description: addForm.description,
                isOccupied: addForm.isOccupied,
                tags: addForm.tags.split(',').map((t) => t.trim()).filter(Boolean),
                amenities: addForm.amenities.split(',').map((t) => t.trim()).filter(Boolean),
                contacts: addForm.contacts.split(',').map((t) => t.trim()).filter(Boolean),
            };
            await createAdminListing(payload);
            setShowAddModal(false);
            load();
        } catch (err) {
            const data = err?.response?.data;
            if (data?.errors) setAddErrors(data.errors);
            else setLoadError(data?.message || 'Failed to create listing.');
        } finally {
            setAddSubmitting(false);
        }
    };

    // ---- TanStack columns config ----
    const columns = useMemo(() => [
        {
            id: 'property',
            header: 'PROPERTY',
            accessorKey: 'roomTitle',
            cell: ({ row }) => {
                const listing = row.original;
                // Generate PROP-XXX using the last 3 chars of the ID to match design
                const propIndex = listing._id ? String(listing._id).slice(-3).toUpperCase() : '000';
                const imgSrc = listing.imageUrl?.[0] 
                    ? `${import.meta.env.VITE_API_URL}${listing.imageUrl[0]}` 
                    : '/images/dorm_1.jpg';

                return (
                    <div className="property-cell">
                        <img
                            src={imgSrc}
                            alt={listing.roomTitle}
                            className="property-thumb"
                        />
                        <div className="property-details">
                            <div className="property-title">{listing.roomTitle}</div>
                            <div className="property-ref">Ref: PROP-{propIndex}</div>
                        </div>
                    </div>
                );
            },
        },
        {
            id: 'location',
            header: 'LOCATION',
            accessorFn: (l) => `${l.buildingName || ''} ${l.nearestCampus || ''}`,
            cell: ({ row }) => {
                const l = row.original;
                return (
                    <span className="location-text">
                        {l.buildingName || ''}
                        {l.buildingName && l.nearestCampus ? ', ' : ''}
                        {l.nearestCampus || ''}
                    </span>
                );
            },
        },
        {
            id: 'status',
            header: 'STATUS',
            accessorFn: (l) => statusOf(l).label,
            cell: ({ row }) => {
                const s = statusOf(row.original);
                return <span className={`status-badge ${s.className}`}>{s.label}</span>;
            },
        },
        {
            id: 'price',
            header: 'PRICE',
            accessorKey: 'price',
            cell: ({ getValue }) => `PHP ${Number(getValue() || 0).toLocaleString('en-PH')}/mo`,
        },
        {
            id: 'actions',
            header: 'ACTIONS',
            enableSorting: false,
            cell: ({ row }) => {
                const listing = row.original;
                return (
                    <div className="actions-cell">
                        <a 
                            href="#" 
                            className="action-edit-btn" 
                            onClick={(e) => { e.preventDefault(); setSelectedListing(listing); }}
                        >
                            EDIT
                        </a>
                        <span className="action-divider">&middot;</span>
                        <a
                            href="#"
                            className="action-delete-btn"
                            onClick={(e) => {
                                e.preventDefault();
                                setConfirmTarget({ listing, nextIsDeleted: !listing.isDeleted });
                            }}
                        >
                            {listing.isDeleted ? 'RESTORE' : 'DELETE'}
                        </a>
                    </div>
                );
            },
        },
    ], []);

    const filterToolbar = (
        <>
            <select value={campus} onChange={(e) => setCampus(e.target.value)}>
                <option value="">All Campuses</option>
                {CAMPUS_OPTIONS.map((c) => (
                    <option key={c} value={c}>{CAMPUSES[c].name}</option>
                ))}
            </select>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="deleted">Deleted</option>
            </select>
            <input type="number" min="0" placeholder="Min P" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
            <input type="number" min="0" placeholder="Max P" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
            <button type="button" className="create-new-btn" onClick={openAddModal}>+ Create New</button>
        </>
    );

    return (
        <div id="listings-wrapper">
            <AdminNavbar onOpenSettings={() => setIsSettingsOpen(true)} />
            {isSettingsOpen && <ProfileSettingsModal onClose={() => setIsSettingsOpen(false)} />}

            <div className="main-content">
                <div className="header header-row">
                    <div>
                        <div className="property-header">
                            <h2>Property Listings</h2>
                        </div>
                        <div className="under-header">
                            Manage and monitor all shared space listings. ({totalOnServer} match current filters)
                        </div>
                    </div>
                </div>

                {loadError && <div className="table-error">{loadError}</div>}

                {loading ? (
                    <div className="table-empty">Loading listings...</div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={listings}
                        searchPlaceholder="Search by title or building..."
                        emptyMessage="No listings match these filters."
                        pageSize={8}
                        exportFilename="listings.csv"
                        toolbarExtra={filterToolbar}
                    />
                )}
            </div>

            {/* VIEW DETAILS MODAL */}
            {selectedListing && (
                <div className="modal-overlay active" onClick={() => setSelectedListing(null)}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-header-title">{selectedListing.roomTitle}</div>
                            <button className="close-modal-btn" onClick={() => setSelectedListing(null)}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <div className="listing-preview-card">
                                <div
                                    className="listing-img-placeholder"
                                    style={selectedListing.imageUrl?.[0] ? {
                                        backgroundImage: `url(${import.meta.env.VITE_API_URL}${selectedListing.imageUrl[0]})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    } : undefined}
                                >
                                    <span className="price-tag">P{Number(selectedListing.price || 0).toLocaleString('en-PH')}/mo</span>
                                </div>
                                <div className="listing-info">
                                    <h4>{selectedListing.roomTitle}</h4>
                                    <p className="listing-desc">{selectedListing.description || 'No description provided.'}</p>
                                    <p className="listing-author">{selectedListing.buildingName || '--'} - {selectedListing.nearestCampus || '--'}</p>
                                </div>
                            </div>

                            <div className="modal-grid">
                                <div className="info-panel">
                                    <h5 className="panel-title">LISTING INFO</h5>
                                    <div className="info-row"><span className="info-label">Ref:</span> <span>PROP-{selectedListing._id ? String(selectedListing._id).slice(-3).toUpperCase() : '000'}</span></div>
                                    <div className="info-row"><span className="info-label">Status:</span> <span className={statusOf(selectedListing).className}>{statusOf(selectedListing).label}</span></div>
                                    <div className="info-row"><span className="info-label">Gender:</span> <span>{selectedListing.gender || '--'}</span></div>
                                    <div className="info-row"><span className="info-label">Owner:</span> <span>{selectedListing.owner?.firstName ? `${selectedListing.owner.firstName} ${selectedListing.owner.lastName}` : String(selectedListing.owner || '--')}</span></div>
                                </div>
                                <div className="desc-panel">
                                    <h5 className="panel-title">AMENITIES & TAGS</h5>
                                    <p style={{ fontSize: 13, color: '#475569', marginBottom: 8 }}>
                                        {selectedListing.amenities?.length ? selectedListing.amenities.join(', ') : 'No amenities listed.'}
                                    </p>
                                    <p style={{ fontSize: 13, color: '#475569' }}>
                                        {selectedListing.tags?.length ? selectedListing.tags.join(', ') : 'No tags.'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-dismiss" onClick={() => setSelectedListing(null)}>Close</button>
                            <button
                                className="btn btn-danger"
                                onClick={() => setConfirmTarget({ listing: selectedListing, nextIsDeleted: !selectedListing.isDeleted })}
                            >
                                {selectedListing.isDeleted ? 'Restore Listing' : 'Delete Listing'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmModal
                open={!!confirmTarget}
                title={confirmTarget?.nextIsDeleted ? 'Delete Listing' : 'Restore Listing'}
                message={confirmTarget
                    ? `Are you sure you want to ${confirmTarget.nextIsDeleted ? 'delete' : 'restore'} the record of "${confirmTarget.listing.roomTitle}"?`
                    : ''}
                confirmLabel={confirmTarget?.nextIsDeleted ? 'Delete' : 'Restore'}
                danger={!!confirmTarget?.nextIsDeleted}
                loading={confirmLoading}
                onConfirm={handleConfirmDelete}
                onCancel={() => setConfirmTarget(null)}
            />

            {/* HARD ADD MODAL */}
            {showAddModal && (
                <div className="modal-overlay active" onClick={() => setShowAddModal(false)}>
                    <div className="modal-card hard-add-card" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-header-title">Manually Add a Listing</div>
                            <button className="close-modal-btn" onClick={() => setShowAddModal(false)}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <div className="hard-add-grid">
                                <div className="form-field">
                                    <label>Room Title</label>
                                    <input value={addForm.roomTitle} onChange={(e) => setAddForm((f) => ({ ...f, roomTitle: e.target.value }))} />
                                    {addErrors.roomTitle && <span className="field-error">{addErrors.roomTitle}</span>}
                                </div>
                                <div className="form-field">
                                    <label>Price (P/mo)</label>
                                    <input type="number" value={addForm.price} onChange={(e) => setAddForm((f) => ({ ...f, price: e.target.value }))} />
                                    {addErrors.price && <span className="field-error">{addErrors.price}</span>}
                                </div>
                                <div className="form-field">
                                    <label>Gender Preference</label>
                                    <input
                                        placeholder="e.g. co-ed, male, female"
                                        value={addForm.gender}
                                        onChange={(e) => setAddForm((f) => ({ ...f, gender: e.target.value }))}
                                    />
                                </div>
                                <div className="form-field">
                                    <label>Nearest Campus</label>
                                    <select value={addForm.nearestCampus} onChange={(e) => setAddForm((f) => ({ ...f, nearestCampus: e.target.value }))}>
                                        <option value="">Select campus...</option>
                                        {CAMPUS_OPTIONS.map((c) => <option key={c} value={c}>{CAMPUSES[c].name}</option>)}
                                    </select>
                                    {addErrors.nearestCampus && <span className="field-error">{addErrors.nearestCampus}</span>}
                                </div>
                                <div className="form-field full-width">
                                    <label>Building Name</label>
                                    <input value={addForm.buildingName} onChange={(e) => setAddForm((f) => ({ ...f, buildingName: e.target.value }))} />
                                </div>
                                <div className="form-field full-width">
                                    <label>Description</label>
                                    <textarea rows={3} value={addForm.description} onChange={(e) => setAddForm((f) => ({ ...f, description: e.target.value }))} />
                                </div>
                                <div className="form-field">
                                    <label>Tags (comma separated)</label>
                                    <input value={addForm.tags} onChange={(e) => setAddForm((f) => ({ ...f, tags: e.target.value }))} />
                                </div>
                                <div className="form-field">
                                    <label>Amenities (comma separated)</label>
                                    <input value={addForm.amenities} onChange={(e) => setAddForm((f) => ({ ...f, amenities: e.target.value }))} />
                                </div>
                                <div className="form-field full-width">
                                    <label>Contacts (comma separated)</label>
                                    <input value={addForm.contacts} onChange={(e) => setAddForm((f) => ({ ...f, contacts: e.target.value }))} />
                                </div>
                                <div className="form-field checkbox-field">
                                    <label>
                                        <input type="checkbox" checked={addForm.isOccupied} onChange={(e) => setAddForm((f) => ({ ...f, isOccupied: e.target.checked }))} />
                                        Currently Occupied
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-dismiss" onClick={() => setShowAddModal(false)} disabled={addSubmitting}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleAddSubmit} disabled={addSubmitting}>
                                {addSubmitting ? 'Adding...' : 'Add Listing'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminListings;