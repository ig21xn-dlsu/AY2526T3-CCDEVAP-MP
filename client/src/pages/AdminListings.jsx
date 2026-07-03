import '../stylesheets/AdminListings.css';
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

export default AdminListings;