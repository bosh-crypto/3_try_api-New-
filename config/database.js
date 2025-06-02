const { Sequelize} = require('sequelize');
// const db = require('../db/models');
const env = process.env.NODE_ENV || "devlopment";
require('dotenv').config();

let options = {
  multipleStatements: true,
  connectTimeout: 180000,
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
  dialect: "mysql",
};
let poolOption = {
  max: 100,
  min: 0,
  idle: 10000,
  acquire: 100 * 1000,
};

// Sequelize instance for your app
const other = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    dialectOptions: options,
    pool: poolOption,
  }
);

// ✅ Connect to DB (App-side only)
other.authenticate()
  .then(() => {
    console.log("Authenticate successfully and Connected to db");
  })
  .catch((err) => {
    console.log("Error while connecting to db", err);
  });

//  Export Sequelize instance for app, config object for CLI
// if (require.main === module) {
//   module.exports = {
//     development: {
//       username: process.env.DB_USERNAME,
//       password: process.env.DB_PASSWORD,
//       database: process.env.DB_NAME,
//       host: process.env.DB_HOST,
//       dialect: 'postgres',
//       dialectOptions: options,
//       pool: poolOption
//     }
//   };
// } else {
//   // Required by app
//   module.exports = {other};
// }


module.exports = {db:other}