import '../stylesheets/AdminDashboard.css';
import AdminNavbar from '../components/AdminNavbar';
import ProfileSettingsModal from '../components/ProfileSettingsModal';
import { useState } from 'react';

function AdminDashboard() {

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        <>
        <AdminNavbar onOpenSettings={() => setIsSettingsOpen(true)} />
            {isSettingsOpen && <ProfileSettingsModal onClose={() => setIsSettingsOpen(false)} />}
        </>
    );
}

export default AdminDashboard;