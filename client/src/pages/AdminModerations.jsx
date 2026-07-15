/*
import '../stylesheets/AdminModerations.css';
import AdminNavbar from '../components/AdminNavbar';
import ProfileSettingsModal from '../components/ProfileSettingsModal';
import { useState } from 'react';

function AdminModerations() {

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        <div id="moderations-wrapper">
        <AdminNavbar onOpenSettings={() => setIsSettingsOpen(true)} />
            {isSettingsOpen && <ProfileSettingsModal onClose={() => setIsSettingsOpen(false)} />}
        
        <div className="main-content">
            <div className="header">
                <div className="moderation-header">
                    <h2>Moderation Queue</h2>
                </div>
                <div className="under-header">
                    Review and manage flagged property listings and user reports.
                </div>
            </div>

            
            <div className="main-body">
                
                <div className="search-container">
                    <input type="text" placeholder="Search by listing name or reporter..."/>
                    <div className="filter">
                        <button className="button button1">
                            <img src="assets/filterIcon.svg" alt="filtericon" className="btn-icon"/>
                            Filter
                        </button>
                    </div>
                </div>

                
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>SUBJECT</th>
                                <th>REPORTER</th>
                                <th>REASON</th>
                                <th>DATE</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div className="subject-cell">
                                        <div>
                                            <div className="subject-title">Urban Shared Suite A1</div>
                                            <div className="subject-ref">Ref: PROP-001</div>
                                        </div>
                                    </div>
                                </td>
                                <td>Alex Rivera</td>
                                <td><span className="bad">Misleading Photos</span></td>
                                <td>Oct 24, 2023</td>
                                <td><a href="#" className="details">VIEW DETAILS</a></td>
                            </tr>

                            <tr>
                                <td>
                                    <div className="subject-cell">
                                        <div>
                                            <div className="subject-title">Co-Living Space C</div>
                                            <div className="subject-ref">Ref: PROP-001</div>
                                        </div>
                                    </div>
                                </td>
                                <td>Jordan Smith</td>
                                <td><span className="bad">Inaccurate Pricing</span></td>
                                <td>Oct 23, 2023</td>
                                <td><a href="#" className="details">VIEW DETAILS</a></td>
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
                
                <div className="pending-container">
                    <h2 className="title">PENDING MODERATION</h2>
                    <div className="stats">
                        <span className="stats-num">15</span>
                        <span className="stats-text">Open Cases</span>
                    </div>
                    <div className="progress-bar">
                        <div className="progress-fill"></div>
                    </div>
                    <div className="action">Urgent Action Needed</div> 
                </div>
            </div>
        </div>

        <div id="reportModal" className="modal-overlay">
            <div className="modal-card">
                <div className="modal-header">
                    <div className="modal-header-title">
                        <span className="alert-icon">⚠️</span>
                        Review Report - Luxury Downtown Loft
                    </div>
                    <button className="close-modal-btn">&times;</button>
                </div>

                <div className="modal-body">
                    <div className="listing-preview-card">
                        <div className="listing-img-placeholder">
                            <span className="price-tag">$2,400/mo</span>
                        </div>
                        <div className="listing-info">
                            <h4>Luxury Downtown Loft</h4>
                            <p className="listing-desc">Spacious 2-bedroom loft in the heart of downtown. Fully furnished
                                with high-end amenities and stunning city...</p>
                            <p className="listing-author">👤 Listed by <strong>Alex Morgan</strong> (Property Manager)</p>
                        </div>
                    </div>

                    <div className="modal-grid">
                        <div className="info-panel">
                            <h5 className="panel-title">REPORT INFO</h5>
                            <div className="info-row"><span className="info-label">Reason:</span> <span
                                    className="badge-danger">Scam / Fraudulent</span></div>
                            <div className="info-row"><span className="info-label">Reporter:</span> <span>Jordan Lee</span>
                            </div>
                            <div className="info-row"><span className="info-label">Date:</span> <span>Oct 24, 2023</span></div>
                        </div>
                        <div className="desc-panel">
                            <h5 className="panel-title">USER DESCRIPTION</h5>
                            <blockquote className="user-quote">
                                "The lister asked for a deposit to be wired via Western Union before showing the
                                property. The photos look like they were pulled from a hotel website. Very suspicious."
                            </blockquote>
                        </div>
                    </div>

                    <div className="notes-container">
                        <label for="adminNotes">Internal Admin Notes (Optional)</label>
                        <textarea id="adminNotes"
                            placeholder="Add notes justifying your decision before taking action..."></textarea>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn btn-dismiss">Ignore / Dismiss</button>
                    <button className="btn btn-danger">Delete Listing</button>
                </div>
            </div>
        </div>

    </div>
    );
}

export default AdminModerations;*/

import '../stylesheets/AdminModerations.css';
import AdminNavbar from '../components/AdminNavbar';
import ProfileSettingsModal from '../components/ProfileSettingsModal';
import DataTable from '../components/DataTable';
import { useEffect, useMemo, useState } from 'react';
import { fetchAdminReports, fetchPendingReportCount, updateReportStatus } from '../api/adminReports';
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

// A big batch, not "everything ever" -- DataTable owns search/sort/paging
// client-side once it has this set. status stays server-side since it's
// the cheap/relational filter, same pattern as AdminListings.
const BATCH_LIMIT = 500;

function AdminModerations() {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const [reports, setReports] = useState([]);
    const [totalOnServer, setTotalOnServer] = useState(0);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');

    // server-side filter (relational -- not left to client table)
    const [statusFilter, setStatusFilter] = useState('');

    const [pendingCount, setPendingCount] = useState(0);
    const [allReportsTotal, setAllReportsTotal] = useState(0);

    const [selectedReport, setSelectedReport] = useState(null);
    const [adminNotesDraft, setAdminNotesDraft] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState('');

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

    // pending-cases widget: real pending count + overall total (unfiltered)
    useEffect(() => {
        (async () => {
            try {
                const [pending, all] = await Promise.all([
                    fetchPendingReportCount(),
                    fetchAdminReports({ page: 1, limit: 1 }),
                ]);
                setPendingCount(pending);
                setAllReportsTotal(all.pagination?.total ?? 0);
            } catch {
                // widget is non-critical; fail silently
            }
        })();
    }, [reports]);

    const pendingPercent = allReportsTotal > 0
        ? Math.min(100, Math.round((pendingCount / allReportsTotal) * 100))
        : 0;

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

    const handleDeleteListing = async () => {
        if (!selectedReport) return;
        setActionLoading(true);
        setActionError('');
        try {
            if (selectedReport.listingId?._id) {
                await setListingSoftDeleted(selectedReport.listingId._id, true);
            }
            await updateReportStatus(selectedReport._id, 'resolved', adminNotesDraft);
            closeModal();
            load();
        } catch (err) {
            setActionError(err?.response?.data?.message || 'Failed to delete listing.');
        } finally {
            setActionLoading(false);
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
            cell: ({ row }) => (
                
                <a href="#"
                    className="details"
                    onClick={(e) => { e.preventDefault(); openReport(row.original); }}
                >
                    VIEW DETAILS
                </a>
            ),
        },
    ], []);

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

                    <div className="pending-container">
                        <h2 className="title">PENDING MODERATION</h2>
                        <div className="stats">
                            <span className="stats-num">{pendingCount}</span>
                            <span className="stats-text">Open Cases</span>
                        </div>
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${pendingPercent}%` }}></div>
                        </div>
                        <div className="action">
                            {pendingCount > 0 ? 'Urgent Action Needed' : 'All caught up'}
                        </div>
                    </div>
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
                                    <h5 className="panel-title">LISTING CONTACT / EMAIL</h5>
                                    <blockquote className="user-quote">
                                        {selectedReport.reportedBy?.email || 'No contact email on file.'}
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
                            <button className="btn btn-danger" onClick={handleDeleteListing} disabled={actionLoading}>
                                {actionLoading ? 'Working...' : 'Delete Listing'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default AdminModerations;