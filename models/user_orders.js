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
        foreignKey: "item_id"
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
    order_content: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false
    },
    //item_ids will look like this:
    // item_ids = [{item_id: string, qty: number}]
    filled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'user_orders',
    tableName: "user_orders"
  });
  return user_orders;
};