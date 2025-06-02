// 'use strict';
// const {
//   Model,
//   Sequelize,
//   DataTypes
// } = require('sequelize');

// const bcrypt = require("bcrypt");

// const sequelize_database = require('../../config/database');

// module.exports = sequelize_database.other.define('users' ,{
//     id: {
//       allowNull: false,
//       autoIncrement: true,
//       primaryKey: true,
//       type: DataTypes.INTEGER
//     },
//     userType: {
//       type: DataTypes.ENUM('0','1','2')
//     },
//     firstName: {
//       type: DataTypes.STRING
//     },
//     lastName: {
//       type: DataTypes.STRING
//     },
//     email:{
//       type: DataTypes.STRING
//     },
//     password: {
//       type: DataTypes.STRING
//     },
//     createdAt: {
//       allowNull: false,
//       type: DataTypes.DATE
//     },
//     updatedAt: {
//       allowNull: false,
//       type: DataTypes.DATE
//     },
//     deletedAt:{
//       type: DataTypes.DATE,
//     }
//   },{
//     paranoid: true,
//     freezeTableName: true,
//     modelName: "users",
//   });