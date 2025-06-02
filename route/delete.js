const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { isAuth } = require("../middleware/auth");
const { db } = require("../config/database");
const { QueryTypes } = require("sequelize");
const bcrypt = require("bcrypt");

router.post("/delete", [isAuth], async (req, res) => {
  try {
    const { email, password } = req.body;

    // Step 1: Find user by email
    const [user] = await db.query(
      "SELECT * FROM users WHERE email = :email",
      {
        replacements: { email },
        type: QueryTypes.SELECT,
      }
    );

    if (!user) {
      return res.status(404).json({
        status: "Failed",
        message: "Email not found or already deleted",
      });
    }

    // Step 2: Compare hashed passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: "Failed",
        message: "Incorrect password",
      });
    }

    // Step 3: Delete the user
    const result = await db.query(
      "DELETE FROM users WHERE email = :email",
      {
        replacements: { email },
        type: QueryTypes.DELETE,
      }
    );

    return res.status(200).json({
      status: "Success",
      message: "User has been deleted successfully",
    });
  } catch (error) {
    console.error("Caught error in /delete:", error);
    return res.status(500).json({
      status: "Failed",
      message: "Something went wrong during deletion",
    });
  }
});

module.exports = router;
