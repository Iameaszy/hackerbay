const Sequelize = require('sequelize');
const {
  sequelize,
} = require('../../config/db/psql.js');


const WebsiteModel = sequelize.define(
  'website', {
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
    userid: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },
);
module.exports = {
  WebsiteModel,
};
