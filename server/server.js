require('node:dns/promises').setServers(["1.1.1.1", "8.8.8.8"]);

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const mongoose = require('mongoose')
const authRoutes = require('./routes/authRoutes');
const listingRoutes = require('./routes/listingRoutes.js');
const uploadRoutes = require('./routes/uploadRoutes.js');
const callingCardRoutes = require('./routes/callingCardRoutes.js');
const inquiryRoutes = require('./routes/inquiryRoutes.js');
const reportRoutes = require('./routes/reportRoutes.js');
const sharedSpacesRoutes = require('./routes/sharedSpacesRoutes.js');

const adminDashboardRoutes = require('./routes/adminDashboardRoutes');
const adminUsersRoutes = require('./routes/adminUsersRoutes');
const adminListingRoutes = require('./routes/adminListingRoutes');

const statsRoutes = require('./routes/statRoutes.js');
const personalStatRoutes = require('./routes/personalStatsRoutes.js');

const groupsRoutes = require('./routes/groupsRoutes.js');

const path = require("path");
connectDB();

const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));


app.use(express.json());


app.use('/api/inquiries', inquiryRoutes);
app.use('/api/calling-card', callingCardRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/listing', listingRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/shared-spaces', sharedSpacesRoutes);
app.use('/api/admin/listing', adminListingRoutes);

// User authentication Routes
app.use('/api/auth', authRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Admin Related Routes
app.use('/api/dashboard', adminDashboardRoutes);
app.use('/api/admin/users', adminUsersRoutes);


app.use('/api/stats', statsRoutes);
app.use('/api/stats', personalStatRoutes);

app.use('/api/groups', groupsRoutes);


app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message || "Something went wrong." });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
