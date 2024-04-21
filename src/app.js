// app.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const recipeRoutes = require("./routes/recipeRoutes");

const app = express();
const testimonialRoutes = require("./routes/testimonialRoutes");


app.use(helmet());

const allowedOrigins = [
  "http://localhost:5500", // Your current frontend
  "http://localhost:3001", // Another client application
  "http://localhost:3000",
  "http://127.0.0.1:5500",
  "https://sandrine-coupart-site-ac27d881da5c.herokuapp.com/", // Production environment
  // Add more as needed
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // Allow the request if the origin is in the allowedOrigins list
      } else {
        callback(new Error("CORS not allowed from this origin"), false); // Block the request if not in the list
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

app.use(express.json());

app.use(cookieParser());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);
app.use(morgan("combined"));

app.use("/api/auth", authRoutes);
// app.use("/api/recipes", recipeRoutes);
app.use("/api", testimonialRoutes);


app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "HTML", "index.html"));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
