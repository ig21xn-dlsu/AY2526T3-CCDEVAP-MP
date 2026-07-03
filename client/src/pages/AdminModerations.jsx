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

export default AdminModerations;