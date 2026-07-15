import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuthContext } from './hook/useAuthContext';
import GroupProfile from './pages/GroupProfile';
import CreateGroup from './pages/CreateGroup';


import Login from './pages/Login';
import SignUp from './pages/SignUp';
import LogInAdmin from './pages/Login-Admin';

import { AdminThemeProvider } from './context/AdminThemeContext';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminListings from './pages/AdminListings';
import AdminModerations from './pages/AdminModerations';

import ManagerDashboard from './pages/Manager-Dashboard';
import ManagerListing from './pages/Manager-Listing';
import ManagerNotif from './pages/Manager-Notif';
import ManagerCreate from './pages/Manager-Create.jsx';
import ManagerViewListing from './pages/Manager-View-Listing.jsx';
import ManagerCallingCard from './pages/Manager-Calling-Card.jsx';
import ManagerEdit from './pages/Manager-Edit.jsx';
import ListingDetail from './pages/Listing-Detail.jsx';
import SharedSpaces from './pages/Shared-Spaces.jsx';
import SharedSpaceDetail from './pages/Shared-Space-Detail.jsx';

import 'leaflet/dist/leaflet.css';

import DiscoverCommunities from './pages/DiscoverCommunities';

function AppRoutes() {
  const { user, isReady } = useAuthContext();
  const navigate = useNavigate();

  if (!isReady) {
    return null; 
  }

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login-admin" element={<LogInAdmin />} />

      <Route path="/admin-dashboard" element={user && user.role === 'admin' ? <AdminThemeProvider><AdminDashboard /></AdminThemeProvider> : <Navigate to="/" />} />
      <Route path="/admin-users" element={user && user.role === 'admin' ? <AdminThemeProvider><AdminUsers /></AdminThemeProvider> : <Navigate to="/" />} />
      <Route path="/admin-listings" element={user && user.role === 'admin' ? <AdminThemeProvider><AdminListings /></AdminThemeProvider> : <Navigate to="/" />} />
      <Route path="/admin-moderations" element={user && user.role === 'admin' ? <AdminThemeProvider><AdminModerations /></AdminThemeProvider> : <Navigate to="/" />} />

      <Route path="/manager-edit/:id" element={user && user.role === 'manager' ? <ManagerEdit /> : <Navigate to="/" />} />
      <Route path="/manager-dashboard" element={user && user.role === 'manager' ? <ManagerDashboard /> : <Navigate to="/" />} />
      <Route path="/manager-calling-card" element={user && user.role === 'manager' ? <ManagerCallingCard /> : <Navigate to="/" />} />
      <Route path="/manager-create" element={user && user.role === 'manager' ? <ManagerCreate /> : <Navigate to="/" />} />
      <Route path="/manager-listings" element={user && user.role === 'manager' ? <ManagerListing /> : <Navigate to="/" />} />
      <Route path="/manager-notifications" element={user && user.role === 'manager' ? <ManagerNotif /> : <Navigate to="/" />} />
      <Route path="/manager-view-listing/:id" element={user && user.role === 'manager' ? <ManagerViewListing /> : <Navigate to="/" />} />

      <Route path="/student-group-profile/:id" element={user && user.role === 'student' ? <GroupProfile /> : <Navigate to="/" />} />

      {/* single definition — onSuccess wired to redirect back to Discover Communities */}
      <Route
        path="/student-create-group"
        element={
          user && user.role === 'student'
            ? <CreateGroup onSuccess={() => navigate('/student-discover-communities')} />
            : <Navigate to="/" />
        }
      />

      <Route path="/student-discover-communities" element={user && user.role === 'student' ? <DiscoverCommunities /> : <Navigate to="/" />} />
        <Route path="/student-shared-spaces" element={user && user.role === 'student' ? <SharedSpaces /> : <Navigate to="/" />} />
        <Route path="/student-shared-spaces/:id" element={user && user.role === 'student' ? <SharedSpaceDetail /> : <Navigate to="/" />} />
      <Route path="/listings/:id" element={user ? <ListingDetail /> : <Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
