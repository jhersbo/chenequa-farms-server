'use strict';

const userOrdersSeed = [
  {
    order_id: "0",
    user_id: "2",
    order_price: 50,
    order_content: [
      JSON.stringify(
        {
          item_id: "1",
          name: "Natural Soap",
          qty: 1
        }
      ),
      JSON.stringify(
        {
          item_id: "0",
          name: "Flower Boquet",
          qty: 2
        }
      )
    ],
    filled: false
  },
  {
    order_id: "1",
    user_id: "61eaec111179508352f8",
    order_price: 50,
    order_content: [
      JSON.stringify(
        {
          item_id: "1",
          name: "Natural Soap",
          qty: 1
        }
      ),
      JSON.stringify(
        {
          item_id: "0",
          name: "Flower Boquet",
          qty: 2
        }
      )
    ],
    filled: false
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
