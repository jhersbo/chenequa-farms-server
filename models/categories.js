'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class categories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ inventory }) {
      this.hasMany(inventory, {
        foreignKey: "category_id"
      })
    }
  }
  categories.init({
    category_id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    category_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    category_thumbnail: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'categories',
    tableName: 'categories',
    timestamps: false
  });
  return categories;
};