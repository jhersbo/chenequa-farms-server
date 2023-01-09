'use strict';

const subscriptionsSeed = [
  {
    sub_id: "0",
    user_id: "2",
    sub_type_id: "093230394",
    sub_name: "Flowers: Weekly",
    purch_date: String(Date.now()),
    renew_date: String(Date.now() + 604800000),
    active: true,
    price: 50.00,
  },
  {
    sub_id: "1",
    user_id: "61eaec111179508352f8",
    sub_type_id: "093230394",
    sub_name: "Flowers: Weekly",
    purch_date: String(Date.now()),
    renew_date: String(Date.now() + 604800000),
    active: true,
    price: 80.50,
  },
  {
    sub_id: "2",
    user_id: "61eaec111179508352f8",
    sub_type_id: "3902410958584",
    sub_name: "Flowers: Biweekly",
    purch_date: String(Date.now()),
    renew_date: String(Date.now() + 1209600000),
    active: true,
    price: 50.00,
  }
]

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert("subscriptions", subscriptionsSeed, {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("subscriptions", null, {})
  }
};
