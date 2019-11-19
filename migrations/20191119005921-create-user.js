'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    password: Sequelize.STRING,
    googleId: {
      type: Sequelize.STRING,
      unique: true
    },
    facebookId: {
      type: Sequelize.STRING,
      unique: true
    },
    twitterId: {
      type: Sequelize.STRING,
      unique: true
    },
    linkedInId: {
      type: Sequelize.STRING,
      unique: true
    },
    githubId: {
      type: Sequelize.STRING,
      unique: true
    },
    resetPasswordExpires: Sequelize.DATE,
    resetPasswordToken: Sequelize.STRING,
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
    logins: Sequelize.INTEGER,
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
      isEmail: true
    },
    emailVerified: { 
      type: Sequelize.BOOLEAN, 
      allowNull: false, 
      defaultValue: false
    },
    profile: {
      type: Sequelize.JSON,
      defaultValue: {}
    },
    tokens: {
      type: Sequelize.JSON,
      defaultValue: {}
    },
    emailVerificationToken: Sequelize.STRING,
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('User');
  }
};