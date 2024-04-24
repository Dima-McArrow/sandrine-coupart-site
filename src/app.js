// app.js
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
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
const messageRoutes = require("./routes/messageRoutes");

app.set("trust proxy", 1);

/* app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "default-src": ["'self'"],
        "script-src": ["'self'", "'unsafe-inline'"],
        "img-src": [
          "'self'",
          "data:",
          "https://sandrine-coupart-site.s3.eu-west-3.amazonaws.com",
        ],
      },
    },
  })
); */

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"], // adjust if you have specific external scripts
        styleSrc: ["'self'", "'unsafe-inline'"], // adjust accordingly
        imgSrc: [
          "'self'",
          "data:",
          "https://sandrine-coupart-site.s3.eu-west-3.amazonaws.com",
          "http://localhost:5500",
        ], // allow images from these sources
        connectSrc: ["'self'", "http://localhost:3000"], // ensure API requests are allowed
      },
    },
  })
);

const allowedOrigins = [
  "http://localhost:5500",
  "http://localhost:3001",
  "http://localhost:3000",
  "http://127.0.0.1:5500",
  "https://sandrine-coupart-site-b014ac181df6.herokuapp.com", // Production environment
];

app.use(
  cors({
    origin: function (origin, callback) {
      console.log("Received origin:", origin);
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("Blocked origin:", origin); // Log blocked origin for debugging
        callback(new Error("CORS not allowed from this origin"), false);
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
app.use(express.urlencoded({ extended: true }));
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
app.use("/api", recipeRoutes);
app.use("/api", testimonialRoutes);
app.use("/api/messages", messageRoutes);

// After all other routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "HTML", "index.html"));
});
app.get("*.html", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "HTML", req.path));
});

app.use(express.static(path.join(__dirname, "..", "public")));

app.use((err, req, res, next) => {
  console.log(`req meth, req url: ${req.method} ${req.url}`);
  next();
  console.error("Error status:", err.status);
  console.error("Error message:", err.message);
  console.error("Error stack:", err.stack);
  res.status(err.status || 500).send("Something went wrong!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
