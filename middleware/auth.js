const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
require("dotenv").config();

//middleware testing
module.exports.isAuth = async (req, res, next) => {
  try {
    const token = req.headers["x-csrf"];
    jwt.verify(
      token,
      `${process.env.JWT_SECRET_KEY}`,
      async function (error, decode) {
        if (error) {
          return res.status(401).json({
            status: "Failed",
            message: "Error authenticating in middleware/auth.js",
          });
        }
        req.mail=decode.email;
      }
    );
    
    next();
  } catch (err) {
    console.log("Error", err);
    return res.status(500).json({
      status: "Failed to load",
      error: "Middleware is not working properly",
      message: err,
    });
  }
};
