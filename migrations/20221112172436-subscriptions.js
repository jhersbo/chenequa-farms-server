'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('subscriptions', {
      sub_id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
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
      rate: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('subscriptions');
  }
};
