const express = require("express");
const router = express.Router();
const db = require("../db"); // Adjust path as needed

// Get all expenses for a user
router.get("/", (req, res) => {
  if (!req.session.user || !req.session.user.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const userId = req.session.user.id;
  const sql = "SELECT * FROM expenses WHERE userId = ?";
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching expenses:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json(results);
  });
});

// Get a single expense by ID
router.get("/:id", (req, res) => {
  const expenseId = req.params.id;
  if (!req.session.user || !req.session.user.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const userId = req.session.user.id;
  const sql = "SELECT * FROM expenses WHERE id = ? AND userId = ?";
  db.query(sql, [expenseId, userId], (err, results) => {
    if (err) {
      console.error("Error fetching expense:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.json(results[0]);
  });
});

// Add an expense
router.post("/", (req, res) => {
  if (!req.session.user || !req.session.user.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { category, amount } = req.body;
  if (!category || !amount) {
    return res.status(400).json({ error: "Category and amount are required" });
  }

  const userId = req.session.user.id;
  const sql =
    "INSERT INTO expenses (userId, category, amount) VALUES (?, ?, ?)";
  db.query(sql, [userId, category, amount], (err, result) => {
    if (err) {
      console.error("Error adding expense:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res
      .status(201)
      .json({ message: "Expense added successfully", id: result.insertId });
  });
});

// Update an expense by ID
router.put("/:id", (req, res) => {
  if (!req.session.user || !req.session.user.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const expenseId = req.params.id;
  const { category, amount } = req.body;
  if (!category || !amount) {
    return res.status(400).json({ error: "Category and amount are required" });
  }

  const userId = req.session.user.id;
  const sql =
    "UPDATE expenses SET category = ?, amount = ? WHERE id = ? AND userId = ?";
  db.query(sql, [category, amount, expenseId, userId], (err, result) => {
    if (err) {
      console.error("Error updating expense:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.json({ message: "Expense updated successfully" });
  });
});

// Delete an expense by ID
router.delete("/:id", (req, res) => {
  if (!req.session.user || !req.session.user.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const expenseId = req.params.id;
  const userId = req.session.user.id;
  const sql = "DELETE FROM expenses WHERE id = ? AND userId = ?";
  db.query(sql, [expenseId, userId], (err, result) => {
    if (err) {
      console.error("Error deleting expense:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.json({ message: "Expense deleted successfully" });
  });
});

module.exports = router;
