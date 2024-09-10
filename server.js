// Import necessary modules
const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const session = require("express-session");

// Load environment variables from .env file
dotenv.config();

// Verify environment variables
const requiredEnvVars = [
  "DATABASE_HOST",
  "DATABASE_USER",
  "DATABASE_PASSWORD",
  "DATABASE",
];
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.error(`Missing environment variable: ${varName}`);
    process.exit(1);
  }
});

// Log environment variables for debugging
console.log("DATABASE_HOST:", process.env.DATABASE_HOST);
console.log("DATABASE_USER:", process.env.DATABASE_USER);
console.log("DATABASE_PASSWORD:", process.env.DATABASE_PASSWORD);
console.log("DATABASE:", process.env.DATABASE);

// Create an Express application
const app = express();
const port = 4000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse URL-encoded and JSON request bodies
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Configure session middleware
app.use(
  session({
    key: "session_cookie_name",
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
  })
);

// Create a MySQL connection using environment variables
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

// Connect to the MySQL database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database!", err.message);
  } else {
    console.log("Database connected successfully!");
  }
});

// Serve the home page as the landing page
app.get("/", (req, res) => {
  res.sendFile("home.html", { root: path.join(__dirname, "public") });
});

// Serve the login page
app.get("/login", (req, res) => {
  res.sendFile("login.html", { root: path.join(__dirname, "public") });
});

// Serve the registration page
app.get("/register", (req, res) => {
  res.sendFile("register.html", { root: path.join(__dirname, "public") });
});

// Serve the dashboard page
app.get("/dashboard", (req, res) => {
  if (req.session.user && req.session.user.id) {
    res.sendFile("dashboard.html", { root: path.join(__dirname, "public") });
  } else {
    res.redirect("/login");
  }
});

// API Routes
app.use('/api/register', require('./api/register'));
app.use('/api/login', require('./api/login'));
app.use('/api/users', require('./api/users'));
app.use('/api/expenses', require('./api/expenses'));
app.use('/api/categories', require('./api/categories'));

// Handle logout
app.post("/api/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error logging out:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json({ message: "Logged out successfully" });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
