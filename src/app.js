require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const testimonialRoutes = require("./routes/testimonialRoutes");

const app = express();

// Middleware to enable CORS and parse JSON
app.use(cors());
app.use(express.json());

// Routing for API endpoints
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use("/api/testimonials", testimonialRoutes);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Optional: Serve the index.html file at the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'HTML', 'index.html'));
});

// Server port configuration
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
