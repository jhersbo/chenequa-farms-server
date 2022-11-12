'use strict';

const categoriesSeed = [
  {
    category_id: "0",
    category_name: "Flowers",
    category_thumbnail: "https://placekitten.com/200/300"

  },
  {
    category_id: "1",
    category_name: "Soap",
    category_thumbnail: "https://placekitten.com/200/300"
  },
  {
    category_id: "2",
    category_name: "Bee Products",
    category_thumbnail: "https://placekitten.com/200/300"
  }
]

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert("categories", categoriesSeed, {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkInsert("categories", null, {})
  }
};
