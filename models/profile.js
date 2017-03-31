"use strict";

var Sequelize = require("sequelize");

module.exports = function(sequelize, DataTypes) {
  var Profile = sequelize.define('Profile', {
    id:{
      type: Sequelize.INTEGER(11),
      field: 'id',
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id:{
      type: Sequelize.INTEGER(11),
      field: 'user_id',
      allowNull: false
    },
    first_name:{
      type: Sequelize.STRING(64),
      field: 'first_name',
      allowNull: false
    },
    last_name:{
      type: Sequelize.STRING(64),
      field: 'last_name',
      allowNull: false
    },
    smtp_server:{
      type: Sequelize.STRING(64),
      field: 'smtp_server',
      allowNull: true,
      defaultValue: null
    },
    smtp_username:{
      type: Sequelize.STRING(64),
      field: 'smtp_username',
      allowNull: true,
      defaultValue: null
    },
    smtp_password:{
      type: Sequelize.STRING(64),
      field: 'smtp_password',
      allowNull: true,
      defaultValue: null
    },
    smtp_port:{
      type: Sequelize.INTEGER(11),
      field: 'smtp_port',
      allowNull: true
    }
  },
  {
    // don't add the timestamp attributes (updatedAt, createdAt)
    timestamps: false,

    // don't delete database entries but set the newly added attribute deletedAt
    // to the current date (when deletion was done). paranoid will only work if
    // timestamps are enabled
    paranoid: true,

    // don't use camelcase for automatically added attributes but underscore style
    // so updatedAt will be updated_at
    underscored: true,

    // disable the modification of tablenames; By default, sequelize will automatically
    // transform all passed model names (first parameter of define) into plural.
    // if you don't want that, set the following
    freezeTableName: true,

    // define the table's name
    tableName: 'profiles'
  });
  return Profile;
};
