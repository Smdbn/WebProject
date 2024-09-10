const express = require("express");
const router = express.Router();
const db = require("../db"); // Adjust path as needed

// Route to get all categories
router.get("/", (req, res) => {
  const sql = "SELECT * FROM categories";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching categories:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(results);
    }
  });
});

module.exports = router;
