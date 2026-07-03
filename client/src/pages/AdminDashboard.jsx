import '../stylesheets/AdminDashboard.css';
import AdminNavbar from '../components/AdminNavbar';
import { useState } from 'react';

function AdminDashboard() {

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        <>
        <AdminNavbar onOpenSettings={() => setIsSettingsOpen(true)} />
            {isSettingsOpen && <div>SETTINGS MODAL PLACEHOLDER</div>}
        </>
    );
}

export default AdminDashboard;