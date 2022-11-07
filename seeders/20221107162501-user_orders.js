'use strict';

const userOrdersSeed = [
  {
    order_id: "0",
    user_id: "2",
    order_content: [
      JSON.stringify(
        {
          item_id: "1",
          qty: 1
        }
      ),
      JSON.stringify(
        {
          item_id: "0",
          qty: 2
        }
      )
    ]
  },
  {
    order_id: "1",
    user_id: "2",
    order_content: [
      JSON.stringify(
        {
          item_id: "1",
          qty: 1
        }
      ),
      JSON.stringify(
        {
          item_id: "0",
          qty: 2
        }
      )
    ]
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
