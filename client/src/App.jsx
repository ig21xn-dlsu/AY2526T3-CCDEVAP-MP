import Login from './pages/Login';
import SignUp from './pages/SignUp';
import LogInAdmin from './pages/Login-Admin';

import AdminDashboard from './pages/AdminDashboard';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login-admin" element={<LogInAdmin />} />
        
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App