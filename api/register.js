const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const db = require("../db"); // Adjust path as needed

router.post("/", async (req, res) => {
  const { email, username, password, confirmPassword } = req.body;

  if (!email || !username || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql =
      "INSERT INTO users (email, username, password, createdAt) VALUES (?, ?, ?, ?)";
    const values = [email, username, hashedPassword, new Date()];

    db.query(sql, values, (err, results) => {
      if (err) {
        console.error("Error inserting user:", err.message);
        return res.status(500).json({ message: "Internal Server Error" });
      }
      res.status(201).json({ message: "User registered successfully" });
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
