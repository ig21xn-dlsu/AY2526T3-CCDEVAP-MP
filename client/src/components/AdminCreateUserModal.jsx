import { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { useSignup } from '../hook/useSignUp';
import { useAdminTheme } from '../context/AdminThemeContext';
import '../stylesheets/AdminUserDetailsModal.css'; 

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
    const { signup, isLoading, error } = useSignup();
    
    const { isDark } = useAdminTheme();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');

        const success = await signup(
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
        <Modal 
            show={show} 
            onHide={handleClose} 
            centered
            data-bs-theme={isDark ? 'dark' : 'light'}
            contentClassName={isDark ? 'admin-modal-dark' : 'admin-modal-light'}
        >
            <Modal.Header closeButton>
                <Modal.Title>Add New User</Modal.Title>
            </Modal.Header>

            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {successMessage && <Alert variant="success">{successMessage}</Alert>}
                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form.Group className="mb-3">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Role</Form.Label>
                        <Form.Select name="role" value={formData.role} onChange={handleChange}>
                            <option value="student">Student</option>
                            <option value="manager">Property Owner</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                </Modal.Body>

                <Modal.Footer>
                    {/* 4. Fix the cancel button so it isn't a black box in dark mode */}
                    <Button 
                        variant={isDark ? "outline-light" : "secondary"} 
                        onClick={handleClose} 
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" disabled={isLoading}>
                        {isLoading ? 'Creating...' : 'Create User'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default AdminCreateUserModal;