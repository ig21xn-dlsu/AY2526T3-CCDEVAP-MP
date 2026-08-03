import { useState } from 'react';
import { useAdminCreateUser } from '../hook/useAdminCreateUser';
import '../stylesheets/AdminCreateUserModal.css'; 

const initialFormState = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
};

function AdminCreateUserModal({ show, onClose, onUserCreated }) {
    const [formData, setFormData] = useState(initialFormState);
    const [successMessage, setSuccessMessage] = useState('');
    const { createUser, isLoading, error } = useAdminCreateUser();

    if (!show) return null; // Native way to hide the modal

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');

        const success = await createUser(
            formData.lastName,
            formData.firstName,
            formData.email,
            formData.password,
            formData.confirmPassword,
            formData.role
        );

        if (success) {
            setSuccessMessage('User created successfully!');
            setFormData(initialFormState);
            onUserCreated();

            setTimeout(() => {
                setSuccessMessage('');
                onClose();
            }, 1500);
        }
    };

    const handleClose = () => {
        setFormData(initialFormState);
        setSuccessMessage('');
        onClose();
    };

    return (
        <div className="admin-create-overlay">
            <div className="admin-create-modal">
                
                <div className="admin-create-header">
                    <h3>Add New User</h3>
                    <button className="admin-create-close" onClick={handleClose}>
                        &times;
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="admin-create-body">
                        {successMessage && <div className="admin-alert admin-alert-success">{successMessage}</div>}
                        {error && <div className="admin-alert admin-alert-danger">{error}</div>}

                        <div className="admin-create-group">
                            <label>First Name</label>
                            <input
                                className="admin-create-input"
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="admin-create-group">
                            <label>Last Name</label>
                            <input
                                className="admin-create-input"
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="admin-create-group">
                            <label>Email</label>
                            <input
                                className="admin-create-input"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="admin-create-group">
                            <label>Role</label>
                            <select 
                                className="admin-create-select" 
                                name="role" 
                                value={formData.role} 
                                onChange={handleChange}
                            >
                                <option value="student">Student</option>
                                <option value="manager">Property Owner</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <div className="admin-create-group">
                            <label>Password</label>
                            <input
                                className="admin-create-input"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="admin-create-group">
                            <label>Confirm Password</label>
                            <input
                                className="admin-create-input"
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="admin-create-footer">
                        <button 
                            type="button" 
                            className="admin-btn admin-btn-cancel" 
                            onClick={handleClose} 
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="admin-btn admin-btn-submit" 
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating...' : 'Create User'}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}

export default AdminCreateUserModal;