'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class inventory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ user_orders }) {
      this.hasMany(user_orders, {
        foreignKey: "item_id"
      })
    }
  }
  inventory.init({
    item_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    category:{
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    number_remaining: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price:{
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    photo_path: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'inventory',
    tableName: "inventory"
  });
  return inventory;
};