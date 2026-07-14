import '../stylesheets/AdminDashboard.css';
import AdminNavbar from '../components/AdminNavbar';
import ProfileSettingsModal from '../components/ProfileSettingsModal';
import { useState, useEffect } from 'react';

import { fetchTotalUsers, fetchTotalListings, fetchTotalGroups, fetchTotalReports } from '../api/adminDashboard';

function AdminDashboard() {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const [totalUsers, setTotalUsers] = useState(0);
    const [totalListings, setTotalListings] = useState(0);
    const [totalGroups, setTotalGroups] = useState(0);
    const [totalReports, setTotalReports] = useState(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadDashboardData = async () => {
            setLoading(true);
            setError(null);
            
            try {
                // Promise.all runs all these fetches in parallel at the same time.
                const [usersData, listingsData, groupsData, reportsData] = await Promise.all([
                    fetchTotalUsers(),
                    fetchTotalListings(),
                    fetchTotalGroups(),
                    fetchTotalReports()
                ]);

                // Once ALL promises resolve, update the states
                setTotalUsers(usersData.totalUsers);
                setTotalListings(listingsData.totalListings);
                setTotalGroups(groupsData.totalGroups);
                setTotalReports(reportsData.totalReports);
                
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError('Failed to load');
            } finally {
                // Loading is only set to false once everything is completely finished
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []); 

    return (
        <div id="dashboard-wrapper">
            <AdminNavbar onOpenSettings={() => setIsSettingsOpen(true)} />
            {isSettingsOpen && <ProfileSettingsModal onClose={() => setIsSettingsOpen(false)} />}
            
            <section id="admin-dashboard">
                <section id="page-heading">System Overview</section>
                <section className="dashboard-row">
                    
                    <div className="analytics-box">
                        <div className="analytics-title">
                            Total Users
                            {/* SVG omitted for brevity, keep your existing SVG here */}
                        </div>
                        <div className="analytics-number">{loading ? '...' : error ? '—' : totalUsers}</div>
                    </div>

                    <div className="analytics-box">
                        <div className="analytics-title">
                            Active Listings
                            {/* SVG omitted for brevity, keep your existing SVG here */}
                        </div>
                        <div className="analytics-number">{loading ? '...' : error ? '—' : totalListings}</div>
                    </div>

                    <div className="analytics-box">
                        <div className="analytics-title">
                            Active Groups
                            {/* SVG omitted for brevity, keep your existing SVG here */}
                        </div>
                        <div className="analytics-number">{loading ? '...' : error ? '—' : totalGroups}</div>
                    </div>

                    <div className="analytics-box">
                        <div className="analytics-title">
                            Pending Flags
                            {/* SVG omitted for brevity, keep your existing SVG here */}
                        </div>
                        {/* Note: Fixed a minor typo here where you had a nested div with the same class */}
                        <div className="analytics-number">{loading ? '...' : error ? '—' : totalReports}</div>
                    </div>
                </section>

                <section className="dashboard-row trends">
                    {/* The rest of your JSX remains exactly the same */}
                    <div className="dashboard-card card-large">
                        <div className="card-title">Growth Trends</div>
                        <div className="chart-placeholder">
                            <div className="chart-label">Chart Visualization Area</div>
                            <div className="chart-wave"></div>
                        </div>
                    </div>

                    <div className="dashboard-card card-small">
                        <div className="card-title">Recent Activity</div>
                        <div className="activity-list">
                            <div className="activity-item">
                                <div className="activity-icon icon-blue">👤</div>
                                <div className="activity-text">
                                    <div><strong>Sarah J.</strong> created a new account.</div>
                                    <div className="activity-time">2 mins ago</div>
                                </div>
                            </div>
                            <div className="activity-item">
                                <div className="activity-icon icon-orange">🏠</div>
                                <div className="activity-text">
                                    <div>New listing published in Austin, TX.</div>
                                    <div className="activity-time">15 mins ago</div>
                                </div>
                            </div>
                            <div className="activity-item">
                                <div className="activity-icon icon-red">❗</div>
                                <div className="activity-text">
                                    <div>User @mike99 was flagged for spam.</div>
                                    <div className="activity-time">1 hr ago</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="dashboard-row">
                    <div className="dashboard-card card-large">
                        <div className="card-header-row">
                            <div className="card-title">Pending Reviews</div>
                            <a href="#" className="view-all">View All</a>
                        </div>

                        <div className="table-header">
                            <div className="col-type">TYPE</div>
                            <div className="col-subject">SUBJECT</div>
                            <div className="col-date">SUBMITTED</div>
                            <div className="col-action">ACTION</div>
                        </div>

                        <div className="table-row">
                            <div className="col-type"><span className="badge">🏠 Listing</span></div>
                            <div className="col-subject">2BR Sublet in Downtown</div>
                            <div className="col-date">Today, 10:42 AM</div>
                            <div className="col-action"><a href="#" className="action-link">Review</a></div>
                        </div>
                        <div className="table-row">
                            <div className="col-type"><span className="badge">👤 Profile</span></div>
                            <div className="col-subject">Alex Rivera Identity Verify</div>
                            <div className="col-date">Yesterday, 4:15 PM</div>
                            <div className="col-action"><a href="#" className="action-link">Review</a></div>
                        </div>
                        <div className="table-row">
                            <div className="col-type"><span className="badge badge-red">❗ Report</span></div>
                            <div className="col-subject">Inappropriate Behavior</div>
                            <div className="col-date">Yesterday, 2:30 PM</div>
                            <div className="col-action"><a href="#" className="action-link link-red">Investigate</a></div>
                        </div>
                    </div>

                    <div className="dashboard-card card-small">
                        <div className="card-title">System Health</div>

                        <div className="health-item">
                            <div className="health-text"><span>API Latency</span><strong>124ms</strong></div>
                            <div className="progress-bg">
                                <div className="progress-fill fill-green" style={{ width: '20%' }}></div>
                            </div>
                        </div>

                        <div className="health-item">
                            <div className="health-text"><span>CPU Usage</span><strong>32%</strong></div>
                            <div className="progress-bg">
                                <div className="progress-fill fill-blue" style={{ width: '32%' }}></div>
                            </div>
                        </div>

                        <div className="health-item">
                            <div className="health-text"><span>Memory</span><strong>4.2GB / 8GB</strong></div>
                            <div className="progress-bg">
                                <div className="progress-fill fill-orange" style={{ width: '52%' }}></div>
                            </div>
                        </div>

                        <div className="health-item">
                            <div className="health-text"><span>Storage</span><strong>78%</strong></div>
                            <div className="progress-bg">
                                <div className="progress-fill fill-red" style={{ width: '78%' }}></div>
                            </div>
                        </div>
                    </div>
                </section>    
            </section>    
        </div>
    );
}

export default AdminDashboard;