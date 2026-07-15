import '../stylesheets/AdminUsers.css';
import AdminNavbar from '../components/AdminNavbar';
import ProfileSettingsModal from '../components/ProfileSettingsModal';
import UserDetailsModal from '../components/AdminUserDetailsModal';
import { useState, useEffect } from 'react';
import { fetchUsers, updateUserStatus, getCSVExportUrl } from '../api/adminUsers';

function AdminUsers() {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');      
    const [debouncedSearch, setDebouncedSearch] = useState(''); 

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const limit = 10;

    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1); 
        }, 400);

        return () => clearTimeout(timer); 
    }, [searchTerm]);

    useEffect(() => {
        let isMounted = true;

        const loadUsers = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await fetchUsers(currentPage, limit, debouncedSearch);

                if (isMounted) {
                    setUsers(data.users);
                    setTotalPages(data.totalPages);
                    setTotalUsers(data.totalUsers);
                }
            } catch (err) {
                if (isMounted) {
                    console.error('Error fetching users:', err);
                    setError('Failed to load users');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadUsers();

        return () => {
            isMounted = false;
        };
    }, [currentPage, debouncedSearch]);

    const handleOpenModal = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    const handleStatusChange = async (userId, newStatus) => {
        try {
            await updateUserStatus(userId, newStatus);

            setUsers((prevUsers) =>
                prevUsers.map((u) => (u._id === userId ? { ...u, status: newStatus } : u))
            );

            handleCloseModal();
        } catch (err) {
            console.error('Error updating user status:', err);
            alert('Failed to update user status. Please try again.');
        }
    };

    const getInitials = (firstName, lastName) => {
        return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();
    };

    const formatRole = (role) => {
        if (role === 'manager') return 'Property Owner';
        if (role === 'student') return 'Student';
        return role;
    };

    const startIndex = (currentPage - 1) * limit + 1;
    const endIndex = Math.min(currentPage * limit, totalUsers);

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
                        <input
                            type="text"
                            placeholder="Search users by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>USER</th>
                                    <th>ROLE</th>
                                    <th>STATUS</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>

                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', padding: '24px' }}>
                                            Loading users...
                                        </td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', padding: '24px', color: '#e11d48' }}>
                                            {error}
                                        </td>
                                    </tr>
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', padding: '24px' }}>
                                            No users found.
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user._id}>
                                            <td>
                                                <div className="user-cell">
                                                    <div className="avatar-placeholder">
                                                        {getInitials(user.firstName, user.lastName)}
                                                    </div>
                                                    <div>
                                                        <div className="user-name">
                                                            {user.firstName} {user.lastName}
                                                        </div>
                                                        <div className="user-email">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{formatRole(user.role)}</td>
                                            <td>
                                                <span className={`status-pill ${user.status === 'suspended' ? 'suspended' : 'active'}`}>
                                                    {user.status === 'suspended' ? 'Suspended' : 'Active'}
                                                </span>
                                            </td>
                                            <td>
                                                {/* FIXED: Added missing <a tag */}
                                                <a 
                                                    href="#"
                                                    className="edit-btn"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleOpenModal(user);
                                                    }}
                                                >
                                                    Edit
                                                </a>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>

                            <tfoot>
                                <tr>
                                    <td colSpan="5">
                                        <div className="table-footer">
                                            <div className="csv-download-box">
                                                <a href={getCSVExportUrl()} className="download-csv">
                                                    <img src="assets/downloadIcon.svg" alt="" className="btn-icon" />
                                                    Download CSV
                                                </a>
                                            </div>
                                            <div className="pagination-wrapper">
                                                <span className="footer-status">
                                                    {totalUsers === 0
                                                        ? 'No users'
                                                        : `Showing ${startIndex}-${endIndex} of ${totalUsers}`}
                                                </span>
                                                <ul className="pagination">
                                                    <li>
                                                        {/* FIXED: Added missing <a tag */}
                                                        <a 
                                                            href="#"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                if (currentPage > 1) setCurrentPage((p) => p - 1);
                                                            }}
                                                            style={{ opacity: currentPage === 1 ? 0.4 : 1 }}
                                                        >
                                                            &#8592;
                                                        </a>
                                                    </li>
                                                    <li>
                                                        {/* FIXED: Added missing <a tag */}
                                                        <a 
                                                            href="#"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                if (currentPage < totalPages) setCurrentPage((p) => p + 1);
                                                            }}
                                                            style={{ opacity: currentPage === totalPages ? 0.4 : 1 }}
                                                        >
                                                            &#8594;
                                                        </a>
                                                    </li>
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

            <UserDetailsModal
                user={selectedUser}
                show={isModalOpen}
                onClose={handleCloseModal}
                onStatusChange={handleStatusChange}
            />
        </div>
    );
}

export default AdminUsers;