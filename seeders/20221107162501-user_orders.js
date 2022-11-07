'use strict';

const userOrdersSeed = [
  {
    order_id: "0",
    user_id: "2",
    item_id: "0"
  },
  {
    order_id: "1",
    user_id: "2",
    item_id: "1"
  }
]


module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert("user_orders", userOrdersSeed, {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("user_orders", null, {})
  }
};
