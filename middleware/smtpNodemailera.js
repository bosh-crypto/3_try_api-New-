// // Import necessary modules
// const express = require("express");
// const app = express(); // Correctly initialize the Express app
// require("dotenv").config(); // Load environment variables from .env file (still good practice for other variables)
// const nodemailer = require("nodemailer"); // Import Nodemailer for email sending

// // Middleware to parse JSON bodies in requests (if you'll be sending data via POST)
// app.use(express.json());

// // Create a Nodemailer transporter globally.
// // This transporter will use your Gmail credentials.
// // The password is now hardcoded directly.
// const transporter = nodemailer.createTransport({
//   secure: true, // Use SMTPS (secure connection)
//   host: "smtp.gmail.com", // Gmail's SMTP host
//   port: 465, // Standard port for SMTPS
//   auth: {
//     user: "gatikwrking@gmail.com", // Your Gmail address
//     // WARNING: Hardcoding password is NOT recommended for production environments.
//     // Replace "YOUR_HARDCODED_GMAIL_APP_PASSWORD_HERE" with your actual Gmail App Password.
//     pass: "nefysbwuonxlalws",
//   },
// });

// // /**
// //  * Middleware function to send an email.
// //  * This function expects to be used in an Express route.
// //  * @param {object} req - The Express request object.
// //  * @param {object} res - The Express response object.
// //  * @param {function} next - The callback function to pass control to the next middleware.
// //  */
// module.exports.seendmail = async (req, res, next) => {
//   try {
//     // Log that an email sending attempt is being made
//     console.log("Attempting to send email...");

//     // Send the email using the globally defined transporter.
//     // The 'to' address here is hardcoded. In a real application,
//     // you would likely get this from req.body (e.g., req.body.recipientEmail)
//     const info = await transporter.sendMail({
//       from: 'gatikwrking@gmail.com', // Sender email address
//       to: "modesta.fisher@ethereal.email", // Recipient email address
//       subject: "YOU ARE BLOCKED", // Email subject
//       text: "You have Been Blocked from API and this is a conformational mail that YOU ARE BLOCKED!!!!!!!!!!!!!!!!!!!!!", // Plain-text body of the email
//       // You can also add an HTML body: html: "<b>Hello world?</b>",
//     });

//     // Log the message ID returned by the email service
//     console.log("Message sent:", info.messageId);
//     console.log("Email sent successfully!");

//     // --- START OF HIGHLIGHTED CHANGE ---
//     // Explicitly check if 'next' is a function before calling it.
//     // This helps in diagnosing if 'next' is unexpectedly undefined or null,
//     // which was the cause of the "TypeError: next is not a function".
//     if (typeof next === 'function') {
//       // Call next() to pass control to the next middleware function in the stack.
//       // This is the standard behavior for Express middleware.
//       next();
//     } else {
//       // If 'next' is not a function, it means this middleware was likely
//       // not called in a standard Express route context (e.g., called directly
//       // as a regular function instead of as part of an Express route).
//       console.error("Error: 'next' is not a function. This middleware might not be used correctly in an Express route.");
//       // Send a 500 error response to terminate the request gracefully.
//       // This ensures the server doesn't hang if 'next' cannot be called.
//       return res.status(500).json({
//         status: "Failed To Process Request",
//         message: "Server internal error: Middleware chain issue (next not found).",
//       });
//     }
//     // --- END OF HIGHLIGHTED CHANGE ---

//     // Call next() to pass control to the next middleware function in the stack.
//     // If this function is the final handler for a route, you might instead
//     // send a success response (e.g., res.status(200).send('Email sent successfully')).

//   } catch (error) {
//     // Log any errors that occur during the email sending process
//     console.log("Error sending email:", error);

//     // Send an error response to the client.
//     // It's good practice to send a specific status code and error message.
//     // You can also choose to call next(error) to pass the error to a centralized
//     // Express error-handling middleware if you have one setup.
//     return res.status(500).json({
//       status: "Failed To Send Email",
//       message: error.message || "An unknown error occurred while sending the email.",
//     });
//   }
// };

// // Example Express route where you would use the 'seendmail' middleware.
// // You can access this route by sending a POST request to /send-blocked-email
// app.post('/send-blocked-email', module.exports.seendmail, (req, res) => {
//   // This code will run after the 'seendmail' middleware calls next()
//   res.status(200).json({
//     status: "Success",
//     message: "Email sending process initiated and route continued.",
//   });
// });

// Import necessary modules
const express = require("express");
const app = express(); // Correctly initialize the Express app
require("dotenv").config(); // Load environment variables from .env file (still good practice for other variables)
const nodemailer = require("nodemailer"); // Import Nodemailer for email sending

// Middleware to parse JSON bodies in requests (if you'll be sending data via POST)
app.use(express.json());

// Create a Nodemailer transporter globally.
// This transporter will use your Gmail credentials.
// The password is now hardcoded directly.
const transporter = nodemailer.createTransport({
  secure: true, // Use SMTPS (secure connection)
  host: "smtp.gmail.com", // Gmail's SMTP host
  port: 465, // Standard port for SMTPS
  auth: {
    user: "gatikwrking@gmail.com", // Your Gmail address
    // WARNING: Hardcoding password is NOT recommended for production environments.
    // Replace "YOUR_HARDCODED_GMAIL_APP_PASSWORD_HERE" with your actual Gmail App Password.
    pass: "nefysbwuonxlalws", // Replace with your actual Gmail App Password
  },
});

/**
 * Middleware function to send an email.
 * This function expects to be used in an Express route.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {function} next - The callback function to pass control to the next middleware.
 */
module.exports.seendmail = async (req, res, next) => {
  try {
    // Log that an email sending attempt is being made
    console.log("Attempting to send email...");

    // Send the email using the globally defined transporter.
    const info = await transporter.sendMail({
      from: 'gatikwrking@gmail.com', // Sender email address
      to: "modesta.fisher@ethereal.email", // Recipient email address (hardcoded for this example)
      subject: "YOU ARE BLOCKED", // Email subject
      text: "You have Been Blocked from API and this is a conformational mail that YOU ARE BLOCKED!!!!!!!!!!!!!!!!!!!!!", // Plain-text body
    });

    // Log the message ID returned by the email service
    console.log("Message sent:", info.messageId);
    console.log("Email sent successfully!");

    // --- START OF HIGHLIGHTED CHANGE ---
    // Explicitly check if 'next' is a function before calling it.
    // This helps in diagnosing if 'next' is unexpectedly undefined or null,
    // which was the cause of the "TypeError: next is not a function".
    if (typeof next === 'function') {
      // Call next() to pass control to the next middleware function in the stack.
      // This is the standard behavior for Express middleware.
      next();
    } else {
      // If 'next' is not a function, it means this middleware was likely
      // not called in a standard Express route context (e.g., called directly
      // as a regular function instead of as part of an Express route).
      console.error("Error: 'next' is not a function. This middleware might not be used correctly in an Express route.");
      // Send a 500 error response to terminate the request gracefully.
      // This ensures the server doesn't hang if 'next' cannot be called.
      // return res.status(500).json({
      //   status: "Failed To Process Request",
      //   message: "Server internal error: Middleware chain issue (next not found).",
      // });
    }
    // --- END OF HIGHLIGHTED CHANGE ---

  } catch (error) {
    // Log any errors that occur during the email sending process
    console.log("Error sending email or processing request:", error);

    // Send an error response to the client.
    // It's good practice to send a specific status code and error message.
    // You can also choose to call next(error) to pass the error to a centralized
    // Express error-handling middleware if you have one setup.
    // return res.status(500).json({
    //   status: "Failed To Send Email",
    //   message: error.message || "An unknown error occurred while sending the email.",
    // });
  }
};

// Example Express route where you would use the 'seendmail' middleware.
// You can access this route by sending a POST request to /send-blocked-email
app.post('/send-blocked-email', module.exports.seendmail, (req, res) => {
  // This code will run after the 'seendmail' middleware calls next()
  res.status(200).json({
    status: "Success",
    message: "Email sending process initiated and route continued.",
  });
});
