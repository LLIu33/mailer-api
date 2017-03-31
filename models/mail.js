"use strict";

var Sequelize = require("sequelize");

module.exports = function(sequelize, DataTypes) {
  var Mail = sequelize.define('Mail', {
    id: {
      type: Sequelize.INTEGER(11),
      field: 'id',
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    from: {
      type: Sequelize.STRING(45),
      field: 'from',
      allowNull: false
    },
    to: {
      type: Sequelize.STRING(45),
      field: 'to',
      allowNull: false
    },
    subject: {
      type: Sequelize.STRING(45),
      field: 'subject',
      allowNull: false
    },
    content: {
      type: Sequelize.STRING(255),
      field: 'content',
      allowNull: false
    },
    created_at: {
      type: Sequelize.DATE,
      field: 'created_at',
      defaultValue: Sequelize.NOW,
      allowNull: false
    },
  }, {
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
    tableName: 'mail_log'
  });
  return Mail;
};
