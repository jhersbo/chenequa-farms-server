'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class sub_types extends Model {
    static associate({ subscriptions }) {
      this.hasMany(subscriptions, {
        foreignKey: "sub_type_id"
      })
    }
  }
  sub_types.init({
    sub_type_id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    number_available: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    photo_path: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'sub_types',
    tableName: 'sub_types',
    timestamps: false
  });
  return sub_types;
};