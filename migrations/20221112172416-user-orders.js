'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_orders', {
      order_id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: {
            tableName: "user_auth",
            schema: "public"
          },
          key: "user_id"
        }
      },
      order_price: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      order_content: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false
      },
      filled: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      date_created: {
        type: Sequelize.STRING,
        allowNull: false
      },
      date_filled: {
        type: Sequelize.STRING,
        allowNull: true
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_orders');
  }
};