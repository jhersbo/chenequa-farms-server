'use strict';

const userSeed = [
  {
    user_id: "0",
    email_address: "johndoe@gmail.com",
    password_hash: "#hash",
    first_name: "John",
    last_name: "Doe",
  },
  {
    user_id: "1",
    email_address: "janedoe@gmail.com",
    password_hash: "#hash",
    first_name: "Jane",
    last_name: "Doe",
  },
  {
    user_id: "2",
    email_address: "amandacramirez17@gmail.com",
    password_hash: "#hash",
    first_name: "Amanda",
    last_name: "Ramirez",
  },
  {
    user_id: "83721662345",
    email_address: "cummaster69@gmail.com",
    password_hash: "$2b$10$ESAu/hfBSebKHnFDVWXib.Ws34bT7ZSrZLWmtHnqHij54OaU0G2Gq",
    first_name: "Alex",
    last_name: "Gapinski"
  }
]



module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('user_auth', userSeed, {})
  },

  async down (queryInterface, Sequelize) {
    queryInterface.bulkDelete('user_auth', null, {})
  }
};
