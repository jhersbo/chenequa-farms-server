'use strict';

const sub_typeSeed = [
  {
    sub_type_id: "093230394",
    name: "Flowers: Weekly",
    description: "Pick up flowers every week.",
    price: 80.5,
    number_available: 15,
    frequency: 604800000,
    photo_path: "https://placekitten.com/200/300"
  },
  {
    sub_type_id: "3902410958584",
    name: "Flowers: Biweekly",
    description: "Pick up flowers every other week.",
    price: 50.00,
    number_available: 12,
    frequency: 1209600000,
    photo_path: "https://placekitten.com/200/300"
  },
  {
    sub_type_id: "2891703240544",
    name: "Soap: Weekly",
    description: "Pick up soap every week.",
    price: 80.5,
    number_available: 15,
    frequency: 604800000,
    photo_path: "https://placekitten.com/200/300"
  },
  {
    sub_type_id: "39340123954222",
    name: "Soap: Biweekly",
    description: "Pick up soap every week.",
    price: 50.00,
    number_available: 12,
    frequency: 1209600000,
    photo_path: "https://placekitten.com/200/300"
  }
]

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert("sub_types", sub_typeSeed, {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("sub_types", null, {})
  }
};
