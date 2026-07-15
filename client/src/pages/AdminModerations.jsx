import '../stylesheets/AdminModerations.css';
import AdminNavbar from '../components/AdminNavbar';
import ProfileSettingsModal from '../components/ProfileSettingsModal';
import DataTable from '../components/DataTable';
import { useEffect, useMemo, useState } from 'react';
import { fetchAdminReports, updateReportStatus } from '../api/adminReports';
import { setListingSoftDeleted } from '../api/adminListings';

const REASON_LABELS = {
    'Inaccurate Information': 'Inaccurate Information',
    'Scam or Fraudulent': 'Scam / Fraudulent',
    'Inappropriate Content': 'Inappropriate Content',
    'Duplicate Listing': 'Duplicate Listing',
    'Discrimination': 'Discrimination',
    'Other': 'Other',
};

function formatDate(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

function statusPill(status) {
    switch (status) {
        case 'resolved':
            return { label: 'Resolved', className: 'status-resolved' };
        case 'dismissed':
            return { label: 'Dismissed', className: 'status-dismissed' };
        default:
            return { label: 'Pending', className: 'status-pending' };
    }
}


const BATCH_LIMIT = 500;

function AdminModerations() {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const [reports, setReports] = useState([]);
    const [totalOnServer, setTotalOnServer] = useState(0);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');

    const [statusFilter, setStatusFilter] = useState('');

    const [selectedReport, setSelectedReport] = useState(null);
    const [adminNotesDraft, setAdminNotesDraft] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState('');
    
    const [deletingId, setDeletingId] = useState(null);

    const queryParams = useMemo(() => ({
        page: 1,
        limit: BATCH_LIMIT,
        status: statusFilter || undefined,
    }), [statusFilter]);

    const load = () => {
        setLoading(true);
        setLoadError('');
        return fetchAdminReports(queryParams)
            .then((res) => {
                setReports(res.data || []);
                setTotalOnServer(res.pagination?.total ?? 0);
            })
            .catch((err) => {
                setReports([]);
                setLoadError(err?.response?.data?.message || 'Failed to load reports.');
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        let active = true;
        setLoading(true);
        setLoadError('');

        fetchAdminReports(queryParams)
            .then((res) => {
                if (!active) return;
                setReports(res.data || []);
                setTotalOnServer(res.pagination?.total ?? 0);
            })
            .catch((err) => {
                if (!active) return;
                setReports([]);
                setLoadError(err?.response?.data?.message || 'Failed to load reports.');
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => { active = false; };
    }, [queryParams]);

    const openReport = (report) => {
        setSelectedReport(report);
        setAdminNotesDraft(report.adminNotes || '');
        setActionError('');
    };

    const closeModal = () => {
        setSelectedReport(null);
        setActionError('');
    };

    const handleDismiss = async () => {
        if (!selectedReport) return;
        setActionLoading(true);
        setActionError('');
        try {
            await updateReportStatus(selectedReport._id, 'dismissed', adminNotesDraft);
            closeModal();
            load();
        } catch (err) {
            setActionError(err?.response?.data?.message || 'Failed to dismiss report.');
        } finally {
            setActionLoading(false);
        }
    };

    // now lives on the table row itself instead of inside the report modal
    const handleDeleteListing = async (report) => {
        if (!report?._id || deletingId) return;
        setDeletingId(report._id);
        setLoadError('');
        try {
            if (report.listingId?._id) {
                await setListingSoftDeleted(report.listingId._id, true);
            }
            await updateReportStatus(report._id, 'resolved', report.adminNotes || '');
            if (selectedReport?._id === report._id) closeModal();
            load();
        } catch (err) {
            setLoadError(err?.response?.data?.message || 'Failed to delete listing.');
        } finally {
            setDeletingId(null);
        }
    };

    const columns = useMemo(() => [
        {
            id: 'subject',
            header: 'SUBJECT',
            accessorFn: (r) => r.listingId?.roomTitle || 'Listing removed',
            cell: ({ row }) => {
                const report = row.original;
                const refIndex = report._id ? String(report._id).slice(-3).toUpperCase() : '000';
                return (
                    <div className="subject-cell">
                        <div>
                            <div className="subject-title">
                                {report.listingId?.roomTitle || 'Listing removed'}
                            </div>
                            <div className="subject-ref">Ref: RPT-{refIndex}</div>
                        </div>
                    </div>
                );
            },
        },
        {
            id: 'reporter',
            header: 'REPORTER',
            accessorFn: (r) => r.reportedBy ? `${r.reportedBy.firstName} ${r.reportedBy.lastName}` : 'Unknown',
        },
        {
            id: 'reason',
            header: 'REASON',
            accessorFn: (r) => REASON_LABELS[r.reason] || r.reason,
            cell: ({ getValue }) => <span className="bad">{getValue()}</span>,
        },
        {
            id: 'date',
            header: 'DATE',
            accessorFn: (r) => r.createdAt,
            cell: ({ getValue }) => formatDate(getValue()),
        },
        {
            id: 'status',
            header: 'STATUS',
            accessorFn: (r) => statusPill(r.status).label,
            cell: ({ row }) => {
                const pill = statusPill(row.original.status);
                return <span className={`status-pill ${pill.className}`}>{pill.label}</span>;
            },
        },
        {
            id: 'actions',
            header: 'ACTIONS',
            enableSorting: false,
            cell: ({ row }) => {
                const report = row.original;
                const isDeleting = deletingId === report._id;
                return (
                    <div className="actions-cell">
                        
                        <a href="#"
                            className="details"
                            onClick={(e) => { e.preventDefault(); openReport(report); }}
                        >
                            VIEW DETAILS
                        </a>
                        <span className="action-divider">&middot;</span>
                        
                            <a href="#"
                            className="action-delete-btn"
                            onClick={(e) => { e.preventDefault(); handleDeleteListing(report); }}
                        >
                            {isDeleting ? 'DELETING...' : 'DELETE'}
                        </a>
                    </div>
                );
            },
        },
    ], [deletingId]);

    const filterToolbar = (
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
            <option value="dismissed">Dismissed</option>
        </select>
    );

    return (
        <div id="moderations-wrapper">
            <AdminNavbar onOpenSettings={() => setIsSettingsOpen(true)} />
            {isSettingsOpen && <ProfileSettingsModal onClose={() => setIsSettingsOpen(false)} />}

            <div className="main-content">
                <div className="header header-row">
                    <div>
                        <div className="moderation-header">
                            <h2>Moderation Queue</h2>
                        </div>
                        <div className="under-header">
                            Review and manage flagged property listings and user reports. ({totalOnServer} match current filters)
                        </div>
                    </div>
                </div>

                <div className="main-body">

                    {loadError && <div className="table-error">{loadError}</div>}

                    {loading ? (
                        <div className="table-empty">Loading reports...</div>
                    ) : (
                        <DataTable
                            columns={columns}
                            data={reports}
                            searchPlaceholder="Search by listing name or reporter..."
                            emptyMessage="No reports match these filters."
                            pageSize={8}
                            exportFilename="reports.csv"
                            toolbarExtra={filterToolbar}
                        />
                    )}
                </div>
            </div>

            {selectedReport && (
                <div id="reportModal" className="modal-overlay active" onClick={closeModal}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-header-title">
                                <span className="alert-icon">⚠️</span>
                                Review Report - {selectedReport.listingId?.roomTitle || 'Listing removed'}
                            </div>
                            <button className="close-modal-btn" onClick={closeModal}>&times;</button>
                        </div>

                        <div className="modal-body">
                            <div className="listing-preview-card">
                                <div className="listing-img-placeholder">
                                    <span className="price-tag">
                                        {selectedReport.listingId?.price
                                            ? `PHP ${Number(selectedReport.listingId.price).toLocaleString('en-PH')}/mo`
                                            : 'N/A'}
                                    </span>
                                </div>
                                <div className="listing-info">
                                    <h4>{selectedReport.listingId?.roomTitle || 'Listing removed'}</h4>
                                    <p className="listing-desc">
                                        {selectedReport.listingId?.buildingName || 'No building info available for this listing.'}
                                    </p>
                                    <p className="listing-author">
                                        👤 Reported by <strong>
                                            {selectedReport.reportedBy
                                                ? `${selectedReport.reportedBy.firstName} ${selectedReport.reportedBy.lastName}`
                                                : 'Unknown user'}
                                        </strong>
                                    </p>
                                </div>
                            </div>

                            <div className="modal-grid">
                                <div className="info-panel">
                                    <h5 className="panel-title">REPORT INFO</h5>
                                    <div className="info-row">
                                        <span className="info-label">Reason:</span>
                                        <span className="badge-danger">
                                            {REASON_LABELS[selectedReport.reason] || selectedReport.reason}
                                        </span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">Reporter:</span>
                                        <span>
                                            {selectedReport.reportedBy
                                                ? `${selectedReport.reportedBy.firstName} ${selectedReport.reportedBy.lastName}`
                                                : 'Unknown user'}
                                        </span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">Date:</span>
                                        <span>{formatDate(selectedReport.createdAt)}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">Status:</span>
                                        <span className={`status-pill ${statusPill(selectedReport.status).className}`}>
                                            {statusPill(selectedReport.status).label}
                                        </span>
                                    </div>
                                </div>
                               <div className="desc-panel">
                                    <h5 className="panel-title">REPORT DESCRIPTION</h5>
                                    <blockquote className="user-quote">
                                        {selectedReport.reason || 'No description provided for this report.'}
                                    </blockquote>
                                </div>
                            </div>

                            <div className="notes-container">
                                <label htmlFor="adminNotes">Internal Admin Notes (Optional)</label>
                                <textarea
                                    id="adminNotes"
                                    placeholder="Add notes justifying your decision before taking action..."
                                    value={adminNotesDraft}
                                    onChange={(e) => setAdminNotesDraft(e.target.value)}
                                />
                            </div>

                            {actionError && <div className="table-error">{actionError}</div>}
                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-dismiss" onClick={handleDismiss} disabled={actionLoading}>
                                {actionLoading ? 'Working...' : 'Ignore / Dismiss'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default AdminModerations;