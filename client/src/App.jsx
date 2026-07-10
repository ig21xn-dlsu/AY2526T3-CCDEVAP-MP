import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './hook/useAuthContext';

import Login from './pages/Login';
import SignUp from './pages/SignUp';
import LogInAdmin from './pages/Login-Admin';

import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminListings from './pages/AdminListings';
import AdminModerations from './pages/AdminModerations';

import ManagerDashboard from './pages/Manager-Dashboard';
import ManagerListing from './pages/Manager-Listing';
import ManagerNotif from './pages/Manager-Notif';
import ManagerCreate from './pages/Manager-Create.jsx';

import 'leaflet/dist/leaflet.css';

import DiscoverCommunities from './pages/DiscoverCommunities';

function App() {

  const { user } = useAuthContext();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login-admin" element={<LogInAdmin />} />

        <Route path="/admin-dashboard" element={user && user.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
        <Route path="/admin-users" element={user && user.role === 'admin' ? <AdminUsers /> : <Navigate to="/" />} />
        <Route path="/admin-listings" element={user && user.role === 'admin' ? < AdminListings /> : <Navigate to="/" />} />
        <Route path="/admin-moderations" element={user && user.role === 'admin' ? < AdminModerations /> : <Navigate to="/" />} />

        <Route path="/manager-dashboard" element={user && user.role === 'manager' ? <ManagerDashboard /> : <Navigate to="/" />} />
        <Route path="/manager-create" element={user && user.role === 'manager' ? <ManagerCreate /> : <Navigate to="/" />} />
        <Route path="/manager-listings" element={user && user.role === 'manager' ? <ManagerListing /> : <Navigate to="/" />} />
        <Route path="/manager-notifications" element={user && user.role === 'manager' ? <ManagerNotif /> : <Navigate to="/" />} />

        <Route path="/student-discover-communities" element={user && user.role === 'student' ? <DiscoverCommunities /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
