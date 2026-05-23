const express = require("express");
const app = express();
const cors = require("cors");
const designRoutes = require("./routers/design.routes");

const allowedOrigins = [
  // Correct origin without the trailing slash
  "http://localhost:5173",
  // ... other allowed origins
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // If you need to send cookies/auth headers
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/designs", designRoutes);

module.exports = app;
