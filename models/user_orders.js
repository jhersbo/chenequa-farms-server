'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ user_auth, inventory }) {
      this.belongsTo(user_auth, {
        foreignKey: "user_id"
      })

      this.belongsTo(inventory, {
        foreignKey: "order_content"
      })
    }
  }
  user_orders.init({
    order_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    order_price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    order_content: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false
    },
    filled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    date_created: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date_filled: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'user_orders',
    tableName: "user_orders",
    timestamps: false
  });
  return user_orders;
};