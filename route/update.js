const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
let Validator = require("validatorjs");
require("dotenv").config();
const auth = require("../middleware/auth");
const { db } = require("../config/database");

router.post("/update", [auth.isAuth], async (req, res) => {
  const { firstName, lastName } = req.body;

  try {
    console.log("Req.body",req.body);
    // 1. Check if email exists
    const searchemail = await db.query(
      "SELECT email , ammountoftry FROM users WHERE email = :email",
      {
        replacements: { email: req.mail },
        type: db.QueryTypes.SELECT,
      }
    );

    if (searchemail.length === 0) {
      console.log("Email not found:", email);
      return res.status(404).json({
        status: "Failed",
        message: "Email not found",
      });
    }

    //1.5. Checking if the user is blocked
    if (searchemail[0].ammountoftry > 3) {
      return res.status(400).json({
        status: "you are blocked",
        message: "you dont have access of your account😥😥😥😭😭😭",
      });
    }

    console.log(firstName)
    // 2. Perform the update
    const updateing = await db.query(
      `UPDATE users SET "firstName" = :firstName, "lastName" = :lastName WHERE email = :email`,
      {
        replacements: { firstName, lastName, email:req.mail },
        type: db.QueryTypes.UPDATE, // Correct type`
      }
    );

    if (updateing) {
      // 3. Send success response
      return res.status(200).json({
        status: "success",
        message: "Updated successfully",
      });
    } else {
      res.status(400).json({
        status: "failed",
        message: "failed to update in database😥😥😥😭😭😭",
      });
    }
  } catch (error) {
    console.error("Caught error in /update:", error);

    // Prevent sending headers twice

    return res.status(500).json({
      status: "Failed",
      message: "Something went wrong during update",
      error: error,
    });
  }
});

module.exports = router;
