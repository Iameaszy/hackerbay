const { UserModel } = require('./user');
const { db } = require('../../config/db/psql.js');

const { sequelize, Sequelize } = db;

const WebsiteModel = sequelize.define(
  'websites',
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
      unique: true,
      allowNull: false,
      defaultValue: 'online',
    },
    userId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'user',
        key: 'id',
      },
    },
  },
  {},
);
/*
WebsiteModel.prototype.toJSON = function doSomething() {
  const values = Object.assign({}, this.get());

  delete values.password;
  return values;
};
*/

sequelize
  .sync()
  .then(() => {
    console.log('website table created');
  })
  .catch(() => console.log('an error occurred while creating website table'));

module.exports = {
  WebsiteModel,
  sequelize,
};
