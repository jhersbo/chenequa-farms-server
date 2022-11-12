'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('inventory', {
      item_id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },
      category_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: {
            tableName: "categories",
            schema: "public"
          },
          key: "category_id"
        }
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      number_remaining: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      price: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      photo_path: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('inventory');
  }
};
