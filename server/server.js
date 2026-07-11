require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const mongoose = require('mongoose')
const authRoutes = require('./routes/authRoutes');
const listingRoutes = require('./routes/listingRoutes.js');
const uploadRoutes = require('./routes/uploadRoutes.js');
const path = require("path");
connectDB();

const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json());




app.use('/api/upload', uploadRoutes);
app.use('/api/listing', listingRoutes);
app.use('/api/auth', authRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
