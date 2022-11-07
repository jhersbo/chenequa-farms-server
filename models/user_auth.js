'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_auth extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ user_orders, subscriptions }) {
      this.hasMany(user_orders, {
        foreignKey: "user_id",
      })

      this.hasMany(subscriptions, {
        foreignKey: "user_id"
      })
    }
  }
  user_auth.init({
    user_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    email_address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'user_auth',
    tableName: "user_auth",
    timestamps: false
  });
  return user_auth;
};