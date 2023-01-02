'use strict';

const userOrdersSeed = [
  {
    order_id: "1293404532157few02931845",
    user_id: "61eaec111179508352f8",
    order_price: 100,
    order_content: [
      JSON.stringify({
        item: {
          item_id: "121555e33323411432",
          category_id: "1",
          name: "Soap of the year",
          description: "Good soap",
          number_remaining: 1000,
          price: 135,
          photo_path: "https://placekitten.com/200/300",
        },
        qty: 3
      })
    ],
    filled: false,
    date_created: new Date().toString(),
    date_filled: null
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
