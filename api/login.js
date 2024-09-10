const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const db = require("../db"); // Adjust path as needed

router.post("/", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Username and password are required!");
  }

  const sql = "SELECT * FROM users WHERE username = ?";
  db.query(sql, [username], async (err, results) => {
    if (err) {
      console.error("Error fetching users:", err.message);
      return res.status(500).send("Internal Server Error");
    }

    if (results.length > 0) {
      const user = results[0];

      const match = await bcrypt.compare(password, user.password);
      if (match) {
        req.session.user = { id: user.id, username: user.username };
        return res.redirect("/dashboard");
      }
    }

    return res.status(401).send("Invalid Username or Password!");
  });
});

module.exports = router;
