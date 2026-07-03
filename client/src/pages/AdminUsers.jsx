import '../stylesheets/AdminUsers.css';
import AdminNavbar from '../components/AdminNavbar';
import ProfileSettingsModal from '../components/ProfileSettingsModal';
import { useState } from 'react';

function AdminUsers() {

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        <div id="users-wrapper">
        
         <AdminNavbar onOpenSettings={() => setIsSettingsOpen(true)} />
            {isSettingsOpen && <ProfileSettingsModal onClose={() => setIsSettingsOpen(false)} />}

        <div className="main-content">
            <div className="header">
                <div className="user-header">
                    <h2>User Management</h2>
                </div>
                <div className="under-header">
                    Overview and control of platform members.
                </div>
            </div>

            <div className="main-body">

                <div className="metrics-container">
                    <div className="metric-card">
                        <div className="metric-header">
                            <div className="metric-icon-bg user-icon">
                                <img src="assets/userIcon.svg" alt="" onerror="this.style.display='none'"/>👤
                            </div>
                            <span className="badge badge-success">+12% this month</span>
                        </div>
                        <div className="metric-label">Total Users</div>
                        <div className="metric-value">12,842</div>
                    </div>

                    <div className="metric-card">
                        <div className="metric-header">
                            <div className="metric-icon-bg active-icon">
                                <img src="assets/activityIcon.svg" alt="" onerror="this.style.display='none'"/>📶
                            </div>
                            <span className="badge badge-text">Currently online</span>
                        </div>
                        <div className="metric-label">Active Sessions</div>
                        <div className="metric-value">1,204</div>
                    </div>

                    <div className="metric-card">
                        <div className="metric-header">
                            <div className="metric-icon-bg pending-icon">
                                <img src="assets/pendingIcon.svg" alt="" onerror="this.style.display='none'"/>📋
                            </div>
                            <span className="badge badge-warning">Requires action</span>
                        </div>
                        <div className="metric-label">Pending Approvals</div>
                        <div className="metric-value">84</div>
                    </div>

                    <div className="metric-card">
                        <div className="metric-header">
                            <div className="metric-icon-bg signup-icon">
                                <img src="assets/addUserIcon.svg" alt="" onerror="this.style.display='none'"/>👤﹢
                            </div>
                            <span className="badge badge-text">Last 7 days</span>
                        </div>
                        <div className="metric-label">New Signups</div>
                        <div className="metric-value">342</div>
                    </div>
                </div>

                <div className="search-container">
                    <input type="text" placeholder="Search users by name or email..."/>
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
                                <th><input type="checkbox" className="header-checkbox"/></th>
                                <th>USER</th>
                                <th>ROLE</th>
                                <th>STATUS</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td><input type="checkbox"/></td>
                                <td>
                                    <div className="user-cell">
                                        <div className="avatar-placeholder">SJ</div>
                                        <div>
                                            <div className="user-name">Sarah Jenkins</div>
                                            <div className="user-email">sarah.j@university.edu</div>
                                        </div>
                                    </div>
                                </td>
                                <td>Student</td>
                                <td><span className="status-pill active">Active</span></td>
                                <td><a href="#" className="edit-btn">Edit</a></td>
                            </tr>

                            <tr>
                                <td><input type="checkbox"/></td>
                                <td>
                                    <div className="user-cell">
                                        <div className="avatar-placeholder">MC</div>
                                        <div>
                                            <div className="user-name">Marcus Chen</div>
                                            <div className="user-email">m.chen@properties.com</div>
                                        </div>
                                    </div>
                                </td>
                                <td>Property Owner</td>
                                <td><span className="status-pill pending">Pending</span></td>
                                <td><a href="#" className="edit-btn">Edit</a></td>
                            </tr>

                            <tr>
                                <td><input type="checkbox"/></td>
                                <td>
                                    <div className="user-cell">
                                        <div className="avatar-placeholder">DM</div>
                                        <div>
                                            <div className="user-name">David Miller</div>
                                            <div className="user-email">david.m@roomieconnect.com</div>
                                        </div>
                                    </div>
                                </td>
                                <td>Administrator</td>
                                <td><span className="status-pill active">Active</span></td>
                                <td><a href="#" className="edit-btn">Edit</a></td>
                            </tr>

                            <tr>
                                <td><input type="checkbox"/></td>
                                <td>
                                    <div className="user-cell">
                                        <div className="avatar-placeholder">AL</div>
                                        <div>
                                            <div className="user-name">Alex Lee</div>
                                            <div className="user-email">alex.l@stateu.edu</div>
                                        </div>
                                    </div>
                                </td>
                                <td>Student</td>
                                <td><span className="status-pill suspended">Suspended</span></td>
                                <td><a href="#" className="edit-btn">Edit</a></td>
                            </tr>
                        </tbody>

                        <tfoot>
                            <tr>
                                <td colspan="5">
                                    <div className="table-footer">
                                        <div className="csv-download-box">
                                            <a href="#" className="download-csv">
                                                <img src="assets/downloadIcon.svg" alt="" className="btn-icon"/>
                                                Download CSV
                                            </a>
                                        </div>
                                        <div className="pagination-wrapper">
                                            <span className="footer-status">Showing 1-4 of 12,842</span>
                                            <ul className="pagination">
                                                <li><a href="#">&#8592;</a></li>
                                                <li><a href="#">&#8594;</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <div className="bottom-dashboard-grid">
                    <div className="dashboard-card">
                        <div className="card-header-row">
                            <h3><span className="icon-shield">🛡️</span> Security Events</h3>
                            <a href="#" className="view-all-link">View All</a>
                        </div>
                        <div className="log-list">
                            <div className="log-item">
                                <div className="log-main">
                                    <div className="log-title critical">Multiple failed login attempts</div>
                                    <div className="log-meta">User: unknown@test.com • IP: 192.168.1.105</div>
                                </div>
                                <div className="log-time">2m ago</div>
                            </div>
                            <div className="log-item">
                                <div className="log-main">
                                    <div className="log-title success">Password reset successful</div>
                                    <div className="log-meta">User: alex.l@stateu.edu</div>
                                </div>
                                <div className="log-time">1h ago</div>
                            </div>
                            <div className="log-item">
                                <div className="log-main">
                                    <div className="log-title info">New 2FA device registered</div>
                                    <div className="log-meta">User: david.m@roomieconnect.com</div>
                                </div>
                                <div className="log-time">3h ago</div>
                            </div>
                        </div>
                    </div>

                    <div className="dashboard-card">
                        <div className="card-header-row">
                            <h3><span className="icon-clock">⏳</span> Recent Activity</h3>
                            <a href="#" className="view-all-link">View All</a>
                        </div>
                        <div className="log-list">
                            <div className="log-item">
                                <div className="log-main">
                                    <div className="log-title">New user registration</div>
                                    <div className="log-meta">Marcus Chen completed profile setup.</div>
                                </div>
                                <div className="log-time">15m ago</div>
                            </div>
                            <div className="log-item">
                                <div className="log-main">
                                    <div className="log-title">Listing updated</div>
                                    <div className="log-meta">System admin updated global terms of service.</div>
                                </div>
                                <div className="log-time">2h ago</div>
                            </div>
                            <div className="log-item">
                                <div className="log-main">
                                    <div className="log-title">User reported</div>
                                    <div className="log-meta">Alex Lee flagged for inappropriate content.</div>
                                </div>
                                <div className="log-time">4h ago</div>
                            </div>
                        </div>
                    </div>

            </div>
        </div>
            </div>
            </div>
    );
}

export default AdminUsers;