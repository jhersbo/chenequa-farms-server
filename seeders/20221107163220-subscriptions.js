'use strict';

const subscriptionsSeed = [
  {
    sub_id: "0",
    user_id: "2",
    purch_date: new Date(),
    renew_date: new Date(),
    active: true,
    rate: "50",
    type: "flowers-biweekly"
  },
  {
    sub_id: "1",
    user_id: "2",
    purch_date: new Date(),
    renew_date: new Date(),
    active: true,
    rate: "10",
    type: "soap-biweekly"
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
