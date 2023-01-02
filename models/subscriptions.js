'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class subscriptions extends Model {

    static associate({ user_auth, sub_types }) {
      this.belongsTo(user_auth, {
        foreignKey: "user_id"
      })

      this.belongsTo(sub_types, {
        foreignKey: "sub_type_id"
      })
    }
  }
  subscriptions.init({
    sub_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    sub_type_id:{
      type: DataTypes.STRING,
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
    price: {
      type: DataTypes.FLOAT,
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