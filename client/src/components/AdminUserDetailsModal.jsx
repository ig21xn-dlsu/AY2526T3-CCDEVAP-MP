import { Modal, Button, Badge } from 'react-bootstrap';
import '../stylesheets/AdminUserDetailsModal.css';

function UserDetailsModal({ user, show, onClose, onStatusChange }) {
    if (!user) return null;

    const isSuspended = user.status === 'suspended';

    const handleToggleStatus = () => {
        const newStatus = isSuspended ? 'active' : 'suspended';
        onStatusChange(user._id, newStatus);
    };

    return (
        <Modal show={show} onHide={onClose} centered className="admin-user-modal">
            <Modal.Header closeButton>
                <Modal.Title>User Details</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p><strong>First Name:</strong> {user.firstName}</p>
                <p><strong>Last Name:</strong> {user.lastName}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
                <p>
                    <strong>Status:</strong>{' '}
                    <Badge bg={isSuspended ? 'danger' : 'success'}>
                        {isSuspended ? 'Suspended' : 'Active'}
                    </Badge>
                </p>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
                <Button
                    variant={isSuspended ? 'success' : 'danger'}
                    onClick={handleToggleStatus}
                >
                    {isSuspended ? 'Reactivate User' : 'Ban User'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default UserDetailsModal;