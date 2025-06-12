// const user = require("../db/models/user");
const bcrypt = require("bcrypt");
let Validator = require("validatorjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { db } = require("../config/database");
const fs = require("fs");
const auth = require("../middleware/auth");
const { QueryTypes } = require("sequelize");
const express = require("express");
const { escapeLiteral } = require("pg");
const moment = require("moment");
const router = express.Router();
const nodemailer = require("nodemailer");
const {seendmail} = require("../middleware/smtpNodemailera")
const upload = require("../config/multerconfig");
const { Server, Socket } = require("socket.io");
const { createServer } = require("node:http");
const app = express();
const server = createServer(app);
const io = new Server(server);
const rsa = require("node-rsa");
const private_key = fs. readFileSync("./key/private.pem", "utf8");


//makeing the Privet Key
// const key = new NodeRSA ({ b : 1024 });//Combo of public key and private Key
// let secret = "This is the Secret";
// var encryptString = key.encrypt(secret, "base64");

// node RSA start
const payload = {};
payload.UserName = "Gatik";
payload.userID = "11223344";

// const issueto = "GatikSharma";
// const sub = "gatikwrking@gmail.com";
// const exp = "99h";

router.post("/signUp", [upload.single("file")], async (req, res) => {
  try {
    const body = req.body;
    let password = await bcrypt.hash(body.password, 10);
    const validators = new Validator(req.body, {
      firstName: "required",
      password: "required",
    });

    //validation for if failed or not #(Encrypted Password)
    if (validators.fails()) {
      return res.status(500).json({
        success: false,
        message: "First name and last name is required",
      });
    }

    if (body.userType !== "1" && body.userType !== "2") {
      return res.status(400).json({
        status: "fail",
        messgae: "Invalaid User login failed",
      });
    }
    //search query
    const search = await db.query(
      "SELECT email from users WHERE email = :email ",
      {
        replacements: {
          email: body.email,
        },
        type: db.QueryTypes.SELECT,
      }
    );

    if (search.length > 0) {
      return res.status(500).json({
        status: "Failed not good",
        message: "email exist",
      });
    }

    const newUser = await db.query(
      `INSERT INTO users("userType", "firstName" , "lastName" , email , password , "createdAt") VALUES (:userType , :firstName , :lastName , :email , :password ,:date)`,
      {
        replacements: {
          userType: body.userType,
          firstName: body.firstName,
          lastName: body.lastName,
          email: body.email,
          password: password,
          date: moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss"),
        },

        type: db.QueryTypes.SELECT,
      }
    );

    if (!newUser) {
      return res.status(400).json({
        status: "failed",
        messgae: "failed to Create new user",
      });
    }
    return res.status(201).json({
      status: "success",
      data: "Users entered Successfully",
    });
  } catch (err) {
    console.log("error", err);
    return res.status(400).json({
      status: "Failed",
      message: "signUp is not working ",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // 1. Initial check for missing email/password from request
    if (!email || !password) {
      return res.status(400).json({
        status: "Failed", // Consistent status naming
        message: "Email and password are required",
      });
    }


    let userRecord; // Renamed 'result' to 'userRecord' for clarity

    const queryResult = await db.query(
      `SELECT id, email, password, ammountoftry FROM users WHERE email = :email`, // Select id too for token generation
      {
        replacements: { email: email },
        type: QueryTypes.SELECT,
      }
    );

    if (!queryResult) {
      return res.status(400).json({
        status: "Failed",
        messgae: "record not found",
      });
    }
    // Assign the first (and only) user record to userRecord
    userRecord = queryResult[0];

    //console.log("--------------------------------------------------------------------------------------------------------",userRecord.password)

    // 4. Validate the fetched user record's password field
    if (!userRecord.password || typeof userRecord.password !== "string") {
      // This case indicates an issue with the stored data
      console.error(
        `User ${userRecord.email} has an invalid or missing hashed password.`
      );
      return res.status(500).json({
        status: "failed",
        message: "Server error: Invalid user data.",
      });
    }
    const queryResultforblock = await db.query(
      "SELECT ammountoftry FROM users WHERE email = :email",
      {
        replacements: { email: email },
        type: QueryTypes.SELECT,
      }
    );
    console.log(queryResultforblock);

    // if (queryResultforblock[0].ammountoftry > 3) {
    //   return res.status(401).json({
    //     status: "you are blocked",
    //     message: "you dont have access of your account",
    //   });
    // }
      if (queryResultforblock[0].ammountoftry > 3) {
        seendmail()
        return res.status(401).json({
          status: "you are blocked",
          message:
            "you dont have access of your account we have also sent you confirmation mail that your account have been blocked",
        });
      } else {
        res.status(400).json({
          status: "Failed",
          message: "Email or password is incorrect you have limited tryes",
        });
      }
    // 5. Comparing the plaintext password with the hashed password using bcrypt (Promise-based)
    const isMatch = await bcrypt.compare(password, queryResult[0].password);

    if (isMatch) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY, {
        expiresIn: "40d",
      });

      console.log("Token",token);
      const public = fs.readFileSync("./key/public.pem", "utf8");
      
      const publicKey = new rsa();
      publicKey.importKey(public);

      const encryptToken = publicKey.encrypt(token, "base64");

      console.log("Encrypted token", encryptToken);

      return res.status(200).json({
        status: "success",
        message: "Welcome to the website",
        encryptToken,
      });
    } else {
      const tryincriment = queryResult[0].ammountoftry + 1;
      await db.query(
        `UPDATE users SET ammountoftry = :try WHERE email = :email`,
        {
          replacements: {
            try: tryincriment,
            email: email,
            type: QueryTypes.UPDATE,
          },
        }
      );
      //Needs Work Make it a MiddleWare
    }
  } catch (err) {
    console.log("error", err);
    return;
  }
});

module.exports = router;
