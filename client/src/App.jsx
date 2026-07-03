import Login from './pages/Login';
import SignUp from './pages/SignUp';
import LogInAdmin from './pages/Login-Admin';

import AdminDashboard from './pages/AdminDashboard';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminUsers from './pages/AdminUsers';
import AdminListings from './pages/AdminListings';
import AdminModerations from './pages/AdminModerations';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login-admin" element={<LogInAdmin />} />
        
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-users" element={<AdminUsers />} />
        <Route path="/admin-listings" element={< AdminListings />} />
        <Route path="/admin-moderations" element={< AdminModerations/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App