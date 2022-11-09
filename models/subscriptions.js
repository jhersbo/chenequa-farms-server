'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class subscriptions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ user_auth }) {
      this.belongsTo(user_auth, {
        foreignKey: "user_id"
      })
    }
  }
  subscriptions.init({
    sub_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    purch_date: {
      type: DataTypes.STRING,
      allowNull: false
    },
    renew_date: {
      type: DataTypes.STRING,
      allowNull: false
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    rate: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'subscriptions',
    tableName: "subscriptions",
    timestamps: false
  });
  return subscriptions;
};