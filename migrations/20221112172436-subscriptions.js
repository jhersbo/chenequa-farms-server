'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('subscriptions', {
      sub_id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      sub_type_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: {
            tableName: "sub_types",
            schema: "public"
          },
          key: "sub_type_id"
        }
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
      purch_date: {
        type: Sequelize.STRING,
        allowNull: false
      },
      renew_date: {
        type: Sequelize.STRING,
        allowNull: false
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      price: {
        type: Sequelize.FLOAT,
        allowNull: false
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('subscriptions');
  }
};