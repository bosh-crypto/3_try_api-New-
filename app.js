require("dotenv").config();
// const port = 3000;
const express = require("express");
const app = express();
const PORT = process.env.APP_PORT || 4000;
app.use(express.json());
const fs = require("fs");

// const path = require('path');
// app.use(express.static(path.join(__dirname,"./viwes")));
// app.post(express.urlencoded({extended:false}))

const crypto = require("crypto");

const privateKeyPath = "./key/private.pem";
const publicKeyPath = "./key/public.pem";

// Check if either key file already exists
if (!fs.existsSync(privateKeyPath) || !fs.existsSync(publicKeyPath)) {
  console.log("Generating new RSA key pair...");
  try {
    const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 4096, // Recommended for strong security
      publicKeyEncoding: {
        type: "pkcs1", // Common format for public keys
        format: "pem", // PEM format is human-readable
      },
      privateKeyEncoding: {
        type: "pkcs8", // Common format for private keys
        format: "pem", // PEM format is human-readable
      },
    });

    // Write the private key to a file
    fs.writeFile(privateKeyPath, privateKey, (err) => {
      if (err) {
        console.error(`Error writing private key to '${privateKeyPath}':`, err);
        return;
      }
      console.log(`Private key saved to '${privateKeyPath}'.`);
    });

    // Write the public key to a file
    fs.writeFile(publicKeyPath, publicKey, (err) => {
      if (err) {
        console.error(`Error writing public key to '${publicKeyPath}':`, err);
        return;
      }
      console.log(`Public key saved to '${publicKeyPath}'.`);
    });
  } catch (error) {
    console.error("Error generating key pair:", error);
  }
} else {
  console.log(
    `Key files ('${privateKeyPath}' and '${publicKeyPath}') already exist. Skipping generation.`
  );
}
require("./route/router")(app);

app.listen(PORT, () => console.log(`Example app listening on port !`, PORT));
