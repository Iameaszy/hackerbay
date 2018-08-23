const Sequelize = require('sequelize');
const { sequelize } = require('../../config/db/psql.js');


const WebsiteModel = sequelize.define(
  'website',
  {
    name: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    url: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'online',
    },
    userId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },
);
<<<<<<< HEAD


=======


>>>>>>> 750a765eeb864670ad2986b1755be89ec359abb8
module.exports = { WebsiteModel };
