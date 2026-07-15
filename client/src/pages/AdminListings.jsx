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
    setListingSoftDeleted,
} from '../api/adminListings';

const CAMPUS_OPTIONS = Object.keys(CAMPUSES); // "Big Four" (+UPD) scope -- same list the backend validates against

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
                        
                            <a href="#"
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
        </div>
    );
}

export default AdminListings;