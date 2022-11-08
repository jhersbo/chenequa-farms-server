'use strict';

const inventorySeed = [
  {
    item_id: "0",
    category: "Flowers",
    description: "Boquet of {name} flowers.",
    number_remaining: 12,
    price: 19.50,
    photo_path: "https://placekitten.com/200/300"
  },
  {
    item_id: "1",
    category: "Soap",
    description: "{Kind} of Soap",
    number_remaining: 2,
    price: 8,
    photo_path: "https://placekitten.com/200/300"
  }
]

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert("inventory", inventorySeed, {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkInsert("inventory", null, {})
  }
};