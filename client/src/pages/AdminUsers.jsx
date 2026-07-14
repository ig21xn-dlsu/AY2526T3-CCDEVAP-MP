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

        </div>
            </div>
            </div>
    );
}

export default AdminUsers;